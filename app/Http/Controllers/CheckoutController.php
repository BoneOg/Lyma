<?php

namespace App\Http\Controllers;

use App\Models\Reservation;

class CheckoutController extends Controller
{
    public function show(Reservation $reservation)
    {
        return inertia('checkout', ['reservation' => $reservation]);
    }
}