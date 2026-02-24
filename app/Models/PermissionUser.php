<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermissionUser extends Model
{
    protected $table = 'permission_user';

    public $timestamps = false;

    protected $fillable = [
        'create_projects',
        'update_projects',
        'delete_projects',
        'update_own_tasks',
        'update_other_tasks',
        'create_committees',
        'update_own_committees',
        'update_other_committees',
        'delete_own_committees',
        'delete_other_committees',
        'view_other_committees',
        'generate_organization_code',
        'create_announcement',
        'update_announcement',
        'delete_announcement',
        'user_id',
    ];

    protected $casts = [
        'create_projects'           => 'boolean',
        'update_projects'           => 'boolean',
        'delete_projects'           => 'boolean',
        'update_own_tasks'          => 'boolean',
        'update_other_tasks'        => 'boolean',
        'create_committees'         => 'boolean',
        'update_own_committees'     => 'boolean',
        'update_other_committees'   => 'boolean',
        'delete_own_committees'     => 'boolean',
        'delete_other_committees'   => 'boolean',
        'view_other_committees'     => 'boolean',
        'generate_organization_code'=> 'boolean',
        'create_announcement'       => 'boolean',
        'update_announcement'       => 'boolean',
        'delete_announcement'       => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
