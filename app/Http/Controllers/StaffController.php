<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('staff/dashboard');
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
            return [
                'id' => $r->id,
                'guest_first_name' => $r->guest_first_name,
                'guest_last_name' => $r->guest_last_name,
                'reservation_date' => $r->reservation_date,
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
} 