<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\DailyTrip;

try {
    $trip = DailyTrip::first();
    
    if ($trip) {
        $trip->update([
            'vehicle_type' => 'SUV',
            'company_assigned' => 'ABC Corporation', 
            'location_area' => 'Manila',
            'drivers_name' => 'John Doe',
            'start_date' => '2025-08-01',
            'contract_amount' => 5000.00,
            'less_5_ewt' => 250.00,
            'final_amount' => 4750.00,
            'remarks' => 'Regular monthly trip',
            'suppliers_amount' => 3000.00,
            'drivers_salary' => 1500.00,
            'additional_remarks' => 'No issues reported'
        ]);
        
        echo "Sample data updated successfully!\n";
        echo "Updated Trip ID: " . $trip->id . "\n";
    } else {
        echo "No Daily Trip records found\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
