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
        Schema::create('main_maintenance', function (Blueprint $table) {
            $table->id();
            $table->string('assignee_name');
            $table->string('region_assign');
            $table->string('supplier_name');
            $table->string('vehicle_details');
            $table->string('plate_number');
            $table->string('odometer_record');
            $table->text('remarks')->nullable();
            $table->string('date_of_pms');
            $table->string('performed');
            $table->decimal('amount', 10, 2);
            $table->decimal('qty', 8, 2);
            $table->unsignedBigInteger('creator')->nullable();
            $table->timestamps();

            // Foreign key constraint for plate_number
            $table->foreign('plate_number')->references('plate_number')->on('vehicles')->onDelete('cascade');
            
            // Index for better performance
            $table->index('plate_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('main_maintenance');
    }
};
