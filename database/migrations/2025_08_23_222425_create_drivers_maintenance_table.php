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
        Schema::create('drivers_maintenance', function (Blueprint $table) {
            $table->id();
            $table->string('driver_name');
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->string('plate_number');
            $table->string('odometer_record')->nullable();
            $table->string('date')->nullable();
            $table->string('performed')->nullable();
            $table->decimal('amount', 10, 2)->default(0);
            $table->decimal('qty', 8, 2)->default(0);
            $table->text('description')->nullable();
            $table->string('next_pms')->nullable();
            $table->string('registration_month_date')->nullable();
            $table->string('parts')->nullable();
            $table->unsignedBigInteger('creator')->nullable();
            $table->timestamps();

            $table->foreign('creator')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers_maintenance');
    }
};
