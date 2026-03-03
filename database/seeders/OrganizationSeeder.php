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
                'type' => 'educational', // Add valid type value
                'organization_code' => 'HEHEe',
                'status' => 'Active',
                'created_by' => 1, // Add valid user ID for created_by
            ],
            [
                'name' => 'Vox Nova',
                'description' => 'An organization dedicated to leadership, service, and student engagement.',
                'type' => 'professional', // Add valid type value
                'organization_code' => 'HEHE',
                'status' => 'Active',
                'created_by' => 1, // Add valid user ID for created_by
            ],
        ]);
    }
}