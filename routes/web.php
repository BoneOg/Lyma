<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\AnalyticsController;

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

Route::post('/create-maya-checkout', [PaymentController::class, 'createMayaCheckout'])->name('maya.checkout.create');

// Payment callback routes (must come before the parameterized checkout route)
Route::get('/checkout/success', [PaymentController::class, 'checkoutSuccess'])->name('checkout.success');
Route::get('/checkout/failure', [PaymentController::class, 'checkoutFailure'])->name('checkout.failure');
Route::get('/checkout/cancel', [PaymentController::class, 'checkoutCancel'])->name('checkout.cancel');

// Checkout route with pending reservation check
Route::get('/checkout/{reservation}', [CheckoutController::class, 'show'])
    ->name('checkout')
    ->middleware('check.pending.reservation');

Route::post('/maya-webhook', [PaymentController::class, 'handleWebhook'])->name('maya.webhook');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

// Analytics API routes
Route::post('/api/analytics/track', [AnalyticsController::class, 'trackPageView'])->name('analytics.track');
Route::get('/api/analytics/chart-data', [AnalyticsController::class, 'getChartData'])->name('analytics.chart-data');
Route::get('/api/analytics/real-time', [AnalyticsController::class, 'getRealTimeVisitors'])->name('analytics.real-time');
Route::get('/api/analytics/today', [AnalyticsController::class, 'getTodaySummary'])->name('analytics.today');
Route::get('/api/analytics/popular-pages', [AnalyticsController::class, 'getPopularPages'])->name('analytics.popular-pages');

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

    Route::middleware('can:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
            ->name('admin.dashboard');
        Route::get('/admin/transactions', [AdminController::class, 'transactions'])
            ->name('admin.transactions');
        Route::get('/admin/booking', [AdminController::class, 'booking'])
            ->name('admin.booking');
        Route::get('/admin/setting', [AdminController::class, 'setting'])
            ->name('admin.setting');
        Route::post('/admin/settings/update', [AdminController::class, 'updateSettings'])
            ->name('admin.settings.update');
        Route::get('/admin/api/reservation-counts', [AdminController::class, 'reservationCounts']);
        Route::get('/admin/api/reservations', [App\Http\Controllers\AdminController::class, 'reservationList']);
        Route::patch('/admin/api/reservations/{id}/complete', [AdminController::class, 'completeReservation']);
        Route::patch('/admin/api/reservations/{id}/cancel', [AdminController::class, 'cancelReservation']);
        Route::post('/admin/api/quick-reservations', [AdminController::class, 'quickReservation']);
        
        // Admin analytics routes
        Route::get('/admin/api/analytics/dashboard', [AnalyticsController::class, 'getDashboardData'])->name('admin.analytics.dashboard');
        Route::get('/admin/api/total-revenue', [AdminController::class, 'totalRevenue'])->name('admin.total-revenue');
    });

    Route::middleware('can:staff')->group(function () {
        Route::get('/staff/dashboard', [StaffController::class, 'dashboard'])
            ->name('staff.dashboard');
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




