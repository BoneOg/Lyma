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
                'setting_key' => 'max_advance_booking_days',
                'setting_value' => '30',
                'description' => 'Maximum days in advance for booking'
            ],
            [
                'setting_key' => 'min_guest_size',
                'setting_value' => '1',
                'description' => 'Minimum number of guests allowed per reservation'
            ],
            [
                'setting_key' => 'max_guest_size',
                'setting_value' => '50',
                'description' => 'Maximum number of guests allowed per reservation'
            ],
            [
                'setting_key' => 'restaurant_email',
                'setting_value' => 'pearl@lymaculinary.com',
                'description' => 'Restaurant Contact Email'
            ],
            [
                'setting_key' => 'restaurant_phone',
                'setting_value' => '+639543846071',
                'description' => 'Restaurant Contact Phone Number'
            ],
            [
                'setting_key' => 'restaurant_name',
                'setting_value' => 'Lyma By Chef Marc',
                'description' => 'Restaurant Name'
            ],
            [
                'setting_key' => 'restaurant_address',
                'setting_value' => 'Tourism Road General Luna, Siargao Island',
                'description' => 'Restaurant Address'
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                $setting
            );
        }
    }
}