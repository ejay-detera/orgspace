<?php

namespace Database\Seeders;

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
                'description' => 'A technology-driven organization focused on innovation and collaboration.',
                'organization_code' => 'HEHEe',
                'status' => 'Active',
            ],
            [
                'name' => 'Vox Nova',
                'description' => 'An organization dedicated to leadership, service, and student engagement.',
                'organization_code' => 'HEHE',
                'status' => 'Active',
            ],
        ]);
    }
}