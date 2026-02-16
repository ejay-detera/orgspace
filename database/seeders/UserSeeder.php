<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Test user with known password for easy testing
        User::factory()->create([
            'first_name' => 'Test',
            'middle_name' => null,
            'last_name' => 'User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password'), // Known password: "password"
            'email_verified_at' => now(), // Auto-verify for testing
        ]);

        // Admin user with known password
        User::factory()->create([
            'first_name' => 'Admin',
            'middle_name' => null,
            'last_name' => 'User',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'), // Known password: "admin123"
            'is_admin' => true,
            'email_verified_at' => now(), // Auto-verify for testing
        ]);

        // Demo user with complete profile
        User::factory()->create([
            'first_name' => 'Demo',
            'middle_name' => 'Organization',
            'last_name' => 'Student',
            'username' => 'demostudent',
            'email' => 'demo@orgspace.com',
            'password' => Hash::make('demo123'), // Known password: "demo123"
            'birthdate' => '2000-01-15', // Sample birthdate
            'email_verified_at' => now(), // Auto-verify for testing
        ]);

        $this->command->info('Test accounts created:');
        $this->command->info('1. Email: test@example.com | Password: password');
        $this->command->info('2. Email: admin@example.com | Password: admin123 (Admin)');
        $this->command->info('3. Email: demo@orgspace.com | Password: demo123');
    }
}
