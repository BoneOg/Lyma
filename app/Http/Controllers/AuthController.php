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
        $user = auth()->user();
        Inertia::clearHistory();

        if ($user) {
            if ($user->isAdmin()) {
                return redirect()->route('admin.dashboard');
            } elseif ($user->isStaff()) {
                return redirect()->route('staff.booking');
            }
        }

        return Inertia::render('auth/login');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            // Role-based redirection
            if (Gate::allows('admin')) {
                Inertia::clearHistory();
                return Inertia::location(route('admin.dashboard'));
            }

            if (Gate::allows('staff')) {
                Inertia::clearHistory();
                return Inertia::location(route('staff.booking'));
            }

            Auth::logout();
            return Inertia::location(route('login'))->withErrors(['username' => 'Unauthorized role']);
        }

        return back()->withErrors(['username' => 'Invalid credentials'])->onlyInput('username');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        Inertia::clearHistory();
        return Inertia::location('/login');
    }

}
