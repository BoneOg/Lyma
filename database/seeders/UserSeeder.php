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
            'username' => 'admin',
            'name' => 'Admin User',
            'password' => Hash::make('Lyma.Adm1n'),
            'role' => 'admin',
        ]);

        // Create Staff User
        User::create([
            'username' => 'staff',
            'name' => 'Staff Member',
            'password' => Hash::make('Lyma.$taff'),
            'role' => 'staff',
        ]);

    }
}
