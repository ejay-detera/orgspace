<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionUserSeeder extends Seeder
{
    public function run(): void
    {
            // Removed erroneous empty insert call

        $rows = [
            [
                // USER 1 – President / Committee Head
                // CAN create, update, delete announcements
                'user_id'                    => 1,
                'create_projects'            => true,
                'update_projects'            => true,
                'delete_projects'            => true,
                'update_own_tasks'           => true,
                'update_other_tasks'         => true,
                'create_committees'          => true,
                'update_own_committees'      => true,
                'update_other_committees'    => true,
                'delete_own_committees'      => true,
                'delete_other_committees'    => true,
                'view_other_committees'      => true,
                'generate_organization_code' => true,
                'create_announcement'        => true,   
                'update_announcement'        => true,
                'delete_announcement'        => true,
            ],
            [
                // USER 2 – Same Org (regular member)
                'user_id'                    => 2,
                'create_projects'            => false,
                'update_projects'            => false,
                'delete_projects'            => false,
                'update_own_tasks'           => true,
                'update_other_tasks'         => false,
                'create_committees'          => false,
                'update_own_committees'      => false,
                'update_other_committees'    => false,
                'delete_own_committees'      => false,
                'delete_other_committees'    => false,
                'view_other_committees'      => false,
                'generate_organization_code' => false,
                'create_announcement'        => false,  
                'update_announcement'        => false,
                'delete_announcement'        => false,
            ],
            [
                // USER 3 – Same Committee (part of an specific committee)
                'user_id'                    => 3,
                'create_projects'            => false,
                'update_projects'            => false,
                'delete_projects'            => false,
                'update_own_tasks'           => true,
                'update_other_tasks'         => false,
                'create_committees'          => false,
                'update_own_committees'      => false,
                'update_other_committees'    => false,
                'delete_own_committees'      => false,
                'delete_other_committees'    => false,
                'view_other_committees'      => false,
                'generate_organization_code' => false,
                'create_announcement'        => false,  
                'update_announcement'        => false,
                'delete_announcement'        => false,
            ],
            [
                // USER 4 – Different Org (regular member)

                'user_id'                    => 4,
                'create_projects'            => false,
                'update_projects'            => false,
                'delete_projects'            => false,
                'update_own_tasks'           => true,
                'update_other_tasks'         => false,
                'create_committees'          => false,
                'update_own_committees'      => false,
                'update_other_committees'    => false,
                'delete_own_committees'      => false,
                'delete_other_committees'    => false,
                'view_other_committees'      => false,
                'generate_organization_code' => false,
                'create_announcement'        => false,  
                'update_announcement'        => false,
                'delete_announcement'        => false,
            ],
        ];

        DB::table('permission_user')->insert($rows);
    }
}
