<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->foreignId('payment_method_id')->constrained('payment_methods')->onDelete('cascade');
            
            // Payment details
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('PHP');
            
            // PayMaya integration
            $table->string('transaction_id', 100)->nullable();
            $table->json('gateway_response')->nullable();
            
            // Payment status
            $table->enum('payment_status', ['pending', 'completed', 'failed'])->default('pending');
            
            $table->timestamp('payment_date')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('reservation_id');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
