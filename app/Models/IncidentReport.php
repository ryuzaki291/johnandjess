<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncidentReport extends Model
{
    protected $fillable = [
        'plate_number',
        'vehicle_type',
        'vehicle_owner',
        'incident_type',
        'incident_description',
        'incident_date',
        'incident_time',
        'location',
        'reporter_name',
        'reporter_contact',
        'reporter_position',
        'damage_description',
        'estimated_cost',
        'severity_level',
        'incident_images',
        'incident_documents',
        'status',
        'action_taken',
        'notes',
        'created_by'
    ];

    protected $casts = [
        'incident_date' => 'date',
        'estimated_cost' => 'decimal:2',
        'incident_images' => 'array',
        'incident_documents' => 'array',
    ];

    /**
     * Get the vehicle associated with this incident report
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'plate_number', 'plate_number');
    }

    /**
     * Get the user who created this incident report
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all image file paths as an array
     */
    public function getImagePathsAttribute(): array
    {
        return $this->incident_images ?? [];
    }

    /**
     * Get all document file paths as an array
     */
    public function getDocumentPathsAttribute(): array
    {
        return $this->incident_documents ?? [];
    }

    /**
     * Add a new image to the incident report
     */
    public function addImage(string $imagePath): void
    {
        $images = $this->incident_images ?? [];
        $images[] = $imagePath;
        $this->update(['incident_images' => $images]);
    }

    /**
     * Add a new document to the incident report
     */
    public function addDocument(string $documentPath): void
    {
        $documents = $this->incident_documents ?? [];
        $documents[] = $documentPath;
        $this->update(['incident_documents' => $documents]);
    }

    /**
     * Remove an image from the incident report
     */
    public function removeImage(string $imagePath): void
    {
        $images = $this->incident_images ?? [];
        $images = array_filter($images, fn($path) => $path !== $imagePath);
        $this->update(['incident_images' => array_values($images)]);
    }

    /**
     * Remove a document from the incident report
     */
    public function removeDocument(string $documentPath): void
    {
        $documents = $this->incident_documents ?? [];
        $documents = array_filter($documents, fn($path) => $path !== $documentPath);
        $this->update(['incident_documents' => array_values($documents)]);
    }
}
