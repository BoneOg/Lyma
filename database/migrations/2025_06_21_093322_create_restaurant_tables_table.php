<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurant_tables', function (Blueprint $table) {
            $table->id();
            $table->string('table_number', 10)->unique();
            $table->integer('capacity');
            $table->enum('status', ['available', 'under_maintenance'])->default('available');
            $table->string('location_description', 100)->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index('status');
            $table->index('table_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_tables');
    }
};