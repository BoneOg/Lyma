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
        Schema::table('reservations', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['time_slot_id']);
            
            // Recreate the foreign key constraint with SET NULL on delete
            $table->foreign('time_slot_id')->references('id')->on('time_slots')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Drop the SET NULL foreign key constraint
            $table->dropForeign(['time_slot_id']);
            
            // Recreate the original CASCADE foreign key constraint
            $table->foreign('time_slot_id')->references('id')->on('time_slots')->onDelete('cascade');
        });
    }
};
