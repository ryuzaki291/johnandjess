<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
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

// Temporary debug endpoint for storage issues - REMOVE AFTER FIXING
Route::get('/debug/storage', function () {
    $storagePublicPath = storage_path('app/public');
    $publicStoragePath = public_path('storage');
    $incidentImagesPath = storage_path('app/public/incident_reports/images');
    
    return response()->json([
        'environment' => config('app.env'),
        'app_url' => config('app.url'),
        'server_info' => [
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
            'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'Unknown',
        ],
        'storage_paths' => [
            'storage_public_path' => $storagePublicPath,
            'public_storage_path' => $publicStoragePath,
            'incident_images_path' => $incidentImagesPath,
        ],
        'path_checks' => [
            'storage_public_exists' => file_exists($storagePublicPath),
            'public_storage_exists' => file_exists($publicStoragePath),
            'public_storage_is_link' => is_link($publicStoragePath),
            'public_storage_is_dir' => is_dir($publicStoragePath),
            'incident_images_exists' => file_exists($incidentImagesPath),
        ],
        'permissions' => [
            'storage_readable' => is_readable($storagePublicPath),
            'storage_writable' => is_writable($storagePublicPath),
            'public_storage_readable' => is_readable($publicStoragePath),
        ],
        'symlink_info' => [
            'target' => is_link($publicStoragePath) ? readlink($publicStoragePath) : null,
            'real_path' => realpath($publicStoragePath),
        ],
        'sample_files' => [
            'incident_images' => file_exists($incidentImagesPath) ? array_slice(glob($incidentImagesPath . '/*'), 0, 5) : [],
        ],
        'url_generation' => [
            'storage_url_function' => Storage::url('incident_reports/images/test.png'),
            'asset_url_function' => asset('storage/incident_reports/images/test.png'),
        ]
    ]);
});

// Simple direct storage serving route for shared hosting
Route::get('/storage-direct/{path}', function ($path) {
    // Clean and validate the path
    $cleanPath = str_replace(['../', '..\\'], '', $path);
    $fullPath = storage_path('app/public/' . $cleanPath);
    
    if (!file_exists($fullPath) || !is_file($fullPath)) {
        abort(404, 'File not found');
    }
    
    // Get file info
    $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
    
    // Set content type based on extension
    $contentType = 'application/octet-stream';
    switch ($extension) {
        case 'jpg':
        case 'jpeg':
            $contentType = 'image/jpeg';
            break;
        case 'png':
            $contentType = 'image/png';
            break;
        case 'gif':
            $contentType = 'image/gif';
            break;
        case 'svg':
            $contentType = 'image/svg+xml';
            break;
        case 'pdf':
            $contentType = 'application/pdf';
            break;
    }
    
    return response()->file($fullPath, [
        'Content-Type' => $contentType,
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');

// Download endpoint for files - forces download instead of display
Route::get('/download/{path}', function ($path) {
    // Clean and validate the path
    $cleanPath = str_replace(['../', '..\\'], '', $path);
    $fullPath = storage_path('app/public/' . $cleanPath);
    
    if (!file_exists($fullPath) || !is_file($fullPath)) {
        abort(404, 'File not found');
    }
    
    // Get original filename from path
    $fileName = basename($cleanPath);
    
    return response()->download($fullPath, $fileName, [
        'Cache-Control' => 'no-cache, must-revalidate',
    ]);
})->where('path', '.*');

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
Route::get('/drivers-maintenance/{id}/documents/{index}/download', [DriversMaintenanceController::class, 'downloadDocument']);
Route::delete('/drivers-maintenance/{id}/documents/{index}', [DriversMaintenanceController::class, 'deleteDocument']);

// Temporarily unprotected main maintenance routes for testing
Route::get('/main-maintenance', [MainMaintenanceController::class, 'index']);
Route::post('/main-maintenance', [MainMaintenanceController::class, 'store']);
Route::get('/main-maintenance/{id}', [MainMaintenanceController::class, 'show']);
Route::put('/main-maintenance/{id}', [MainMaintenanceController::class, 'update']);
Route::delete('/main-maintenance/{id}', [MainMaintenanceController::class, 'destroy']);
Route::get('/main-maintenance-vehicles', [MainMaintenanceController::class, 'getVehicles']);
Route::get('/main-maintenance/{id}/documents/{index}/download', [MainMaintenanceController::class, 'downloadDocument']);
Route::delete('/main-maintenance/{id}/documents/{index}', [MainMaintenanceController::class, 'deleteDocument']);

// Temporarily unprotected contract routes for testing
Route::get('/contracts', [ContractController::class, 'index']);
Route::post('/contracts', [ContractController::class, 'store']);
Route::get('/contracts/{id}', [ContractController::class, 'show']);
Route::put('/contracts/{id}', [ContractController::class, 'update']);
Route::delete('/contracts/{id}', [ContractController::class, 'destroy']);
Route::get('/contracts-vehicles', [ContractController::class, 'getVehicles']);
Route::get('/contracts/{contractId}/documents/{documentIndex}/download', [ContractController::class, 'downloadDocument']);
Route::delete('/contracts/{contractId}/documents', [ContractController::class, 'deleteDocument']);

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
