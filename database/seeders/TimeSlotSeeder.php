<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TimeSlot;

class TimeSlotSeeder extends Seeder
{
    public function run(): void
    {
        $timeSlots = [
            ['start_time' => '17:00:00', 'end_time' => '22:00:00'],
        ];

        foreach ($timeSlots as $slot) {
            TimeSlot::create($slot);
        }
    }
}
