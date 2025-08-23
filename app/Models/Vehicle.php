<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vehicle extends Model
{
    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'plate_number';

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'plate_number',
        'vehicle_type',
        'vehicle_owner',
        'vehicle_owner_address',
        'vehicle_brand',
        'vehicle_status',
        'add_date_in_company',
        'creator',
        'creation_date',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'add_date_in_company' => 'date',
        'creation_date' => 'date',
    ];

    /**
     * Get the user that created this vehicle.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator', 'name');
    }
}
