<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = App\Models\User::first();
$token = $user->createToken('test')->plainTextToken;

echo "Test Token: " . $token . "\n";

// Test creating a vehicle
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/vehicles');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'plate_number' => 'ABC-123',
    'vehicle_type' => 'Van',
    'vehicle_brand' => 'Toyota',
    'vehicle_owner' => 'John Doe',
    'vehicle_status' => 'active',
    'add_date_in_company' => '2025-08-23',
    'creation_date' => '2025-08-23'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token,
    'X-Requested-With: XMLHttpRequest'
]);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "Response: " . $result . "\n";
