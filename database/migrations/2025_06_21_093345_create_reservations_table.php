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
            $table->text('special_requests')->nullable();
            
            // Reservation details
            $table->date('reservation_date');
            $table->foreignId('time_slot_id')->nullable()->constrained('time_slots')->onDelete('cascade');
            $table->integer('guest_count');
            
            // Special hours fields
            $table->boolean('is_special_hours')->default(false);
            $table->time('special_hours_start')->nullable();
            $table->time('special_hours_end')->nullable();
            
            // Status and notes
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            
            // Timer for 15-minute expiration
            $table->timestamp('expires_at')->nullable();
            
            // Email reminder tracking
            $table->timestamp('reminder_sent_at')->nullable();
            $table->unsignedTinyInteger('reminder_sent_count')->default(0);
            
            $table->timestamps();
            
            // Indexes
            $table->index('reservation_date');
            $table->index('status');
            $table->index('guest_email');
            $table->index('expires_at');
            $table->index(['reminder_sent_at', 'reminder_sent_count']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
