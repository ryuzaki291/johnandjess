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
        'month',
        'start_date',
        'end_date',
        'vehicle_type',
        'plate_number',
        'qty',
        'driver',
        'description',
        'requestor',
        'department',
        'cost_center',
        'location',
        'e_bill_no',
        'service_invoice_no',
        'company_assigned',
        'client_name_id',
        'amount_net_of_vat',
        'add_vat_12_percent',
        'total_sales_vat_inclusive',
        'less_withholding_tax_5_percent',
        'total_amount_due',
        'total_paid_invoice',
        'paid_invoice',
        'issuance_date_of_si',
        'payment_ref_no',
        'bir_form_2307',
        'status',
        'date_of_billing',
        'due_date',
        'remarks',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'issuance_date_of_si' => 'date',
        'date_of_billing' => 'date',
        'due_date' => 'date',
        'qty' => 'integer',
        'amount_net_of_vat' => 'decimal:2',
        'add_vat_12_percent' => 'decimal:2',
        'total_sales_vat_inclusive' => 'decimal:2',
        'less_withholding_tax_5_percent' => 'decimal:2',
        'total_amount_due' => 'decimal:2',
        'total_paid_invoice' => 'decimal:2',
    ];

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(\DateTimeInterface $date): string
    {
        return $date->format('Y-m-d');
    }

    /**
     * Get the vehicle associated with this daily trip.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'plate_number', 'plate_number');
    }

    /**
     * Get the client name associated with this daily trip.
     */
    public function clientName(): BelongsTo
    {
        return $this->belongsTo(ClientName::class, 'client_name_id');
    }
}
