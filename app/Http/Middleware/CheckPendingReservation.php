<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Reservation;
use Symfony\Component\HttpFoundation\Response;

class CheckPendingReservation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $reservation = $request->route('reservation');
        
        // If no reservation is found or it's not pending, redirect to home
        if (!$reservation || $reservation->status !== 'pending') {
            return redirect()->route('home')->with('error', 'Access denied. This checkout page is only available for pending reservations.');
        }
        
        return $next($request);
    }
} 