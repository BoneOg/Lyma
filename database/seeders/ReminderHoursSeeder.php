<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SystemSetting;

class ReminderHoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SystemSetting::set('reminder_hours', 2, 'Email reminder hours before reservation');
        
        $this->command->info('Reminder hours setting seeded successfully!');
    }
}
