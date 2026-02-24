<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnnouncementAttachment extends Model
{
    use HasFactory;

    protected $table = 'announcements_attachments';

    protected $fillable = [
        'filename',
        'file_url',
        'created_by',
        'announcement_id',
    ];

    public $timestamps = false; 

    // Relationships
    public function announcement(): BelongsTo
    {
        return $this->belongsTo(Announcement::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
