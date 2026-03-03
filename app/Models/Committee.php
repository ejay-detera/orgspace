<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Committee extends Model
{
    use HasFactory;

    protected $table = 'committee';

    protected $fillable = [
        'name',
        'description',
        'is_public',
        'organization_id',
        'created_by',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function committeeMembers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'committee_user');
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(CommitteePermission::class);
    }
}
