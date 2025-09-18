<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Contract extends Model
{
    /**
     * Boot the model and add model events
     */
    protected static function boot()
    {
        parent::boot();
        
        // Delete associated documents when contract is deleted
        static::deleting(function ($contract) {
            if ($contract->documents && is_array($contract->documents)) {
                \Log::info("Deleting documents for contract ID: {$contract->id}", [
                    'document_count' => count($contract->documents)
                ]);
                
                foreach ($contract->documents as $document) {
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
        'particular',
        'vehicle_type',
        'plate_number',
        'owners_name',
        'company_assigned',
        'location_area',
        'drivers_name',
        'amount_range',
        '12m_vat',
        'contract_amount',
        'less_ewt',
        'final_amount',
        'remarks',
        'suppliers_amount',
        'drivers_salary',
        'revenue',
        'documents',
        'start_date',
        'end_remarks',
        'creator'
    ];

    protected $casts = [
        'contract_amount' => 'decimal:2',
        'less_ewt' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'suppliers_amount' => 'decimal:2',
        'drivers_salary' => 'decimal:2',
        'revenue' => 'decimal:2',
        'documents' => 'array',
        'start_date' => 'date',
    ];

    /**
     * Get the vehicle that this contract belongs to
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
