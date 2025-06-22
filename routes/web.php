<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Home
Route::get('/', fn () => Inertia::render('home'))->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/account', function () {
        $user = Auth::user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isStaff()) {
            return redirect()->route('staff.dashboard');
        } else {
            return redirect()->route('user.dashboard');
        }
    })->name('account');

    Route::middleware('can:admin')->get('/admin/dashboard', fn () => Inertia::render('admin/dashboard'))
        ->name('admin.dashboard');

    Route::middleware('can:staff')->get('/staff/dashboard', fn () => Inertia::render('staff/dashboard'))
        ->name('staff.dashboard');

    Route::middleware('can:user')->get('/user/dashboard', fn () => Inertia::render('user/dashboard'))
        ->name('user.dashboard');
});
