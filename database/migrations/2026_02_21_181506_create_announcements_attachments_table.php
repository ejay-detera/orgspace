<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('announcements_attachments', function (Blueprint $table) {
            $table->id(); // attachmentID
            $table->string('filename');
            $table->string('file_url');
            $table->timestamp('created_at')->useCurrent();
            
            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();
                
            $table->foreignId('announcement_id')
                ->constrained('announcements')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements_attachments');
    }
};
