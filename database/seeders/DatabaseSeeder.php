<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\RoleSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        /* User::truncate(); --> for testing purposes */
        // call user-specific seeder (keeps seed responsibilities separated)
        $this->call([
            UserSeeder::class,
            RoleSeeder::class
        ]);
    }
}
