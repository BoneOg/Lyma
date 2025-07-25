<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StaffController;


// Home
Route::get('/', fn () => Inertia::render('home'))->name('home');

// Menu, About, Contact pages
Route::get('/menu', fn () => Inertia::render('menu'))->name('menu');
Route::get('/about', fn () => Inertia::render('about'))->name('about');
Route::get('/contact', fn () => Inertia::render('contact'))->name('contact');

// Reservation routes
Route::get('/reservation', [ReservationController::class, 'index'])->name('reservation.index');
Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
Route::get('/reservations/occupied-time-slots', [ReservationController::class, 'getOccupiedTimeSlots'])->name('reservations.occupied-time-slots');
Route::get('/reservations/fully-booked-dates', [ReservationController::class, 'getFullyBookedDates'])->name('reservations.fully-booked-dates');
Route::get('/reservations/closed-dates', [ReservationController::class, 'getClosedDates'])->name('reservations.closed-dates');
Route::get('/reservations/special-hours-dates', [ReservationController::class, 'getSpecialHoursDates'])->name('reservations.special-hours-dates');
Route::get('/api/settings/min-guest-size', [ReservationController::class, 'getMinGuestSize']);
Route::get('/api/settings/max-guest-size', [ReservationController::class, 'getMaxGuestSize']);

// Checkout route (for legacy support, but now just confirms reservation)
Route::get('/checkout/{reservation}', [CheckoutController::class, 'show'])
    ->name('checkout')
    ->middleware('check.pending.reservation');

// Confirm reservation route (for free reservations)
Route::post('/checkout/{reservation}/confirm', [CheckoutController::class, 'confirmReservation'])
    ->name('checkout.confirm')
    ->middleware('check.pending.reservation');

// Transaction route
Route::get('/transaction/{reservation}', [CheckoutController::class, 'showTransaction'])
    ->name('transaction');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);




Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/account', function () {
        $user = Auth::user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isStaff()) {
            return redirect()->route('staff.booking');
        }
    })->name('account');

    Route::middleware('can:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
            ->name('admin.dashboard');
        Route::get('/admin/transactions', [AdminController::class, 'transactions'])
            ->name('admin.transactions');
        Route::get('/admin/booking', [AdminController::class, 'booking'])
            ->name('admin.booking');
        Route::get('/admin/settings', [AdminController::class, 'setting'])
            ->name('admin.settings');
        Route::get('/admin/api/reservation-counts', [AdminController::class, 'reservationCounts']);
        Route::get('/admin/api/reservations', [App\Http\Controllers\AdminController::class, 'reservationList']);
        Route::patch('/admin/api/reservations/{id}/complete', [AdminController::class, 'completeReservation']);
        Route::patch('/admin/api/reservations/{id}/cancel', [AdminController::class, 'cancelReservation']);
        Route::post('/admin/api/quick-reservations', [AdminController::class, 'quickReservation']);
        Route::post('/admin/api/disable-time-slot', [AdminController::class, 'disableTimeSlotForDate']);
        Route::get('/admin/api/disabled-time-slots', [AdminController::class, 'getDisabledTimeSlots']);
        Route::post('/admin/api/special-hours', [AdminController::class, 'setSpecialHoursForDate']);
        Route::post('/admin/api/close-date', [AdminController::class, 'setClosedForDate']);
        Route::post('/admin/api/clear-date', [AdminController::class, 'clearSpecialOrClosedForDate']);

        Route::get('/admin/api/total-revenue', [AdminController::class, 'totalRevenue'])->name('admin.total-revenue');

        // Update restaurant information card
        Route::patch('/admin/api/settings/restaurant-name', [AdminController::class, 'updateRestaurantName']);
        Route::patch('/admin/api/settings/restaurant-phone', [AdminController::class, 'updateRestaurantPhone']);
        Route::patch('/admin/api/settings/restaurant-email', [AdminController::class, 'updateRestaurantEmail']);
        Route::patch('/admin/api/settings/restaurant-address', [AdminController::class, 'updateRestaurantAddress']);
        
        // Booking settings API
        Route::get('/admin/api/settings/booking-window', [AdminController::class, 'getBookingWindow']);
        Route::post('/admin/api/settings/booking-window', [AdminController::class, 'updateBookingWindow']);
        Route::get('/admin/api/settings/capacity', [AdminController::class, 'getCapacity']);
        Route::post('/admin/api/settings/capacity', [AdminController::class, 'updateCapacity']);
        
        // Guest size settings API
        Route::get('/admin/api/settings/min-guest-size', [AdminController::class, 'getMinGuestSize']);
        Route::post('/admin/api/settings/min-guest-size', [AdminController::class, 'updateMinGuestSize']);
        Route::get('/admin/api/settings/max-guest-size', [AdminController::class, 'getMaxGuestSize']);
        Route::post('/admin/api/settings/max-guest-size', [AdminController::class, 'updateMaxGuestSize']);

        // --- Time Slot API ---
        Route::get('/admin/api/time-slots', [AdminController::class, 'getTimeSlots']);
        Route::post('/admin/api/time-slots', [AdminController::class, 'storeTimeSlot']);
        Route::delete('/admin/api/time-slots/{id}', [AdminController::class, 'deleteTimeSlot']);
        Route::patch('/admin/api/time-slots/{id}', [AdminController::class, 'updateTimeSlot']);
    });

    Route::middleware('can:staff')->group(function () {
        Route::get('/staff/booking', [StaffController::class, 'booking'])
            ->name('staff.booking');
        Route::get('/staff/api/reservation-counts', [StaffController::class, 'reservationCounts']);
        Route::get('/staff/api/reservations', [StaffController::class, 'reservationList']);
        Route::patch('/staff/api/reservations/{id}/complete', [StaffController::class, 'completeReservation']);
        Route::patch('/staff/api/reservations/{id}/cancel', [StaffController::class, 'cancelReservation']);
        Route::post('/staff/api/quick-reservations', [StaffController::class, 'quickReservation']);
    });

});

// 404 Fallback Route - Must be the last route
Route::fallback(function () {
    return Inertia::render('404');
});




