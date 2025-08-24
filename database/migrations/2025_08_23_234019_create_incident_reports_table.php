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
        Schema::create('incident_reports', function (Blueprint $table) {
            $table->id();
            
            // Vehicle Information
            $table->string('plate_number');
            $table->string('vehicle_type')->nullable();
            $table->string('vehicle_owner')->nullable();
            
            // Incident Details
            $table->string('incident_type'); // Accident, Breakdown, Theft, etc.
            $table->text('incident_description');
            $table->date('incident_date');
            $table->time('incident_time');
            $table->string('location');
            
            // Reporter Information
            $table->string('reporter_name');
            $table->string('reporter_contact');
            $table->string('reporter_position'); // Driver, Mechanic, Manager, etc.
            
            // Damage Assessment
            $table->text('damage_description')->nullable();
            $table->decimal('estimated_cost', 15, 2)->nullable();
            $table->string('severity_level')->default('Low'); // Low, Medium, High, Critical
            
            // File Attachments
            $table->json('incident_images')->nullable(); // Array of image file paths
            $table->json('incident_documents')->nullable(); // Array of PDF/document file paths
            
            // Status and Follow-up
            $table->string('status')->default('Open'); // Open, In Progress, Resolved, Closed
            $table->text('action_taken')->nullable();
            $table->text('notes')->nullable();
            
            // System Fields
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('plate_number')->references('plate_number')->on('vehicles')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incident_reports');
    }
};
