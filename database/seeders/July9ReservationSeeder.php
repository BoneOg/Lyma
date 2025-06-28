<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\TimeSlot;
use App\Models\SystemSetting;

class July9ReservationSeeder extends Seeder
{
    public function run(): void
    {
        // Get all time slots
        $timeSlots = TimeSlot::all();
        
        if ($timeSlots->isEmpty()) {
            $this->command->error('No time slots found. Please run TimeSlotSeeder first.');
            return;
        }

        // Get capacity from system settings
        $capacity = SystemSetting::get('capacity', 5); // Default to 5 if not set

        // Guest data for variety
        $guests = [
            ['Maria', 'Santos', 'maria.santos@email.com', '+639151234567'],
            ['Juan', 'Cruz', 'juan.cruz@email.com', '+639152345678'],
            ['Ana', 'Reyes', 'ana.reyes@email.com', '+639153456789'],
            ['Pedro', 'Garcia', 'pedro.garcia@email.com', '+639154567890'],
            ['Carmen', 'Lopez', 'carmen.lopez@email.com', '+639155678901'],
            ['Miguel', 'Martinez', 'miguel.martinez@email.com', '+639156789012'],
            ['Isabella', 'Rodriguez', 'isabella.rodriguez@email.com', '+639157890123'],
            ['Carlos', 'Hernandez', 'carlos.hernandez@email.com', '+639158901234'],
            ['Sofia', 'Gonzalez', 'sofia.gonzalez@email.com', '+639159012345'],
            ['Diego', 'Perez', 'diego.perez@email.com', '+639150123456'],
            ['Valentina', 'Torres', 'valentina.torres@email.com', '+639151234567'],
            ['Alejandro', 'Flores', 'alejandro.flores@email.com', '+639152345678'],
            ['Camila', 'Rivera', 'camila.rivera@email.com', '+639153456789'],
            ['Gabriel', 'Morales', 'gabriel.morales@email.com', '+639154567890'],
            ['Lucia', 'Ortiz', 'lucia.ortiz@email.com', '+639155678901'],
            ['Rosa', 'Vargas', 'rosa.vargas@email.com', '+639156789012'],
            ['Fernando', 'Jimenez', 'fernando.jimenez@email.com', '+639157890123'],
            ['Elena', 'Moreno', 'elena.moreno@email.com', '+639158901234'],
            ['Ricardo', 'Silva', 'ricardo.silva@email.com', '+639159012345'],
            ['Patricia', 'Castro', 'patricia.castro@email.com', '+639150123456'],
            ['Roberto', 'Ortiz', 'roberto.ortiz@email.com', '+639151234567'],
            ['Monica', 'Ruiz', 'monica.ruiz@email.com', '+639152345678'],
            ['Javier', 'Diaz', 'javier.diaz@email.com', '+639153456789'],
            ['Adriana', 'Romero', 'adriana.romero@email.com', '+639154567890'],
            ['Manuel', 'Navarro', 'manuel.navarro@email.com', '+639155678901'],
            ['Gabriela', 'Torres', 'gabriela.torres@email.com', '+639156789012'],
            ['Rafael', 'Gutierrez', 'rafael.gutierrez@email.com', '+639157890123'],
            ['Veronica', 'Ramos', 'veronica.ramos@email.com', '+639158901234'],
            ['Hector', 'Mendoza', 'hector.mendoza@email.com', '+639159012345'],
            ['Diana', 'Herrera', 'diana.herrera@email.com', '+639150123456'],
            ['Oscar', 'Vega', 'oscar.vega@email.com', '+639151234567'],
            ['Natalia', 'Rios', 'natalia.rios@email.com', '+639152345678'],
            ['Eduardo', 'Cortez', 'eduardo.cortez@email.com', '+639153456789'],
        ];

        $statuses = ['confirmed', 'completed', 'cancelled'];
        $reservationDate = '2025-07-09';
        $totalReservations = 0;

        // Create reservations for each time slot
        foreach ($timeSlots as $timeSlotIndex => $timeSlot) {
            $this->command->info("Creating {$capacity} reservations for time slot: {$timeSlot->start_time}");
            
            // Create capacity number of reservations for this time slot
            for ($i = 0; $i < $capacity; $i++) {
                // Get guest data (cycle through the array)
                $guestIndex = ($timeSlotIndex * $capacity + $i) % count($guests);
                $guest = $guests[$guestIndex];
                
                // Randomize guest count and status
                $guestCount = rand(1, 4); // Smaller groups since we have many reservations
                $status = 'confirmed'; // All reservations are confirmed
                
                // Add some variety to email
                $email = str_replace('@', rand(1, 999) . '@', $guest[2]);

                Reservation::create([
                    'guest_first_name' => $guest[0],
                    'guest_last_name' => $guest[1],
                    'guest_email' => $email,
                    'guest_phone' => $guest[3],
                    'reservation_date' => $reservationDate,
                    'time_slot_id' => $timeSlot->id,
                    'guest_count' => $guestCount,
                    'status' => $status,
                ]);

                $totalReservations++;
            }
        }

        $this->command->info("Successfully created {$totalReservations} reservations for July 9th, 2025");
        $this->command->info("Capacity per time slot: {$capacity}");
        $this->command->info("Time slots filled: " . $timeSlots->count());
    }
} 