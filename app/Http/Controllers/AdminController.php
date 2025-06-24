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
        $settings = [
            'reservation_fee' => SystemSetting::getReservationFee(),
            'max_advance_booking_days' => SystemSetting::getMaxAdvanceBookingDays(),
            'restaurant_email' => SystemSetting::getRestaurantEmail(),
            'restaurant_phone' => SystemSetting::getRestaurantPhone(),
        ];

        return Inertia::render('admin/setting', [
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        \Log::info('Update settings request received', $request->all());
        
        try {
            $request->validate([
                'reservation_fee' => 'required|numeric|min:0',
                'max_advance_booking_days' => 'required|integer|min:1|max:365',
                'restaurant_email' => 'required|email',
                'restaurant_phone' => 'required|string|max:20|regex:/^[\d\s\-\+\(\)]+$/',
            ]);

            SystemSetting::set('reservation_fee', $request->reservation_fee, 'Reservation fee in pesos');
            SystemSetting::set('max_advance_booking_days', $request->max_advance_booking_days, 'Maximum days in advance for booking');
            SystemSetting::set('restaurant_email', $request->restaurant_email, 'Restaurant contact email');
            SystemSetting::set('restaurant_phone', $request->restaurant_phone, 'Restaurant contact phone');

            \Log::info('Settings updated successfully');

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in updateSettings', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating settings', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage()
            ], 500);
        }
    }
} 