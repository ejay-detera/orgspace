<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class OrganizationMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('organization_members')->insert([
            [
                //for the president
                'role' => 'president',
                'status' => 'active',
                'user_id' => 1,
                'isCreator' => true,
                'organization_id' => 1,
            ],

            [
                //same org member
                'role' => 'trial',
                'status' => 'active',
                'user_id' => 2,
                'isCreator' => false,
                'organization_id' => 1,
            ],

            [
                //same committee
                'role' => 'trial',
                'status' => 'active',
                'user_id' => 3,
                'isCreator' => false,
                'organization_id' => 1,
            ],

            [
                //diff org
                'role' => 'trial',
                'status' => 'active',
                'user_id' => 3,
                'isCreator' => false,
                'organization_id' => 2,
            ],
        ]);
    }
}
