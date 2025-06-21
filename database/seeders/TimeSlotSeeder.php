<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TimeSlot;

class TimeSlotSeeder extends Seeder
{
    public function run(): void
    {
        $timeSlots = [
            ['start_time' => '11:00:00', 'end_time' => '13:00:00'],
            ['start_time' => '13:30:00', 'end_time' => '15:30:00'],
            ['start_time' => '16:00:00', 'end_time' => '18:00:00'],
            ['start_time' => '18:30:00', 'end_time' => '20:30:00'],
            ['start_time' => '21:00:00', 'end_time' => '23:00:00'],
        ];

        foreach ($timeSlots as $slot) {
            TimeSlot::create($slot);
        }
    }
}
