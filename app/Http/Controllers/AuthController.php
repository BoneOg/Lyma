<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;

class AuthController extends Controller
{
    public function showLogin()
    {
        Inertia::clearHistory();
        return Inertia::render('auth/login');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            Inertia::clearHistory();

            // Role-based redirection
            if (Gate::allows('admin')) {
                return Inertia::location(route('admin.dashboard'));
            }

            if (Gate::allows('staff')) {
                return Inertia::location(route('staff.dashboard'));
            }

            if (Gate::allows('user')) {
                return Inertia::location(route('user.dashboard'));
            }

            Auth::logout();
            return Inertia::location(route('login'))->withErrors(['email' => 'Unauthorized role']);
        }

        return back()->withErrors(['email' => 'Invalid credentials'])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Inertia::encryptHistory();

        return Inertia::location('/');
    }

    public function showRegister()
    {
        Inertia::clearHistory();
        return Inertia::render('auth/register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:100', 'unique:users,email'],
            'phone_number' => ['required', 'string', 'max:20'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'password' => Hash::make($validated['password']),
            'role' => 'user', // default role
            'email_verified_at' => now(),
        ]);

        auth()->login($user);
        Inertia::clearHistory();

        return Inertia::location(route('user.dashboard'));
    }
}
