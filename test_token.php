<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = App\Models\User::first();
$token = $user->createToken('test')->plainTextToken;

echo "Test Token: " . $token . "\n";
echo "User ID: " . $user->id . "\n";
echo "User Name: " . $user->name . "\n";
