<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'role' => 'admin',
        ]);
        
        \App\Models\User::create([
            'name' => 'Reguler User',
            'username' => 'user',
            'email' => 'user@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'role' => 'user',
        ]);
    }
}
