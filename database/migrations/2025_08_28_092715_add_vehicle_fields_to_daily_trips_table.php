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
            $table->string('vehicle_owner')->nullable()->after('plate_number');
            $table->string('vehicle_brand')->nullable()->after('vehicle_owner');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_trips', function (Blueprint $table) {
            $table->dropColumn(['vehicle_owner', 'vehicle_brand']);
        });
    }
};
