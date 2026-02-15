<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kicked_users', function (Blueprint $table) {
            $table->id();
            $table->text('reason')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('organization_id')
                ->constrained()
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kicked_users');
    }
};
