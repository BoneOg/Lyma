<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TimeSlotSeeder::class,
            PaymentMethodSeeder::class,
            SystemSettingSeeder::class,
            ReservationSeeder::class,
            July9ReservationSeeder::class,
        ]);
    }
}
