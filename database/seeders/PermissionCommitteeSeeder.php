<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionCommitteeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            DB::table('permission_committee')->insert([
            [
                'create_announcement' => 'true',
                'update_announcement' => 'true',
                'delete_announcement' => 'true',
                'committee_id' => 1,
            ],

            [
                'create_announcement' => 'true',
                'update_announcement' => 'true',
                'delete_announcement' => 'true',
                'committee_id' => 2,
            ],

            [
                'create_announcement' => 'false',
                'update_announcement' => 'false',
                'delete_announcement' => 'false',
                'committee_id' => 3,
            ],

            [
                'create_announcement' => 'false',
                'update_announcement' => 'false',
                'delete_announcement' => 'false',
                'committee_id' => 3,
            ],
            ]);

    }
}
