<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('day', 20)->nullable();
            $table->time('start_time');
            $table->time('end_time');
            $table->string('professor_name', 150)->nullable();
            $table->string('location', 100)->nullable();
            $table->boolean('recurring')->default(true);
            $table->date('specific_date')->nullable();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('semester_id')
                ->nullable()
                ->constrained('semesters')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
