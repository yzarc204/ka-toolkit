<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test user
        User::create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => Hash::make('123'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('Test user created: test@gmail.com / 123');
    }
}