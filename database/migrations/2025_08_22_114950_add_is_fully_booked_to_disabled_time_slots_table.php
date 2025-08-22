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
        Schema::table('disabled_time_slots', function (Blueprint $table) {
            $table->boolean('is_fully_booked')->default(false)->after('time_slot_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('disabled_time_slots', function (Blueprint $table) {
            $table->dropColumn('is_fully_booked');
        });
    }
};
