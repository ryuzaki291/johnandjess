<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyTrip extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'month_year',
        'department',
        'plate_number',
        'vehicle_owner',
        'vehicle_brand',
        'customer_name',
        'destination',
        'date_from',
        'date_to',
        'particular',
        'total_allowance',
        'drivers_networth',
        'status_1',
        'amount_billed',
        'vat_12_percent',
        'total_amount',
        'service_invoice',
        'status_2',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_from' => 'date',
        'date_to' => 'date',
        'total_allowance' => 'decimal:2',
        'drivers_networth' => 'decimal:2',
        'amount_billed' => 'decimal:2',
        'vat_12_percent' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the vehicle associated with this daily trip.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'plate_number', 'plate_number');
    }
}
