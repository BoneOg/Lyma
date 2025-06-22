<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CheckoutController;

// Home
Route::get('/', fn () => Inertia::render('home'))->name('home');

// Reservation routes
Route::get('/reservation', [ReservationController::class, 'index'])->name('reservation.index');
Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');

// API routes for checking availability
Route::get('/api/reservations/check-availability', [ReservationController::class, 'checkAvailability'])->name('api.reservations.check-availability');
Route::get('/api/reservations/available-time-slots', [ReservationController::class, 'getAvailableTimeSlots'])->name('api.reservations.available-time-slots');

// Your checkout route (you'll need to create this)
Route::get('/checkout/{reservation}', [CheckoutController::class, 'show'])->name('checkout');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/account', function () {
        $user = Auth::user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isStaff()) {
            return redirect()->route('staff.dashboard');
        }
    })->name('account');

    Route::middleware('can:admin')->get('/admin/dashboard', fn () => Inertia::render('admin/dashboard'))
        ->name('admin.dashboard');

    Route::middleware('can:staff')->get('/staff/dashboard', fn () => Inertia::render('staff/dashboard'))
        ->name('staff.dashboard');

});
