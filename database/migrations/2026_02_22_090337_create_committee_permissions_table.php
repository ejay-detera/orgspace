<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('committee_permissions', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('committee_id');
            $table->string('name');

            $table->timestamps();

            $table->foreign('committee_id')
                ->references('id')
                ->on('committee')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('committee_permissions');
    }
};
