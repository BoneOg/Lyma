<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\SystemSetting;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(Reservation $reservation)
    {
        $reservation->load(['timeSlot' => function ($query) {
            $query->select('id', 'start_time', 'end_time', 'is_active');
        }]);
        
        return Inertia::render('checkout', [
            'reservation' => $reservation,
            'reservationFee' => SystemSetting::getReservationFee(),
        ]);
    }
}