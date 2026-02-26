<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Announcement permissions
        $announcementPermissions = [
            'create_announcement',
            'update_announcement',
            'delete_announcement',
        ];

        foreach ($announcementPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        //Roles 
        // admin   – full access 
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions($announcementPermissions);

        // committeehead – can create, update, and delete announcements
        $committeehead = Role::firstOrCreate(['name' => 'committeehead']);
        $committeehead->syncPermissions($announcementPermissions);

        // member  – read-only
        Role::firstOrCreate(['name' => 'member']);
    }
}
