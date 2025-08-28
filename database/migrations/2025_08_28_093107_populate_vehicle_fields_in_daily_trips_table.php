<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\DailyTrip;
use App\Models\Vehicle;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Populate vehicle_owner and vehicle_brand for existing daily trips
        $dailyTrips = DailyTrip::whereNotNull('plate_number')
            ->where(function($query) {
                $query->whereNull('vehicle_owner')
                      ->orWhereNull('vehicle_brand');
            })
            ->get();

        foreach ($dailyTrips as $trip) {
            $vehicle = Vehicle::where('plate_number', $trip->plate_number)->first();
            if ($vehicle) {
                $trip->update([
                    'vehicle_owner' => $trip->vehicle_owner ?: $vehicle->vehicle_owner,
                    'vehicle_brand' => $trip->vehicle_brand ?: $vehicle->vehicle_brand,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Set vehicle_owner and vehicle_brand back to null
        DailyTrip::query()->update([
            'vehicle_owner' => null,
            'vehicle_brand' => null,
        ]);
    }
};
