<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@restaurant.com',
            'phone_number' => '+639123456789',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Staff User
        User::create([
            'first_name' => 'Staff',
            'last_name' => 'Member',
            'email' => 'staff@restaurant.com',
            'phone_number' => '+639987654321',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        // Create Regular User
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone_number' => '+639111222333',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);
    }
}
