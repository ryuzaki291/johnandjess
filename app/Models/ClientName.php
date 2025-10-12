<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientName extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'is_active',
        'is_default',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    /**
     * Get the daily trips for this client name.
     */
    public function dailyTrips(): HasMany
    {
        return $this->hasMany(DailyTrip::class, 'client_name_id');
    }

    /**
     * Scope to get only active client names.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get the default client name.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Set a client name as default (ensures only one default exists).
     */
    public function setAsDefault()
    {
        // Remove default status from all other client names
        static::where('id', '!=', $this->id)->update(['is_default' => false]);
        
        // Set this one as default
        $this->update(['is_default' => true]);
    }

    /**
     * Get the default client name.
     */
    public static function getDefault()
    {
        return static::default()->first();
    }
}
