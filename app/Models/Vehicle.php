<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'company_name',
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
        return $this->belongsTo(User::class, 'creator', 'id');
    }

    /**
     * Get the daily trips for this vehicle.
     */
    public function dailyTriips(): HasMany
    {
        return $this->hasMany(DailyTrip::class, 'plate_number', 'plate_number');
    }

    /**
     * Get the drivers maintenance records for this vehicle.
     */
    public function driversMaintenances(): HasMany
    {
        return $this->hasMany(DriversMaintenance::class, 'plate_number', 'plate_number');
    }

    /**
     * Get the last digit of the plate number.
     *
     * @return int|null Returns the last digit if it's numeric, null otherwise
     */
    public function getPlateLastDigitAttribute(): ?int
    {
        $lastChar = substr($this->plate_number, -1);
        return is_numeric($lastChar) ? (int) $lastChar : null;
    }

    /**
     * Scope to filter vehicles by the last digit of their plate number.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $digit The digit to filter by (0-9)
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWhereLastDigit($query, int $digit)
    {
        return $query->where('plate_number', 'LIKE', '%' . $digit);
    }

    /**
     * Scope to get vehicles with numeric last digit.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithNumericLastDigit($query)
    {
        return $query->where('plate_number', 'REGEXP', '[0-9]$');
    }
}
