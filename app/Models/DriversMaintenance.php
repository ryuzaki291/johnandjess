<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DriversMaintenance extends Model
{
    protected $table = 'drivers_maintenance';

    /**
     * Boot the model and add model events
     */
    protected static function boot()
    {
        parent::boot();
        
        // Delete associated documents when drivers maintenance record is deleted
        static::deleting(function ($maintenance) {
            if ($maintenance->documents && is_array($maintenance->documents)) {
                \Log::info("Deleting documents for drivers maintenance ID: {$maintenance->id}", [
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
        'driver_name',
        'plate_number',
        'odometer_record',
        'date',
        'performed',
        'amount',
        'qty',
        'description',
        'next_pms',
        'registration_month_date',
        'parts',
        'creator',
        'documents'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'qty' => 'decimal:2',
        'documents' => 'array',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator');
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'plate_number', 'plate_number');
    }
}
