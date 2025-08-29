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
        Schema::create('daily_trips', function (Blueprint $table) {
            $table->id();
            $table->string('month_year')->nullable();
            $table->string('department')->nullable();
            $table->string('vehicle_unit')->nullable();
            $table->string('plate_number')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('destination')->nullable();
            $table->date('date_from')->nullable();
            $table->date('date_to')->nullable();
            $table->text('particular')->nullable();
            $table->decimal('total_allowance', 10, 2)->nullable();
            $table->decimal('drivers_networth', 10, 2)->nullable();
            $table->string('status_1')->nullable();
            $table->decimal('amount_billed', 10, 2)->nullable();
            $table->decimal('vat_12_percent', 10, 2)->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->string('service_invoice')->nullable();
            $table->string('status_2')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_trips');
    }
};
