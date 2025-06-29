<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\SystemSetting;
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

        // Load the time slot relationship
        $reservation->load(['timeSlot' => function ($query) {
            $query->select('id', 'start_time', 'end_time', 'is_active');
        }]);
        
        return Inertia::render('checkout', [
            'reservation' => $reservation,
            'reservationFee' => SystemSetting::getReservationFee(),
            'expiresAt' => $reservation->expires_at?->toISOString(),
        ]);
    }
}