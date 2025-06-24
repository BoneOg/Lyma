<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('guest_first_name', 50)->nullable();
            $table->string('guest_last_name', 50)->nullable();
            $table->string('guest_email', 100)->nullable();
            $table->string('guest_phone', 20)->nullable();
            
            // Reservation details
            $table->date('reservation_date');
            $table->foreignId('time_slot_id')->constrained('time_slots')->onDelete('cascade');
            $table->integer('guest_count');
            
            // Status and notes
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            
            $table->timestamps();
            
            // Indexes
            $table->index('reservation_date');
            $table->index('status');
            $table->index('guest_email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
