<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MainMaintenance extends Model
{
    protected $table = 'main_maintenance';

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
        'creator'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'qty' => 'decimal:2',
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
