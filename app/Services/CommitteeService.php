<?php

namespace App\Services;

use App\Models\Committee;
use App\Models\CommitteePermission;

class CommitteeService
{
    public static function getAvailablePermissions(): array
    {
        return [
            "create projects",
            "update projects",
            "delete projects",
            "update own tasks",
            "update other tasks",
            "create committees",
            "update own committees",
            "update other committees",
            "delete own committees",
            "delete other committees",
            "view other committees",
            "create announcement",
            "update announcement",
            "delete announcement",
            "generate organization code"
        ];
    }


    public static function syncPermissions(Committee $committee, array $permissions): void
    {
        CommitteePermission::where('committee_id', $committee->id)->delete();

        foreach ($permissions as $permName) {
            CommitteePermission::create([
                'name' => $permName,
                'committee_id' => $committee->id,
            ]);
        }
    }
}
