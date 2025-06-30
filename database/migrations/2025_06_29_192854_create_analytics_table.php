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
        Schema::create('analytics', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->nullable()->index();
            $table->string('page_url');
            $table->string('page_title')->nullable();
            $table->enum('device_type', ['desktop', 'mobile', 'tablet'])->default('desktop');
            $table->string('user_agent')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('referrer')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->integer('screen_width')->nullable();
            $table->integer('screen_height')->nullable();
            $table->boolean('is_bounce')->default(true);
            $table->integer('time_on_page')->nullable(); // in seconds
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['created_at', 'device_type']);
            $table->index(['page_url', 'created_at']);
            $table->unique(['ip_address', 'user_agent', 'created_at'], 'unique_visitor_per_30min');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics');
    }
};
