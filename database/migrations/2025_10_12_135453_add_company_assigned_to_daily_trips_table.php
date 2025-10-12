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
            // Add company_assigned field after service_invoice_no
            $table->string('company_assigned')->nullable()->after('service_invoice_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_trips', function (Blueprint $table) {
            $table->dropColumn('company_assigned');
        });
    }
};
