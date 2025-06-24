<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('setting_key', 50)->unique();
            $table->text('setting_value');
            $table->text('description')->nullable();
            $table->timestamps();
        });
        // Insert default capacity value
        DB::table('system_settings')->insert([
            'setting_key' => 'capacity',
            'setting_value' => 5,
            'description' => 'Number of available tables in the restaurant',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
