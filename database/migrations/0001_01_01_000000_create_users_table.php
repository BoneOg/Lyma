<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Your custom users table for restaurant
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->enum('role', ['admin', 'staff']);
            $table->string('username', 50)->unique();
            $table->string('name', 100);
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->index('role');
            $table->index('username');
        });

        // 🔐 KEEP - Essential for password resets
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // 🏠 KEEP - Essential for session-based auth
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};