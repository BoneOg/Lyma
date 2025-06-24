<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
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
        ];

        return Inertia::render('reservation', [
            'timeSlots' => $timeSlots,
            'systemSettings' => $systemSettings,
        ]);
    }

    public function getOccupiedTimeSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after:today',
        ]);

        $date = $request->date;
        $capacity = SystemSetting::getCapacity();
        $occupiedTimeSlots = Reservation::where('reservation_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->selectRaw('time_slot_id, COUNT(*) as reservation_count')
            ->groupBy('time_slot_id')
            ->havingRaw('COUNT(*) >= ?', [$capacity])
            ->pluck('time_slot_id')
            ->toArray();

        return response()->json(['occupied_time_slots' => $occupiedTimeSlots]);
    }

    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // No table assignment, just create reservation
            $reservation = Reservation::create([
                'guest_first_name' => $validated['guest_first_name'],
                'guest_last_name' => $validated['guest_last_name'],
                'guest_email' => $validated['guest_email'],
                'guest_phone' => $validated['guest_phone'],
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
}