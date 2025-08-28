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
            if (!Schema::hasColumn('daily_trips', 'vehicle_type')) {
                $table->string('vehicle_type')->nullable()->after('department');
            }
            if (!Schema::hasColumn('daily_trips', 'company_assigned')) {
                $table->string('company_assigned')->nullable()->after('vehicle_brand');
            }
            if (!Schema::hasColumn('daily_trips', 'location_area')) {
                $table->string('location_area')->nullable()->after('company_assigned');
            }
            if (!Schema::hasColumn('daily_trips', 'drivers_name')) {
                $table->string('drivers_name')->nullable()->after('location_area');
            }
            if (!Schema::hasColumn('daily_trips', 'start_date')) {
                $table->date('start_date')->nullable()->after('date_to');
            }
            if (!Schema::hasColumn('daily_trips', 'contract_amount')) {
                $table->decimal('contract_amount', 10, 2)->nullable()->after('vat_12_percent');
            }
            if (!Schema::hasColumn('daily_trips', 'less_5_ewt')) {
                $table->decimal('less_5_ewt', 10, 2)->nullable()->after('contract_amount');
            }
            if (!Schema::hasColumn('daily_trips', 'final_amount')) {
                $table->decimal('final_amount', 10, 2)->nullable()->after('less_5_ewt');
            }
            if (!Schema::hasColumn('daily_trips', 'remarks')) {
                $table->text('remarks')->nullable()->after('total_amount');
            }
            if (!Schema::hasColumn('daily_trips', 'suppliers_amount')) {
                $table->decimal('suppliers_amount', 10, 2)->nullable()->after('remarks');
            }
            if (!Schema::hasColumn('daily_trips', 'drivers_salary')) {
                $table->decimal('drivers_salary', 10, 2)->nullable()->after('suppliers_amount');
            }
            if (!Schema::hasColumn('daily_trips', 'additional_remarks')) {
                $table->text('additional_remarks')->nullable()->after('drivers_salary');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_trips', function (Blueprint $table) {
            $table->dropColumn([
                'vehicle_type',
                'company_assigned',
                'location_area',
                'drivers_name',
                'start_date',
                'contract_amount',
                'less_5_ewt',
                'final_amount',
                'remarks',
                'suppliers_amount',
                'drivers_salary',
                'additional_remarks'
            ]);
        });
    }
};
