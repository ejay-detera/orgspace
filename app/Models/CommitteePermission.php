<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommitteePermission extends Model
{
    protected $fillable = [
        'committee_id',
        'name',
    ];

    public function committee()
    {
        return $this->belongsTo(Committee::class);
    }
}
