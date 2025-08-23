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
        Schema::table('drivers_maintenance', function (Blueprint $table) {
            // Remove make and model columns since they'll come from vehicle relationship
            $table->dropColumn(['make', 'model']);
            
            // Add foreign key constraint for plate_number
            $table->foreign('plate_number')->references('plate_number')->on('vehicles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('drivers_maintenance', function (Blueprint $table) {
            // Drop foreign key constraint
            $table->dropForeign(['plate_number']);
            
            // Add back make and model columns
            $table->string('make')->nullable();
            $table->string('model')->nullable();
        });
    }
};
