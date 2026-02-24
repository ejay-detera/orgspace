<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('organizations')->insert([
            [
                'name' => 'Commits',
                'organization_code' => 'HEHEe',
                'status' => 'Active',
            ],
            [
                'name' => 'Vox Nova',
                'organization_code' => 'HEHE',
                'status' => 'Active',
            ],
        ]);
    }
}
