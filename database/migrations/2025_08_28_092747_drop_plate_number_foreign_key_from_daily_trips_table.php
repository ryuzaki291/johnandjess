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
        Schema::table('daily_trips', function (Blueprint $table) {
            $table->dropForeign(['plate_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_trips', function (Blueprint $table) {
            $table->foreign('plate_number')->references('plate_number')->on('vehicles')->onDelete('set null');
        });
    }
};
