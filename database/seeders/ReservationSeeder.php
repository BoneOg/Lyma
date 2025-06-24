<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\TimeSlot;

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

        $names = [
            ['John', 'Smith'],
            ['Sarah', 'Johnson'],
            ['Michael', 'Brown'],
            ['Emily', 'Davis'],
            ['David', 'Wilson'],
        ];
        $domains = ['example.com', 'mail.com', 'test.com', 'demo.com', 'sample.com'];

        for ($i = 0; $i < 5; $i++) {
            $firstName = $names[$i][0];
            $lastName = $names[$i][1];
            $email = strtolower($firstName) . '.' . strtolower($lastName) . rand(1,99) . '@' . $domains[$i];
            $phone = '+639' . rand(100000000, 999999999);
            $guestCount = rand(1, 8);

            Reservation::create([
                'guest_first_name' => $firstName,
                'guest_last_name' => $lastName,
                'guest_email' => $email,
                'guest_phone' => $phone,
                'reservation_date' => '2025-07-08',
                'time_slot_id' => $timeSlot->id,
                'guest_count' => $guestCount,
                'status' => 'confirmed',
            ]);
        }
    }
} 