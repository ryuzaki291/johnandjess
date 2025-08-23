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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('particular');
            $table->string('vehicle_type');
            $table->string('plate_number');
            $table->string('owners_name');
            $table->string('company_assigned');
            $table->string('location_area');
            $table->string('drivers_name');
            $table->string('amount_range')->nullable();
            $table->string('12m_vat')->nullable();
            $table->decimal('contract_amount', 12, 2);
            $table->decimal('less_ewt', 10, 2)->nullable();
            $table->decimal('final_amount', 12, 2);
            $table->text('remarks')->nullable();
            $table->decimal('suppliers_amount', 12, 2)->nullable();
            $table->decimal('drivers_salary', 10, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->text('end_remarks')->nullable();
            $table->unsignedBigInteger('creator')->nullable();
            $table->timestamps();

            // Foreign key constraint for plate_number
            $table->foreign('plate_number')->references('plate_number')->on('vehicles')->onDelete('cascade');
            
            // Index for better performance
            $table->index('plate_number');
            $table->index('company_assigned');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
