<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Semester;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Semester::create([
            'name' => '1st Semester 2025-2026',
            'start_date' => '2025-09-01',
            'end_date' => '2026-01-17',
            'is_active' => false,
        ]);

        Semester::create([
            'name' => '2nd Semester 2025-2026',
            'start_date' => '2026-02-09',
            'end_date' => '2026-05-21',
            'is_active' => true, 
        ]);
    }
}
