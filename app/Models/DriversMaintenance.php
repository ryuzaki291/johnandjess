<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DriversMaintenance extends Model
{
    protected $table = 'drivers_maintenance';

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
        'creator'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'qty' => 'decimal:2',
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
