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
            
            // Customer information (for both registered users and guests)
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('guest_first_name', 50)->nullable();
            $table->string('guest_last_name', 50)->nullable();
            $table->string('guest_email', 100)->nullable();
            $table->string('guest_phone', 20)->nullable();
            
            // Reservation details
            $table->foreignId('table_id')->constrained('restaurant_tables')->onDelete('cascade');
            $table->date('reservation_date');
            $table->foreignId('time_slot_id')->constrained('time_slots')->onDelete('cascade');
            $table->integer('guest_count');
            
            // Status and notes
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->text('special_requests')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('reservation_date');
            $table->index('status');
            $table->index('user_id');
            $table->index('guest_email');
            
            // Unique constraint to prevent double booking
            $table->unique(['table_id', 'reservation_date', 'time_slot_id'], 'unique_table_datetime');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
