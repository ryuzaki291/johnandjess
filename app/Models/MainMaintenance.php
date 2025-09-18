<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class MainMaintenance extends Model
{
    protected $table = 'main_maintenance';

    /**
     * Boot the model and add model events
     */
    protected static function boot()
    {
        parent::boot();
        
        // Delete associated documents when main maintenance record is deleted
        static::deleting(function ($maintenance) {
            if ($maintenance->documents && is_array($maintenance->documents)) {
                \Log::info("Deleting documents for main maintenance ID: {$maintenance->id}", [
                    'document_count' => count($maintenance->documents)
                ]);
                
                foreach ($maintenance->documents as $document) {
                    if (isset($document['path'])) {
                        $deleted = Storage::disk('public')->delete($document['path']);
                        \Log::info("Document deletion result", [
                            'path' => $document['path'],
                            'deleted' => $deleted
                        ]);
                    }
                }
            }
        });
    }

    protected $fillable = [
        'assignee_name',
        'region_assign',
        'supplier_name',
        'vehicle_details',
        'plate_number',
        'odometer_record',
        'remarks',
        'date_of_pms',
        'performed',
        'amount',
        'qty',
        'creator',
        'documents'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'qty' => 'decimal:2',
        'documents' => 'array',
    ];

    /**
     * Get the vehicle that this maintenance record belongs to
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'plate_number', 'plate_number');
    }

    /**
     * Get the user who created this record
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator');
    }
}
