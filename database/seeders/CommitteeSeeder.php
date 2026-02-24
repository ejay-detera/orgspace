<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommitteeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('committee')->insert([
            [
                'name' => 'Creatives Dept',
                'is_public' => true,
                'organization_id' => 1, 
                'created_by' => 1
            ],
            [
                'name' => 'Research Dept',
                'is_public' => true,
                'organization_id' => 1,
                'created_by' => 1,
            ],
            [
                'name' => 'Media Dept',
                'is_public' => false,
                'organization_id' => 2,
                'created_by' => 1,
            ],
        ]);
    }
}
