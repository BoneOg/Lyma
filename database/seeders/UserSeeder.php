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
            'password' => Hash::make('123123123'),
            'role' => 'admin',
        ]);

        // Create Staff User
        User::create([
            'first_name' => 'Staff',
            'last_name' => 'Member',
            'password' => Hash::make('123123123'),
            'role' => 'staff',
        ]);

    }
}
