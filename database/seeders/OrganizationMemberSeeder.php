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
                'UserID' => 1,
                'isCreator' => 'true',
                'OrganizationID' => 1,
            ],

            [
                //same org member
                'role' => 'trial',
                'UserID' => 2,
                'isCreator' => 'false',
                'OrganizationID' => 1,
            ],

            [
                //same committee
                'role' => 'trial',
                'UserID' => 3,
                'isCreator' => 'false',
                'OrganizationID' => 1,
            ],

            [
                //diff org
                'role' => 'trial',
                'UserID' => 3,
                'isCreator' => 'false',
                'OrganizationID' => 2,
            ],
        ]);
    }
}
