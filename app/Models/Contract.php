<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contract extends Model
{
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
