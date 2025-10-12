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
            // Add client_name_id foreign key
            $table->unsignedBigInteger('client_name_id')->nullable();
            $table->foreign('client_name_id')->references('id')->on('client_names')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_trips', function (Blueprint $table) {
            $table->dropForeign(['client_name_id']);
            $table->dropColumn('client_name_id');
        });
    }
};
