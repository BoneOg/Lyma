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
                'setting_value' => '1000.00',
                'description' => 'Non-refundable reservation fee amount in PHP'
            ],
            [
                'setting_key' => 'max_advance_booking_days',
                'setting_value' => '30',
                'description' => 'Maximum days in advance for booking'
            ],
            [
                'setting_key' => 'restaurant_email',
                'setting_value' => 'lyma@gmail.com',
                'description' => 'Restaurant Contact Email'
            ],
            [
                'setting_key' => 'restaurant_phone',
                'setting_value' => '+639543846071',
                'description' => 'Restaurant Contact Phone Number'
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::create($setting);
        }
    }
}