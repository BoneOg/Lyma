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
            ['table_number' => 'T004', 'capacity' => 4, 'location_description' => 'Center table for 4'],
            ['table_number' => 'T005', 'capacity' => 6, 'location_description' => 'Large table for groups'],
            ['table_number' => 'T006', 'capacity' => 8, 'location_description' => 'Private dining area'],
            ['table_number' => 'T007', 'capacity' => 2, 'location_description' => 'Bar seating for 2'],
            ['table_number' => 'T008', 'capacity' => 4, 'location_description' => 'Outdoor patio table'],
        ];

        foreach ($tables as $table) {
            RestaurantTable::create($table);
        }
    }
}
