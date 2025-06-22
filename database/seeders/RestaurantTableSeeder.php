<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RestaurantTable;

class RestaurantTableSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            ['table_number' => 'T001', 'capacity' => 2, 'location_description' => 'Window side table for 2'],
            ['table_number' => 'T002', 'capacity' => 2, 'location_description' => 'Cozy corner table for 2'],
            ['table_number' => 'T003', 'capacity' => 4, 'location_description' => 'Family table near entrance'],
        ];

        foreach ($tables as $table) {
            RestaurantTable::create($table);
        }
    }
}
