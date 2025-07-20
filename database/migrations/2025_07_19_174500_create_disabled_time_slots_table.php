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
        Schema::create('disabled_time_slots', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedBigInteger('time_slot_id')->nullable();
            $table->foreign('time_slot_id')->references('id')->on('time_slots')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['date', 'time_slot_id']);
            $table->boolean('is_closed')->default(false);
            $table->time('special_start')->nullable();
            $table->time('special_end')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disabled_time_slots');
    }
};
