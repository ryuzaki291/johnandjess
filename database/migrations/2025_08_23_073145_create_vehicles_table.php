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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->string('plate_number')->primary();
            $table->string('vehicle_type')->nullable();
            $table->string('vehicle_owner')->nullable();
            $table->text('vehicle_owner_address')->nullable();
            $table->string('vehicle_brand')->nullable();
            $table->string('vehicle_status')->nullable();
            $table->date('add_date_in_company')->nullable();
            $table->string('creator')->nullable();
            $table->foreign('creator')->references('name')->on('users')->onDelete('set null');
            $table->date('creation_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
