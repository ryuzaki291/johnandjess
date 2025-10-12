<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientNameController;

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel + React + SQLite setup is working!',
        'timestamp' => now(),
        'database' => config('database.default')
    ]);
});

// Create test vehicles route
Route::get('/create-test-vehicles', function () {
    $user = \App\Models\User::first();
    
    if (\App\Models\Vehicle::count() == 0) {
        \App\Models\Vehicle::create([
            'plate_number' => 'ABC123',
            'vehicle_owner' => 'John Doe',
            'vehicle_brand' => 'Toyota',
            'created_by' => $user->id
        ]);
        
        \App\Models\Vehicle::create([
            'plate_number' => 'XYZ789',
            'vehicle_owner' => 'Jane Smith',
            'vehicle_brand' => 'Honda',
            'created_by' => $user->id
        ]);
        
        \App\Models\Vehicle::create([
            'plate_number' => 'LMN456',
            'vehicle_owner' => 'Bob Wilson',
            'vehicle_brand' => 'Ford',
            'created_by' => $user->id
        ]);
        
        return response()->json([
            'message' => 'Created 3 test vehicles',
            'vehicles' => \App\Models\Vehicle::all()
        ]);
    }
    
    return response()->json([
        'message' => 'Vehicles already exist',
        'count' => \App\Models\Vehicle::count(),
        'vehicles' => \App\Models\Vehicle::all()
    ]);
});

// Test daily trip creation route
Route::get('/test-trip-creation', function () {
    try {
        $user = \App\Models\User::first();
        $vehicle = \App\Models\Vehicle::first();
        
        $testData = [
            'month_year' => '11',
            'department' => 'Test Department',
            'plate_number' => $vehicle ? $vehicle->plate_number : 'ABC123',
            'customer_name' => 'Test Customer',
            'destination' => 'Test Destination',
            'date_from' => '2025-08-24',
            'date_to' => '2025-08-25',
            'particular' => 'Test particular',
            'total_allowance' => 100.00,
            'drivers_networth' => 50.00,
            'status_1' => 'Pending',
            'amount_billed' => 200.00,
            'vat_12_percent' => 24.00,
            'total_amount' => 224.00,
            'service_invoice' => 'Test Invoice',
            'status_2' => 'Active',
        ];
        
        $trip = \App\Models\DailyTrip::create($testData);
        
        return response()->json([
            'message' => 'Test trip created successfully',
            'trip' => $trip,
            'vehicle' => $vehicle
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Settings routes
Route::get('/settings/client-names', [ClientNameController::class, 'index'])->name('settings.client-names');

// Catch all route for React Router (SPA)
// This should be the last route so it doesn't interfere with API routes
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
