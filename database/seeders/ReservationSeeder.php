<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\TimeSlot;
use App\Models\RestaurantTable;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        // Get the 11:00 AM time slot (ID should be 1 based on TimeSlotSeeder)
        $timeSlot = TimeSlot::where('start_time', '11:00:00')->first();
        
        if (!$timeSlot) {
            $this->command->error('Time slot 11:00 AM not found. Please run TimeSlotSeeder first.');
            return;
        }

        // Get all available tables
        $tables = RestaurantTable::where('status', 'available')->get();
        
        if ($tables->isEmpty()) {
            $this->command->error('No available tables found. Please run RestaurantTableSeeder first.');
            return;
        }

        // Sample guest data for June 30, 2025 at 11:00 AM
        $reservations = [
            [
                'guest_first_name' => 'John',
                'guest_last_name' => 'Smith',
                'guest_email' => 'john.smith@example.com',
                'guest_phone' => '+1-555-0101',
                'guest_count' => 2,
                'reservation_date' => '2025-06-30',
                'time_slot_id' => $timeSlot->id,
                'table_id' => $tables->first()->id,
                'status' => 'confirmed'
            ],
            [
                'guest_first_name' => 'Sarah',
                'guest_last_name' => 'Johnson',
                'guest_email' => 'sarah.j@example.com',
                'guest_phone' => '+1-555-0102',
                'guest_count' => 4,
                'reservation_date' => '2025-06-30',
                'time_slot_id' => $timeSlot->id,
                'table_id' => $tables->skip(1)->first()->id,
                'status' => 'confirmed'
            ],
            [
                'guest_first_name' => 'Michael',
                'guest_last_name' => 'Brown',
                'guest_email' => 'mike.brown@example.com',
                'guest_phone' => '+1-555-0103',
                'guest_count' => 2,
                'reservation_date' => '2025-06-30',
                'time_slot_id' => $timeSlot->id,
                'table_id' => $tables->skip(2)->first()->id,
                'status' => 'confirmed'
            ]
        ];

        foreach ($reservations as $reservationData) {
            Reservation::create($reservationData);
        }

        $this->command->info('Created ' . count($reservations) . ' test reservations for June 30, 2025 at 11:00 AM');
    }
} 