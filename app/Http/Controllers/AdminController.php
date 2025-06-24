<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('admin/dashboard');
    }

    public function transactions()
    {
        return Inertia::render('admin/transactions');
    }

    public function booking()
    {
        return Inertia::render('admin/booking');
    }

    public function setting()
    {
        return Inertia::render('admin/setting');
    }
} 