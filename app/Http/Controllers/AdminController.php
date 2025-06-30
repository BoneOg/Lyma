<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use App\Models\Reservation;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('admin/dashboard');
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
                ];
            });

        $systemSettings = [
            'max_advance_booking_days' => \App\Models\SystemSetting::getMaxAdvanceBookingDays(),
        ];

        return Inertia::render('admin/booking', [
            'timeSlots' => $timeSlots,
            'systemSettings' => $systemSettings,
        ]);
    }

    public function setting()
    {
        $settings = [
            'reservation_fee' => SystemSetting::getReservationFee(),
            'max_advance_booking_days' => SystemSetting::getMaxAdvanceBookingDays(),
            'restaurant_email' => SystemSetting::getRestaurantEmail(),
            'restaurant_phone' => SystemSetting::getRestaurantPhone(),
        ];

        return Inertia::render('admin/setting', [
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        \Log::info('Update settings request received', $request->all());
        
        try {
            $request->validate([
                'reservation_fee' => 'required|numeric|min:0',
                'max_advance_booking_days' => 'required|integer|min:1|max:365',
                'restaurant_email' => 'required|email',
                'restaurant_phone' => 'required|string|max:20|regex:/^[\d\s\-\+\(\)]+$/',
            ]);

            SystemSetting::set('reservation_fee', $request->reservation_fee, 'Reservation fee in pesos');
            SystemSetting::set('max_advance_booking_days', $request->max_advance_booking_days, 'Maximum days in advance for booking');
            SystemSetting::set('restaurant_email', $request->restaurant_email, 'Restaurant contact email');
            SystemSetting::set('restaurant_phone', $request->restaurant_phone, 'Restaurant contact phone');

            \Log::info('Settings updated successfully');

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in updateSettings', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating settings', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage()
            ], 500);
        }
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
                'created_at' => $r->created_at,
                'updated_at' => $r->updated_at,
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
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'required|string|max:20',
            'reservation_date' => 'required|date|after:today',
            'time_slot_id' => 'required|exists:time_slots,id',
            'guest_count' => 'required|integer|min:1|max:20',
        ]);

        try {
            $reservation = Reservation::create([
                'guest_first_name' => $request->guest_first_name,
                'guest_last_name' => $request->guest_last_name,
                'guest_email' => $request->guest_email,
                'guest_phone' => $request->guest_phone,
                'reservation_date' => $request->reservation_date,
                'time_slot_id' => $request->time_slot_id,
                'guest_count' => $request->guest_count,
                'status' => 'confirmed',
                'user_id' => auth()->id(),
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

    public function totalRevenue()
    {
        try {
            // Get the reservation fee from system settings
            $reservationFee = SystemSetting::getReservationFee();
            
            // Count all confirmed reservations
            $confirmedReservations = Reservation::where('status', 'confirmed')->count();
            
            // Calculate total revenue
            $totalRevenue = $confirmedReservations * $reservationFee;
            
            return response()->json([
                'total_revenue' => $totalRevenue,
                'confirmed_reservations' => $confirmedReservations,
                'reservation_fee' => $reservationFee
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to calculate revenue',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 