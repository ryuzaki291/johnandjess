<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DailyTripController;
use App\Http\Controllers\DriversMaintenanceController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel + React + SQLite setup is working!',
        'timestamp' => now(),
        'database' => config('database.default')
    ]);
});

// Authentication routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Temporarily unprotected drivers maintenance routes for testing
Route::get('/drivers-maintenance', [DriversMaintenanceController::class, 'index']);
Route::post('/drivers-maintenance', [DriversMaintenanceController::class, 'store']);
Route::get('/drivers-maintenance/{id}', [DriversMaintenanceController::class, 'show']);
Route::put('/drivers-maintenance/{id}', [DriversMaintenanceController::class, 'update']);
Route::delete('/drivers-maintenance/{id}', [DriversMaintenanceController::class, 'destroy']);
Route::get('/drivers-maintenance-vehicles', [DriversMaintenanceController::class, 'getVehicles']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    // User management routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    
    // Vehicle management routes
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::get('/vehicles/{plate_number}', [VehicleController::class, 'show']);
    Route::put('/vehicles/{plate_number}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{plate_number}', [VehicleController::class, 'destroy']);
    
    // Daily Trips management routes
    Route::get('/daily-trips', [DailyTripController::class, 'index']);
    Route::post('/daily-trips', [DailyTripController::class, 'store']);
    Route::get('/daily-trips/{dailyTrip}', [DailyTripController::class, 'show']);
    Route::put('/daily-trips/{dailyTrip}', [DailyTripController::class, 'update']);
    Route::delete('/daily-trips/{dailyTrip}', [DailyTripController::class, 'destroy']);
    Route::get('/daily-trips-vehicles', [DailyTripController::class, 'getVehicles']);
});
