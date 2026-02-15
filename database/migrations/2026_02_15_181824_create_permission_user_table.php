<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permission_user', function (Blueprint $table) {
            $table->id();

            $table->boolean('create_projects')->default(false);
            $table->boolean('update_projects')->default(false);
            $table->boolean('delete_projects')->default(false);
            $table->boolean('update_own_tasks')->default(false);
            $table->boolean('update_other_tasks')->default(false);

            $table->boolean('create_committees')->default(false);
            $table->boolean('update_own_committees')->default(false);
            $table->boolean('update_other_committees')->default(false);
            $table->boolean('delete_own_committees')->default(false);
            $table->boolean('delete_other_committees')->default(false);
            $table->boolean('view_other_committees')->default(false);
            $table->boolean('generate_organization_code')->default(false);

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_user');
    }
};
