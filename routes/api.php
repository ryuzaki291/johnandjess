<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DailyTripController;
use App\Http\Controllers\DriversMaintenanceController;
use App\Http\Controllers\MainMaintenanceController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\DashboardController;

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

// Temporarily unprotected main maintenance routes for testing
Route::get('/main-maintenance', [MainMaintenanceController::class, 'index']);
Route::post('/main-maintenance', [MainMaintenanceController::class, 'store']);
Route::get('/main-maintenance/{id}', [MainMaintenanceController::class, 'show']);
Route::put('/main-maintenance/{id}', [MainMaintenanceController::class, 'update']);
Route::delete('/main-maintenance/{id}', [MainMaintenanceController::class, 'destroy']);
Route::get('/main-maintenance-vehicles', [MainMaintenanceController::class, 'getVehicles']);

// Temporarily unprotected contract routes for testing
Route::get('/contracts', [ContractController::class, 'index']);
Route::post('/contracts', [ContractController::class, 'store']);
Route::get('/contracts/{id}', [ContractController::class, 'show']);
Route::put('/contracts/{id}', [ContractController::class, 'update']);
Route::delete('/contracts/{id}', [ContractController::class, 'destroy']);
Route::get('/contracts-vehicles', [ContractController::class, 'getVehicles']);

// Temporarily unprotected incident report routes for testing
Route::get('/incident-reports', [IncidentReportController::class, 'index']);
Route::post('/incident-reports', [IncidentReportController::class, 'store']);
Route::get('/incident-reports/{id}', [IncidentReportController::class, 'show']);
Route::put('/incident-reports/{id}', [IncidentReportController::class, 'update']);
Route::delete('/incident-reports/{id}', [IncidentReportController::class, 'destroy']);
Route::get('/incident-reports-vehicles', [IncidentReportController::class, 'getVehicles']);
Route::post('/incident-reports/{id}/remove-file', [IncidentReportController::class, 'removeFile']);

// Search routes
Route::get('/search/vehicles', [SearchController::class, 'getVehicles']);
Route::post('/search/plate-number', [SearchController::class, 'searchByPlateNumber']);

// Dashboard routes
Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);
Route::get('/dashboard/vehicle-overview', [DashboardController::class, 'vehicleOverview']);

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
