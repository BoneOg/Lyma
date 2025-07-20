<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function show(Request $request, Reservation $reservation)
    {
        // Check if reservation is expired
        if ($reservation->isExpired()) {
            return redirect()->route('home')->with('error', 'This reservation has expired. Please make a new reservation.');
        }

        // Additional check to ensure the reservation is pending
        if ($reservation->status !== 'pending') {
            return redirect()->route('home')->with('error', 'Access denied. This checkout page is only available for pending reservations.');
        }

        // Load the time slot relationship if it exists
        if ($reservation->time_slot_id) {
            $reservation->load(['timeSlot' => function ($query) {
                $query->select('id', 'start_time', 'end_time', 'is_active');
            }]);
        }
        
        // Get special hours data if this is a special hours reservation
        $specialHoursData = null;
        if (!$reservation->time_slot_id) {
            $specialHoursData = \App\Models\DisabledTimeSlot::where('date', $reservation->reservation_date)
                ->whereNull('time_slot_id')
                ->where('is_closed', false)
                ->whereNotNull('special_start')
                ->whereNotNull('special_end')
                ->first();
        }
        
        return Inertia::render('checkout', [
            'reservation' => $reservation,
            'expiresAt' => $reservation->expires_at?->toISOString(),
            'specialHoursData' => $specialHoursData ? [
                'special_start' => \Carbon\Carbon::parse($specialHoursData->special_start)->format('g:i A'),
                'special_end' => \Carbon\Carbon::parse($specialHoursData->special_end)->format('g:i A'),
            ] : null,
        ]);
    }

    public function confirmReservation(Request $request, Reservation $reservation)
    {
        // Check if reservation is expired
        if ($reservation->isExpired()) {
            return redirect()->route('home')->with('error', 'This reservation has expired. Please make a new reservation.');
        }

        // Confirm the reservation (make it free)
        $reservation->update(['status' => 'confirmed']);

        // Load the time slot relationship for the transaction page if it exists
        if ($reservation->time_slot_id) {
            $reservation->load(['timeSlot' => function ($query) {
                $query->select('id', 'start_time', 'end_time', 'is_active');
            }]);
        }

        // Get special hours data if this is a special hours reservation
        $specialHoursData = null;
        if (!$reservation->time_slot_id) {
            $specialHoursData = \App\Models\DisabledTimeSlot::where('date', $reservation->reservation_date)
                ->whereNull('time_slot_id')
                ->where('is_closed', false)
                ->whereNotNull('special_start')
                ->whereNotNull('special_end')
                ->first();
        }

        // Redirect to transaction page with success using Inertia
        return Inertia::render('transaction', [
            'reservation' => $reservation,
            'paymentStatus' => 'success',
            'statusMessage' => 'Reservation confirmed successfully! Your table is reserved.',
            'specialHoursData' => $specialHoursData ? [
                'special_start' => \Carbon\Carbon::parse($specialHoursData->special_start)->format('g:i A'),
                'special_end' => \Carbon\Carbon::parse($specialHoursData->special_end)->format('g:i A'),
            ] : null,
        ]);
    }

    public function showTransaction(Request $request, Reservation $reservation)
    {
        // Load the time slot relationship for the transaction page if it exists
        if ($reservation->time_slot_id) {
            $reservation->load(['timeSlot' => function ($query) {
                $query->select('id', 'start_time', 'end_time', 'is_active');
            }]);
        }

        $status = $request->query('status', 'success');
        $message = $request->query('message', 'Reservation confirmed successfully! Your table is reserved.');

        // Get special hours data if this is a special hours reservation
        $specialHoursData = null;
        if (!$reservation->time_slot_id) {
            $specialHoursData = \App\Models\DisabledTimeSlot::where('date', $reservation->reservation_date)
                ->whereNull('time_slot_id')
                ->where('is_closed', false)
                ->whereNotNull('special_start')
                ->whereNotNull('special_end')
                ->first();
        }

        return Inertia::render('transaction', [
            'reservation' => $reservation,
            'paymentStatus' => $status,
            'statusMessage' => $message,
            'specialHoursData' => $specialHoursData ? [
                'special_start' => \Carbon\Carbon::parse($specialHoursData->special_start)->format('g:i A'),
                'special_end' => \Carbon\Carbon::parse($specialHoursData->special_end)->format('g:i A'),
            ] : null,
        ]);
    }
}