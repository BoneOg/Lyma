<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'setting_key',
        'setting_value',
        'description',
    ];

    // Helper methods
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("system_setting_{$key}", 3600, function () use ($key, $default) {
            $setting = self::where('setting_key', $key)->first();
            return $setting ? $setting->setting_value : $default;
        });
    }

    public static function set(string $key, mixed $value, string $description = null): void
    {
        self::updateOrCreate(
            ['setting_key' => $key],
            [
                'setting_value' => $value,
                'description' => $description,
            ]
        );

        Cache::forget("system_setting_{$key}");
    }

    public static function getMaxAdvanceBookingDays(): int
    {
        return (int) self::get('max_advance_booking_days', 30);
    }

    public static function getRestaurantEmail(): string
    {
        return self::get('restaurant_email', 'info@restaurant.com');
    }

    public static function getRestaurantPhone(): string
    {
        return self::get('restaurant_phone', '+639123456789');
    }

    public static function getCapacity(): int
    {
        return (int) self::get('capacity', 5);
    }
}