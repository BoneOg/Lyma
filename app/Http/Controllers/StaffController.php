<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\DisabledTimeSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{

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
                ];
            });

        $systemSettings = [
            'max_advance_booking_days' => \App\Models\SystemSetting::getMaxAdvanceBookingDays(),
            'min_guest_size' => \App\Models\SystemSetting::get('min_guest_size'),
            'max_guest_size' => \App\Models\SystemSetting::get('max_guest_size'),
        ];

        return Inertia::render('staff/staffbooking', [
            'timeSlots' => $timeSlots,
            'systemSettings' => $systemSettings,
        ]);
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
                'time_slot' => $r->timeSlot ? $r->timeSlot->start_time_formatted : null,
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
            
            \Log::info('Reservation completed by staff', ['id' => $id, 'user_id' => auth()->id()]);
            
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
            \Log::error('Error completing reservation by staff', ['id' => $id, 'error' => $e->getMessage()]);
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
            
            \Log::info('Reservation cancelled by staff', ['id' => $id, 'user_id' => auth()->id()]);
            
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
            \Log::error('Error cancelling reservation by staff', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel reservation'
            ], 500);
        }
    }

    public function quickReservation(Request $request)
    {
        $validated = $request->validate([
            'guest_first_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            'guest_last_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            'guest_email' => ['required', 'email', 'max:100'],
            'guest_phone' => ['required', 'string', 'max:20', 'regex:/^[\d\s\-\+]+$/'],
            'special_requests' => ['nullable', 'string', 'max:500'],
            'reservation_date' => ['required', 'date', 'after_or_equal:today'],
            'time_slot_id' => ['nullable', 'exists:time_slots,id'],
            'guest_count' => ['required', 'integer', 'min:1', 'max:50'],
            'is_special_hours' => ['boolean'],
        ]);

        try {
            $reservation = \App\Models\Reservation::create([
                'guest_first_name' => $validated['guest_first_name'],
                'guest_last_name' => $validated['guest_last_name'],
                'guest_email' => $validated['guest_email'],
                'guest_phone' => $validated['guest_phone'],
                'special_requests' => $validated['special_requests'] ?? null,
                'reservation_date' => $validated['reservation_date'],
                'time_slot_id' => $validated['time_slot_id'],
                'guest_count' => $validated['guest_count'],
                'status' => 'confirmed',
            ]);
            return response()->json(['success' => true, 'reservation' => $reservation]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to create reservation: ' . $e->getMessage()], 500);
        }
    }
} 