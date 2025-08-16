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
                    'end_time_formatted' => $slot->end_time_formatted,
                ];
            });

        $systemSettings = [
            'max_advance_booking_days' => SystemSetting::getMaxAdvanceBookingDays(),
            'min_guest_size' => (int) SystemSetting::get('min_guest_size'),
            'max_guest_size' => (int) SystemSetting::get('max_guest_size'),
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
            ->notExpired()
            ->selectRaw('time_slot_id, COUNT(*) as reservation_count')
            ->groupBy('time_slot_id')
            ->havingRaw('COUNT(*) >= ?', [$capacity])
            ->pluck('time_slot_id')
            ->toArray();

        // Get disabled time slots for this date
        $disabledTimeSlots = \App\Models\DisabledTimeSlot::where('date', $date)
            ->whereNotNull('time_slot_id')
            ->pluck('time_slot_id')
            ->toArray();

        return response()->json([
            'occupied_time_slots' => $occupiedTimeSlots,
            'disabled_time_slots' => $disabledTimeSlots
        ]);
    }

    public function getFullyBookedDates(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2024',
        ]);

        $month = $request->month;
        $year = $request->year;
        $capacity = SystemSetting::getCapacity();
        $totalTimeSlots = TimeSlot::active()->count();

        // Get all dates in the month that have all time slots fully booked
        $fullyBookedDates = Reservation::whereYear('reservation_date', $year)
            ->whereMonth('reservation_date', $month)
            ->whereIn('status', ['pending', 'confirmed'])
            ->notExpired()
            ->selectRaw('reservation_date, time_slot_id, COUNT(*) as reservation_count')
            ->groupBy('reservation_date', 'time_slot_id')
            ->havingRaw('COUNT(*) >= ?', [$capacity])
            ->get()
            ->groupBy('reservation_date')
            ->filter(function ($dateReservations) use ($totalTimeSlots) {
                // Check if all time slots for this date are fully booked
                return $dateReservations->count() >= $totalTimeSlots;
            })
            ->keys()
            ->map(function ($date) {
                return Carbon::parse($date)->day;
            })
            ->toArray();

        return response()->json(['fully_booked_dates' => $fullyBookedDates]);
    }

    public function getClosedDates(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2024',
        ]);

        $month = $request->month;
        $year = $request->year;

        // Get all dates in the month that are completely closed
        $closedDates = \App\Models\DisabledTimeSlot::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->whereNull('time_slot_id')
            ->where('is_closed', true)
            ->get()
            ->map(function ($row) {
                return Carbon::parse($row->date)->day;
            })
            ->toArray();

        return response()->json(['closed_dates' => $closedDates]);
    }

    public function getSpecialHoursDates(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2024',
        ]);

        $month = $request->month;
        $year = $request->year;

        // Get all dates in the month that have special hours with their time ranges
        $specialHoursData = \App\Models\DisabledTimeSlot::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->whereNull('time_slot_id')
            ->where('is_closed', false)
            ->whereNotNull('special_start')
            ->whereNotNull('special_end')
            ->get()
            ->map(function ($row) {
                return [
                    'day' => Carbon::parse($row->date)->day,
                    'special_start' => Carbon::parse($row->special_start)->format('g:i A'),
                    'special_end' => Carbon::parse($row->special_end)->format('g:i A'),
                ];
            })
            ->toArray();

        return response()->json(['special_hours_data' => $specialHoursData]);
    }

    // Get minimum guest size setting
    public function getMinGuestSize()
    {
        try {
            $value = SystemSetting::get('min_guest_size');
            
            return response()->json([
                'success' => true,
                'value' => $value
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting minimum guest size', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get minimum guest size setting'
            ], 500);
        }
    }

    // Get maximum guest size setting
    public function getMaxGuestSize()
    {
        try {
            $value = SystemSetting::get('max_guest_size');
            
            return response()->json([
                'success' => true,
                'value' => $value
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting maximum guest size', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get maximum guest size setting'
            ], 500);
        }
    }

    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();

        // Log the incoming data for debugging
        \Log::info('Reservation creation request', [
            'all_data' => $request->all(),
            'validated_data' => $validated
        ]);

        try {
            DB::beginTransaction();

            // Check if this is a special hours reservation
            $isSpecialHours = $validated['is_special_hours'] ?? false;
            
            if ($isSpecialHours) {
                // For special hours, we need to validate the special hours data
                $specialHoursStart = $validated['special_hours_start'] ?? null;
                $specialHoursEnd = $validated['special_hours_end'] ?? null;
                
                if (!$specialHoursStart || !$specialHoursEnd) {
                    throw new \Exception('Special hours time range is required for special hours reservations.');
                }
                
                // Create reservation with special hours
                $reservation = Reservation::create([
                    'guest_first_name' => $validated['guest_first_name'],
                    'guest_last_name' => $validated['guest_last_name'],
                    'guest_email' => $validated['guest_email'],
                    'guest_phone' => $validated['guest_phone'],
                    'special_requests' => $validated['special_requests'] ?? null,
                    'reservation_date' => $validated['reservation_date'],
                    'time_slot_id' => null, // No specific time slot for special hours
                    'guest_count' => $validated['guest_count'],
                    'status' => 'pending', // Pending until reviewed in checkout
                    'is_special_hours' => true,
                    'special_hours_start' => $specialHoursStart,
                    'special_hours_end' => $specialHoursEnd,
                ]);
            } else {
                // Regular time slot reservation
                $reservation = Reservation::create([
                    'guest_first_name' => $validated['guest_first_name'],
                    'guest_last_name' => $validated['guest_last_name'],
                    'guest_email' => $validated['guest_email'],
                    'guest_phone' => $validated['guest_phone'],
                    'special_requests' => $validated['special_requests'] ?? null,
                    'reservation_date' => $validated['reservation_date'],
                    'time_slot_id' => $validated['time_slot_id'],
                    'guest_count' => $validated['guest_count'],
                    'status' => 'pending', // Pending until reviewed in checkout
                    'is_special_hours' => false,
                ]);
            }

            // Set expiration time (15 minutes from now)
            $reservation->setExpirationTime();

            DB::commit();

            // Redirect to checkout for review
            return redirect()->route('checkout', ['reservation' => $reservation->id])
                ->with('success', 'Reservation created successfully! Please review your details.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Reservation creation error', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);
            
            return back()->withErrors([
                'general' => 'An error occurred while creating your reservation. Please try again.'
            ])->withInput();
        }
    }
}