<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\Models\TimeSlot;
use App\Models\SystemSetting;
use App\Http\Requests\StoreReservationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index()
    {
        $timeSlots = TimeSlot::active()
            ->select('id', 'start_time', 'end_time')
            ->get()
            ->map(function ($slot) {
                return [
                    'id' => $slot->id,
                    'start_time' => $slot->start_time,
                    'end_time' => $slot->end_time,
                    'formatted_time' => $slot->formatted_time,
                    'start_time_formatted' => $slot->start_time_formatted,
                ];
            });

        $systemSettings = [
            'max_advance_booking_days' => SystemSetting::getMaxAdvanceBookingDays(),
            'min_advance_booking_hours' => SystemSetting::getMinAdvanceBookingHours(),
        ];

        return Inertia::render('reservation', [
            'timeSlots' => $timeSlots,
            'systemSettings' => $systemSettings,
        ]);
    }

    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // Find the best available table for the guest count
            $table = $this->findBestAvailableTable(
                $validated['guest_count'],
                $validated['reservation_date'],
                $validated['time_slot_id']
            );

            if (!$table) {
                return back()->withErrors([
                    'general' => 'No available tables for the selected date and time. Please choose a different time slot.'
                ]);
            }

            // Create the reservation
            $reservation = Reservation::create([
                'guest_first_name' => $validated['guest_first_name'],
                'guest_last_name' => $validated['guest_last_name'],
                'guest_email' => $validated['guest_email'],
                'guest_phone' => $validated['guest_phone'],
                'table_id' => $table->id,
                'reservation_date' => $validated['reservation_date'],
                'time_slot_id' => $validated['time_slot_id'],
                'guest_count' => $validated['guest_count'],
                'status' => 'pending',
            ]);

            DB::commit();

            // Redirect to checkout with reservation data
            return redirect()->route('checkout', ['reservation' => $reservation->id])
                ->with('success', 'Reservation created successfully! Please complete your payment.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'general' => 'An error occurred while creating your reservation. Please try again.'
            ])->withInput();
        }
    }

    private function findBestAvailableTable(int $guestCount, string $reservationDate, int $timeSlotId): ?RestaurantTable
    {
        $availableTables = RestaurantTable::available()
            ->where('capacity', '>=', $guestCount)
            ->whereDoesntHave('reservations', function ($query) use ($reservationDate, $timeSlotId) {
                $query->where('reservation_date', $reservationDate)
                      ->where('time_slot_id', $timeSlotId)
                      ->whereIn('status', ['pending', 'confirmed']);
            })
            ->orderBy('capacity', 'asc')
            ->get();

        // Return the first (smallest) available table
        return $availableTables->first();
    }

    // API endpoints for checking availability
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'time_slot_id' => 'required|exists:time_slots,id',
            'guest_count' => 'required|integer|min:1|max:8',
        ]);

        $table = $this->findBestAvailableTable(
            $request->guest_count,
            $request->date,
            $request->time_slot_id
        );

        return response()->json([
            'available' => (bool) $table,
            'table' => $table ? [
                'id' => $table->id,
                'table_number' => $table->table_number,
                'capacity' => $table->capacity,
                'location_description' => $table->location_description,
            ] : null,
        ]);
    }

    public function getAvailableTimeSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'guest_count' => 'required|integer|min:1|max:8',
        ]);

        $timeSlots = TimeSlot::active()->get();
        $availableTimeSlots = [];

        foreach ($timeSlots as $timeSlot) {
            $table = $this->findBestAvailableTable(
                $request->guest_count,
                $request->date,
                $timeSlot->id
            );

            if ($table) {
                $availableTimeSlots[] = [
                    'id' => $timeSlot->id,
                    'formatted_time' => $timeSlot->formatted_time,
                    'start_time_formatted' => $timeSlot->start_time_formatted,
                ];
            }
        }

        return response()->json([
            'available_time_slots' => $availableTimeSlots,
        ]);
    }
}