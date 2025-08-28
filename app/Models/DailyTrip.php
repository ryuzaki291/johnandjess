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
        'vehicle_type',
        'plate_number',
        'vehicle_owner',
        'vehicle_brand',
        'company_assigned',
        'location_area',
        'drivers_name',
        'customer_name',
        'destination',
        'date_from',
        'date_to',
        'start_date',
        'particular',
        'total_allowance',
        'drivers_networth',
        'status_1',
        'amount_billed',
        'vat_12_percent',
        'contract_amount',
        'less_5_ewt',
        'final_amount',
        'total_amount',
        'remarks',
        'suppliers_amount',
        'drivers_salary',
        'additional_remarks',
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
        'start_date' => 'date',
        'total_allowance' => 'decimal:2',
        'drivers_networth' => 'decimal:2',
        'amount_billed' => 'decimal:2',
        'vat_12_percent' => 'decimal:2',
        'contract_amount' => 'decimal:2',
        'less_5_ewt' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'suppliers_amount' => 'decimal:2',
        'drivers_salary' => 'decimal:2',
    ];

    /**
     * Get the vehicle associated with this daily trip.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'plate_number', 'plate_number');
    }
}
