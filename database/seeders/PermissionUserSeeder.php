<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            DB::table('permission_user')->insert([
            [
                'create_announcement' => 'true',
                'update_announcement' => 'true',
                'delete_announcement' => 'true',
                'user_id' => 1,
            ],

            [
                'create_announcement' => 'false',
                'update_announcement' => 'false',
                'delete_announcement' => 'false',
                'user_id' => 2,
            ],

            [
                'create_announcement' => 'false',
                'update_announcement' => 'false',
                'delete_announcement' => 'false',
                'user_id' => 3,
            ],

            [
                'create_announcement' => 'false',
                'update_announcement' => 'false',
                'delete_announcement' => 'false',
                'user_id' => 4,
            ],
            ]);

    }
}
