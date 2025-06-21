<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SystemSetting;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'setting_key' => 'reservation_fee',
                'setting_value' => '200.00',
                'description' => 'Non-refundable reservation fee amount in PHP'
            ],
            [
                'setting_key' => 'max_advance_booking_days',
                'setting_value' => '30',
                'description' => 'Maximum days in advance for booking'
            ],
            [
                'setting_key' => 'min_advance_booking_hours',
                'setting_value' => '24',
                'description' => 'Minimum 24 hours in advance for booking (tomorrow and future only)'
            ],
            [
                'setting_key' => 'restaurant_name',
                'setting_value' => 'Fine Dining Restaurant',
                'description' => 'Restaurant name displayed on website'
            ],
            [
                'setting_key' => 'restaurant_email',
                'setting_value' => 'info@restaurant.com',
                'description' => 'Restaurant contact email'
            ],
            [
                'setting_key' => 'restaurant_phone',
                'setting_value' => '+639123456789',
                'description' => 'Restaurant contact phone number'
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::create($setting);
        }
    }
}