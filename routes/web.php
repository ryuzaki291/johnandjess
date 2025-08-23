<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Main application route
Route::get('/', function () {
    return view('welcome');
});

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel + React + SQLite setup is working!',
        'timestamp' => now(),
        'database' => config('database.default')
    ]);
});
