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
            $table->string('month')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('vehicle_type')->nullable();
            $table->string('plate_number')->nullable();
            $table->integer('qty')->nullable();
            $table->string('driver')->nullable();
            $table->text('description')->nullable();
            $table->string('requestor')->nullable();
            $table->string('department')->nullable();
            $table->string('cost_center')->nullable();
            $table->string('location')->nullable();
            $table->string('e_bill_no')->nullable();
            $table->string('service_invoice_no')->nullable();
            $table->string('company_assigned')->nullable();
            $table->decimal('amount_net_of_vat', 10, 2)->nullable();
            $table->decimal('add_vat_12_percent', 10, 2)->nullable();
            $table->decimal('total_sales_vat_inclusive', 10, 2)->nullable();
            $table->decimal('less_withholding_tax_5_percent', 10, 2)->nullable();
            $table->decimal('total_amount_due', 10, 2)->nullable();
            $table->decimal('total_paid_invoice', 10, 2)->nullable();
            $table->string('paid_invoice')->nullable();
            $table->date('issuance_date_of_si')->nullable();
            $table->string('payment_ref_no')->nullable();
            $table->string('bir_form_2307')->nullable();
            $table->string('status')->nullable();
            $table->date('date_of_billing')->nullable();
            $table->date('due_date')->nullable();
            $table->text('remarks')->nullable();
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
