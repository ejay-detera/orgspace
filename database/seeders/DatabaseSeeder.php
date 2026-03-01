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
        // call seedeers
        $this->call([
            SemesterSeeder::class,
            UserSeeder::class,
            OrganizationSeeder::class,
            CommitteeSeeder::class,
            OrganizationMemberSeeder::class,
            PermissionUserSeeder::class,
            PermissionCommitteeSeeder::class,
        ]);

        //$this->call(UserSeeder::class);
    }
}
