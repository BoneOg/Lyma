<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use App\Models\Reservation;
use App\Models\DisabledTimeSlot;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('admin/admindashboard');
    }

    public function transactions()
    {
        return Inertia::render('admin/transactions');
    }

    public function booking()
    {
        $timeSlots = \App\Models\TimeSlot::active()
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
            'max_advance_booking_days' => \App\Models\SystemSetting::getMaxAdvanceBookingDays(),
            'min_guest_size' => \App\Models\SystemSetting::get('min_guest_size'),
            'max_guest_size' => \App\Models\SystemSetting::get('max_guest_size'),
        ];

        return Inertia::render('admin/adminbooking', [
            'timeSlots' => $timeSlots,
            'systemSettings' => $systemSettings,
        ]);
    }

    public function setting()
    {
        $settings = [
            'restaurant_name' => \App\Models\SystemSetting::getRestaurantName(),
            'restaurant_address' => \App\Models\SystemSetting::getRestaurantAddress(),
            'restaurant_email' => \App\Models\SystemSetting::getRestaurantEmail(),
            'restaurant_phone' => \App\Models\SystemSetting::getRestaurantPhone(),
        ];
        return Inertia::render('admin/adminsettings', [
            'settings' => $settings,
        ]);
    }

    public function updateRestaurantName(Request $request)
    {
        $request->validate([
            'restaurant_name' => 'required|string|max:255',
        ]);
        \App\Models\SystemSetting::set('restaurant_name', $request->restaurant_name, 'Restaurant Name');
        return response()->json(['success' => true]);
    }

    public function updateRestaurantPhone(Request $request)
    {
        $request->validate([
            'restaurant_phone' => ['required', 'regex:/^\+[1-9]\d{1,14}$/'], // E.164 format
        ]);
        \App\Models\SystemSetting::set('restaurant_phone', $request->restaurant_phone, 'Restaurant Contact Phone Number');
        return response()->json(['success' => true]);
    }

    public function updateRestaurantEmail(Request $request)
    {
        $request->validate([
            'restaurant_email' => 'required|email|max:255',
        ]);
        \App\Models\SystemSetting::set('restaurant_email', $request->restaurant_email, 'Restaurant Email');
        return response()->json(['success' => true]);
    }

    public function updateRestaurantAddress(Request $request)
    {
        $request->validate([
            'restaurant_address' => 'required|string|max:255',
        ]);
        \App\Models\SystemSetting::set('restaurant_address', $request->restaurant_address, 'Restaurant Address');
        return response()->json(['success' => true]);
    }


    public function reservationCounts()
    {
        return response()->json([
            'confirmed' => Reservation::where('status', 'confirmed')->count(),
            'completed' => Reservation::where('status', 'completed')->count(),
            'cancelled' => Reservation::where('status', 'cancelled')->count(),
            'all' => Reservation::whereNotIn('status', ['pending'])->count(),
        ]);
    }

    public function reservationList(Request $request)
    {
        $status = $request->query('status', 'all');
        $query = \App\Models\Reservation::query();
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        $reservations = $query->with('timeSlot')->orderByDesc('created_at')->get()->map(function ($r) {
            // Debug: Log the raw date value
            \Log::info('Reservation date debug', [
                'id' => $r->id,
                'raw_reservation_date' => $r->reservation_date,
                'formatted_date' => $r->reservation_date->format('Y-m-d'),
                'carbon_instance' => get_class($r->reservation_date),
            ]);
            
            // Get special hours data if this is a special hours reservation
            $specialHoursData = null;
            if (!$r->time_slot_id) {
                $specialHoursData = \App\Models\DisabledTimeSlot::where('date', $r->reservation_date)
                    ->whereNull('time_slot_id')
                    ->where('is_closed', false)
                    ->whereNotNull('special_start')
                    ->whereNotNull('special_end')
                    ->first();
            }
            
            return [
                'id' => $r->id,
                'guest_first_name' => $r->guest_first_name,
                'guest_last_name' => $r->guest_last_name,
                'reservation_date' => $r->reservation_date->format('Y-m-d'),
                'time_slot' => $r->timeSlot ? $r->timeSlot->start_time_formatted . ' - ' . $r->timeSlot->end_time_formatted : null,
                'guest_count' => $r->guest_count,
                'status' => $r->status,
                'email' => $r->guest_email,
                'phone' => $r->guest_phone,
                'special_requests' => $r->special_requests,
                'created_at' => $r->created_at,
                'updated_at' => $r->updated_at,
                'special_hours_data' => $specialHoursData ? [
                    'special_start' => \Carbon\Carbon::parse($specialHoursData->special_start)->format('g:i A'),
                    'special_end' => \Carbon\Carbon::parse($specialHoursData->special_end)->format('g:i A'),
                ] : null,
            ];
        });
        return response()->json(['reservations' => $reservations]);
    }

    public function completeReservation(Request $request, $id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            
            // Check if reservation can be completed
            if ($reservation->status === 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservation is already completed'
                ], 400);
            }
            
            if ($reservation->status === 'cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot complete a cancelled reservation'
                ], 400);
            }
            
            $reservation->update(['status' => 'completed']);
            
            \Log::info('Reservation completed', ['id' => $id, 'user_id' => auth()->id()]);
            
            return response()->json([
                'success' => true,
                'message' => 'Reservation completed successfully'
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Error completing reservation', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete reservation'
            ], 500);
        }
    }

    public function cancelReservation(Request $request, $id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            
            // Check if reservation can be cancelled
            if ($reservation->status === 'cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservation is already cancelled'
                ], 400);
            }
            
            if ($reservation->status === 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot cancel a completed reservation'
                ], 400);
            }
            
            $reservation->update(['status' => 'cancelled']);
            
            // Send cancellation email to customer
            try {
                $emailController = new \App\Http\Controllers\EmailController();
                $emailController->sendCancellationEmail($reservation);
            } catch (\Exception $e) {
                \Log::warning('Failed to send cancellation email', [
                    'reservation_id' => $id,
                    'error' => $e->getMessage()
                ]);
                // Don't fail the cancellation if email fails
            }
            
            \Log::info('Reservation cancelled', ['id' => $id, 'user_id' => auth()->id()]);
            
            return response()->json([
                'success' => true,
                'message' => 'Reservation cancelled successfully'
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Error cancelling reservation', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel reservation'
            ], 500);
        }
    }

    public function quickReservation(Request $request)
    {
        $request->validate([
            'guest_first_name' => 'required|string|max:255',
            'guest_last_name' => 'required|string|max:255',
            'guest_email' => 'nullable|email|max:255',
            'guest_phone' => 'required|string|max:20',
            'special_requests' => 'nullable|string|max:500',
            'reservation_date' => 'required|date|after_or_equal:today',
            'time_slot_id' => 'nullable|exists:time_slots,id',
            'guest_count' => 'required|integer|min:1|max:100',
            'is_special_hours' => 'boolean',
        ]);

        try {
            $reservation = Reservation::create([
                'guest_first_name' => $request->guest_first_name,
                'guest_last_name' => $request->guest_last_name,
                'guest_email' => $request->guest_email ?: null,
                'guest_phone' => $request->guest_phone,
                'special_requests' => $request->special_requests,
                'reservation_date' => $request->reservation_date,
                'time_slot_id' => $request->is_special_hours ? null : $request->time_slot_id,
                'guest_count' => $request->guest_count,
                'status' => 'confirmed',
                'user_id' => auth()->id(),
                'is_special_hours' => $request->is_special_hours ?? false,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully',
                'reservation' => $reservation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // --- Time Slot API ---
    public function getTimeSlots()
    {
        $timeSlots = \App\Models\TimeSlot::orderBy('start_time')->get();
        return response()->json(['timeSlots' => $timeSlots]);
    }

    public function storeTimeSlot(Request $request)
    {
        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);
        // Convert to H:i:s for DB
        $start = $validated['start_time'] . ':00';
        $end = $validated['end_time'] . ':00';
        $slot = \App\Models\TimeSlot::create([
            'start_time' => $start,
            'end_time' => $end,
            'is_active' => true,
        ]);
        return response()->json(['success' => true, 'timeSlot' => $slot]);
    }

    public function updateTimeSlot(Request $request, $id)
    {
        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);
        $slot = \App\Models\TimeSlot::findOrFail($id);
        $slot->start_time = $validated['start_time'] . ':00';
        $slot->end_time = $validated['end_time'] . ':00';
        $slot->save();
        return response()->json(['success' => true, 'timeSlot' => $slot]);
    }

    public function deleteTimeSlot($id)
    {
        $slot = \App\Models\TimeSlot::findOrFail($id);
        $slot->delete();
        return response()->json(['success' => true]);
    }

    // Disable a time slot for a specific date
    public function disableTimeSlotForDate(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'time_slot_id' => 'required|exists:time_slots,id',
            'enable' => 'sometimes|boolean',
        ]);
        if ($request->boolean('enable', false)) {
            // Enable: delete the row if exists
            DisabledTimeSlot::where('date', $validated['date'])
                ->where('time_slot_id', $validated['time_slot_id'])
                ->delete();
        } else {
            // Disable: create if not exists
            DisabledTimeSlot::firstOrCreate([
                'date' => $validated['date'],
                'time_slot_id' => $validated['time_slot_id'],
            ]);
        }
        return response()->json(['success' => true, 'date' => $validated['date'], 'time_slot_id' => $validated['time_slot_id']]);
    }

    // Set special hours for a date
    public function setSpecialHoursForDate(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'special_start' => 'required|date_format:H:i',
            'special_end' => 'required|date_format:H:i|after:special_start',
        ]);
        \App\Models\DisabledTimeSlot::updateOrCreate(
            [
                'date' => $validated['date'],
                'time_slot_id' => null,
            ],
            [
                'special_start' => $validated['special_start'],
                'special_end' => $validated['special_end'],
                'is_closed' => false,
            ]
        );
        return response()->json(['success' => true]);
    }

    // Set closed for a date
    public function setClosedForDate(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
        ]);
        \App\Models\DisabledTimeSlot::updateOrCreate(
            [
                'date' => $validated['date'],
                'time_slot_id' => null,
            ],
            [
                'is_closed' => true,
                'special_start' => null,
                'special_end' => null,
            ]
        );
        return response()->json(['success' => true]);
    }

    // Remove special hours or closed for a date (revert to normal)
    public function clearSpecialOrClosedForDate(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
        ]);
        \App\Models\DisabledTimeSlot::where('date', $validated['date'])->whereNull('time_slot_id')->delete();
        return response()->json(['success' => true]);
    }

    public function getDisabledTimeSlots(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2020',
        ]);
        $disabled = DisabledTimeSlot::whereYear('date', $validated['year'])
            ->whereMonth('date', $validated['month'])
            ->get();
        $specials = $disabled->where('time_slot_id', 0)->map(function ($row) {
            return [
                'date' => $row->date,
                'is_closed' => (bool)$row->is_closed,
                'special_start' => $row->special_start,
                'special_end' => $row->special_end,
            ];
        })->values();
        $disabledSlots = $disabled->where('time_slot_id', '!=', 0)->map(function ($row) {
            return [
                'date' => $row->date,
                'time_slot_id' => $row->time_slot_id,
            ];
        })->values();
        return response()->json([
            'specials' => $specials,
            'disabled' => $disabledSlots,
        ]);
    }

    // Update booking window (max advance booking days)
    public function updateBookingWindow(Request $request)
    {
        $validated = $request->validate([
            'max_advance_booking_days' => 'required|integer|min:1|max:365',
        ]);

        try {
            \App\Models\SystemSetting::set('max_advance_booking_days', $validated['max_advance_booking_days'], 'Maximum Advance Booking Days');
            
            return response()->json([
                'success' => true,
                'message' => 'Booking window updated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating booking window', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking window'
            ], 500);
        }
    }

    // Update capacity (available tables)
    public function updateCapacity(Request $request)
    {
        $validated = $request->validate([
            'capacity' => 'required|integer|min:1|max:100',
        ]);

        try {
            \App\Models\SystemSetting::set('capacity', $validated['capacity'], 'Restaurant Capacity');
            
            return response()->json([
                'success' => true,
                'message' => 'Available tables updated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating capacity', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update available tables'
            ], 500);
        }
    }

    // Get current booking window setting
    public function getBookingWindow()
    {
        try {
            $value = \App\Models\SystemSetting::getMaxAdvanceBookingDays();
            
            return response()->json([
                'success' => true,
                'value' => $value
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting booking window', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get booking window setting'
            ], 500);
        }
    }

    // Get current capacity setting
    public function getCapacity()
    {
        try {
            $value = \App\Models\SystemSetting::getCapacity();
            
            return response()->json([
                'success' => true,
                'value' => $value
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting capacity', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get capacity setting'
            ], 500);
        }
    }

    // Update minimum guest size
    public function updateMinGuestSize(Request $request)
    {
        $validated = $request->validate([
            'value' => 'required|integer|min:1|max:10',
        ]);

        try {
            \App\Models\SystemSetting::set('min_guest_size', $validated['value'], 'Minimum Guest Size');
            
            return response()->json([
                'success' => true,
                'message' => 'Minimum guest size updated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating minimum guest size', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update minimum guest size'
            ], 500);
        }
    }

    // Update maximum guest size
    public function updateMaxGuestSize(Request $request)
    {
        $validated = $request->validate([
            'value' => 'required|integer|min:1|max:100',
        ]);

        try {
            \App\Models\SystemSetting::set('max_guest_size', $validated['value'], 'Maximum Guest Size');
            
            return response()->json([
                'success' => true,
                'message' => 'Maximum guest size updated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating maximum guest size', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update maximum guest size'
            ], 500);
        }
    }

    // Get current minimum guest size setting
    public function getMinGuestSize()
    {
        try {
            $value = \App\Models\SystemSetting::get('min_guest_size');
            
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

    // Get current maximum guest size setting
    public function getMaxGuestSize()
    {
        try {
            $value = \App\Models\SystemSetting::get('max_guest_size');
            
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

    // Get current reminder hours setting
    public function getReminderHours()
    {
        try {
            $value = \App\Models\SystemSetting::get('reminder_hours', 2);
            
            return response()->json([
                'success' => true,
                'value' => $value
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting reminder hours', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get reminder hours setting'
            ], 500);
        }
    }

    // Update reminder hours setting
    public function updateReminderHours(Request $request)
    {
        $validated = $request->validate([
            'value' => 'required|integer|min:1|max:24',
        ]);

        try {
            \App\Models\SystemSetting::set('reminder_hours', $validated['value'], 'Reminder Hours');
            
            return response()->json([
                'success' => true,
                'message' => 'Reminder hours updated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating reminder hours', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update reminder hours'
            ], 500);
        }
    }

    // Send email reminders for upcoming reservations
    public function sendEmailReminders()
    {
        try {
            $emailController = new \App\Http\Controllers\EmailController();
            $result = $emailController->sendRemindersForUpcomingReservations();

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => "Reminders processed successfully. Sent: {$result['sent']}, Failed: {$result['failed']}",
                    'data' => $result
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'] ?? 'Failed to process reminders'
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Error sending email reminders', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email reminders: ' . $e->getMessage()
            ], 500);
        }
    }

    // Dashboard API endpoints
    public function getDashboardStats()
    {
        try {
            $today = now()->format('Y-m-d');
            $yesterday = now()->subDay()->format('Y-m-d');
            $lastWeek = now()->subWeek()->format('Y-m-d');

            // Get today's reservations
            $todayReservations = Reservation::where('reservation_date', $today)->get();
            $todayCount = $todayReservations->count();
            
            // Calculate today's average party size
            $todayTotalGuests = $todayReservations->sum('guest_count');
            $todayAvgPartySize = $todayCount > 0 ? round($todayTotalGuests / $todayCount) : 0;

            // Calculate overall average party size from all reservations (more meaningful for dashboard)
            $allReservations = Reservation::whereNotIn('status', ['pending'])->get();
            $overallTotalGuests = $allReservations->sum('guest_count');
            $overallAvgPartySize = $allReservations->count() > 0 ? round($overallTotalGuests / $allReservations->count()) : 0;

            // Get yesterday's reservations for trend comparison
            $yesterdayReservations = Reservation::where('reservation_date', $yesterday)->get();
            $yesterdayCount = $yesterdayReservations->count();

            // Get last week's data for trend comparison
            $lastWeekReservations = Reservation::where('reservation_date', '>=', $lastWeek)->get();
            $lastWeekTotalGuests = $lastWeekReservations->sum('guest_count');
            $lastWeekAvgPartySize = $lastWeekReservations->count() > 0 ? round($lastWeekTotalGuests / $lastWeekReservations->count()) : 0;

            // Get reservation counts by status
            $confirmedCount = Reservation::where('status', 'confirmed')->count();
            $completedCount = Reservation::where('status', 'completed')->count();
            $cancelledCount = Reservation::where('status', 'cancelled')->count();
            $totalCount = Reservation::whereNotIn('status', ['pending'])->count();

            // Get popular time slots
            $timeSlotStats = Reservation::selectRaw('time_slots.start_time, COUNT(*) as booking_count')
                ->join('time_slots', 'reservations.time_slot_id', '=', 'time_slots.id')
                ->groupBy('time_slots.start_time')
                ->orderByDesc('booking_count')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'time' => \Carbon\Carbon::parse($item->start_time)->format('g:i A'),
                        'bookings' => $item->booking_count
                    ];
                });

            // Get system health data
            $systemHealth = [
                'max_advance_days' => \App\Models\SystemSetting::getMaxAdvanceBookingDays(),
                'capacity' => \App\Models\SystemSetting::getCapacity(),
                'min_guest_size' => \App\Models\SystemSetting::get('min_guest_size'),
                'max_guest_size' => \App\Models\SystemSetting::get('max_guest_size'),
                'active_time_slots' => \App\Models\TimeSlot::where('is_active', true)->count()
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'total_reservations' => $totalCount,
                    'confirmed_reservations' => $confirmedCount,
                    'completed_reservations' => $completedCount,
                    'cancelled_reservations' => $cancelledCount,
                    'today' => [
                        'bookings' => $todayCount,
                        'avg_party_size' => $overallAvgPartySize, // Use overall average instead of just today's
                        'total_guests' => $todayTotalGuests
                    ],
                    'yesterday' => [
                        'bookings' => $yesterdayCount
                    ],
                    'last_week' => [
                        'avg_party_size' => $lastWeekAvgPartySize
                    ],
                    'time_slots' => $timeSlotStats,
                    'system_health' => $systemHealth,
                    'trends' => [
                        'bookings_change' => $todayCount - $yesterdayCount,
                        'party_size_change' => $todayAvgPartySize - $lastWeekAvgPartySize
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting dashboard stats', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get dashboard statistics'
            ], 500);
        }
    }

    public function getPopularTimeSlots()
    {
        try {
            $popularTimeSlots = Reservation::selectRaw('time_slots.start_time, COUNT(*) as booking_count')
                ->join('time_slots', 'reservations.time_slot_id', '=', 'time_slots.id')
                ->groupBy('time_slots.start_time')
                ->orderByDesc('booking_count')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'time' => \Carbon\Carbon::parse($item->start_time)->format('g:i A'),
                        'bookings' => $item->booking_count
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $popularTimeSlots
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting popular time slots', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get popular time slots'
            ], 500);
        }
    }

    public function getRecentActivity()
    {
        try {
            $recentReservations = Reservation::with('timeSlot')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($reservation) {
                    return [
                        'id' => $reservation->id,
                        'guest_name' => $reservation->guest_first_name . ' ' . $reservation->guest_last_name,
                        'date' => $reservation->reservation_date->format('M d, Y'),
                        'time' => $reservation->timeSlot ? $reservation->timeSlot->start_time_formatted : 'Special Hours',
                        'status' => $reservation->status,
                        'guest_count' => $reservation->guest_count,
                        'created_at' => $reservation->created_at->diffForHumans()
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $recentReservations
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting recent activity', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get recent activity'
            ], 500);
        }
    }

    // Download PDF reservations by date
    public function downloadReservationsPDF(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->date;
        $reservations = Reservation::whereDate('reservation_date', $date)
            ->with(['timeSlot'])
            ->orderBy('time_slot_id')
            ->get();

        // Get restaurant information
        $restaurantName = \App\Models\SystemSetting::getRestaurantName();
        $restaurantAddress = \App\Models\SystemSetting::getRestaurantAddress();
        $restaurantPhone = \App\Models\SystemSetting::getRestaurantPhone();
        $restaurantEmail = \App\Models\SystemSetting::getRestaurantEmail();

        // Generate PDF using DomPDF
        $pdf = Pdf::loadView('pdfs.reservations', [
            'reservations' => $reservations,
            'date' => $date,
            'restaurantName' => $restaurantName,
            'restaurantAddress' => $restaurantAddress,
            'restaurantPhone' => $restaurantPhone,
            'restaurantEmail' => $restaurantEmail,
        ]);

        $filename = 'reservations_' . date('Y-m-d', strtotime($date)) . '.pdf';
        
        return $pdf->download($filename);
    }
} 