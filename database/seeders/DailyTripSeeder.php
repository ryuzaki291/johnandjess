<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DailyTrip;
use App\Models\Vehicle;

class DailyTripSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First ensure we have some vehicles
        $vehicles = Vehicle::all();
        
        if ($vehicles->isEmpty()) {
            // Create some sample vehicles if none exist
            $sampleVehicles = [
                [
                    'plate_number' => 'ABC-123',
                    'vehicle_type' => 'Van',
                    'vehicle_owner' => 'John Doe',
                    'vehicle_owner_address' => '123 Main St, Manila',
                    'vehicle_brand' => 'Toyota Hiace',
                    'vehicle_status' => 'Active',
                    'add_date_in_company' => now(),
                    'creator' => 1,
                    'creation_date' => now(),
                ],
                [
                    'plate_number' => 'XYZ-456',
                    'vehicle_type' => 'Truck',
                    'vehicle_owner' => 'Jane Smith',
                    'vehicle_owner_address' => '456 Second St, Quezon City',
                    'vehicle_brand' => 'Mitsubishi Fuso',
                    'vehicle_status' => 'Active',
                    'add_date_in_company' => now(),
                    'creator' => 1,
                    'creation_date' => now(),
                ],
                [
                    'plate_number' => 'DEF-789',
                    'vehicle_type' => 'SUV',
                    'vehicle_owner' => 'Mike Johnson',
                    'vehicle_owner_address' => '789 Third St, Makati',
                    'vehicle_brand' => 'Ford Ranger',
                    'vehicle_status' => 'Active',
                    'add_date_in_company' => now(),
                    'creator' => 1,
                    'creation_date' => now(),
                ]
            ];

            foreach ($sampleVehicles as $vehicleData) {
                Vehicle::create($vehicleData);
            }
            
            $vehicles = Vehicle::all();
        }

        // Create sample daily trips
        $dailyTrips = [
            [
                'month_year' => 'August 2025',
                'department' => 'Transportation',
                'plate_number' => $vehicles->first()->plate_number,
                'customer_name' => 'ABC Corporation',
                'destination' => 'Manila to Cebu',
                'date_from' => '2025-08-01',
                'date_to' => '2025-08-03',
                'particular' => 'Delivery of goods to Cebu warehouse',
                'total_allowance' => 5000.00,
                'drivers_networth' => 3000.00,
                'status_1' => 'Completed',
                'amount_billed' => 25000.00,
                'vat_12_percent' => 3000.00,
                'total_amount' => 28000.00,
                'service_invoice' => 'INV-2025-001',
                'status_2' => 'Approved',
            ],
            [
                'month_year' => 'August 2025',
                'department' => 'Logistics',
                'plate_number' => $vehicles->skip(1)->first()->plate_number ?? $vehicles->first()->plate_number,
                'customer_name' => 'XYZ Enterprises',
                'destination' => 'Quezon City to Davao',
                'date_from' => '2025-08-05',
                'date_to' => '2025-08-07',
                'particular' => 'Equipment transport to Davao office',
                'total_allowance' => 7500.00,
                'drivers_networth' => 4500.00,
                'status_1' => 'In Progress',
                'amount_billed' => 35000.00,
                'vat_12_percent' => 4200.00,
                'total_amount' => 39200.00,
                'service_invoice' => 'INV-2025-002',
                'status_2' => 'Active',
            ],
            [
                'month_year' => 'August 2025',
                'department' => 'Operations',
                'plate_number' => $vehicles->last()->plate_number,
                'customer_name' => 'Global Trading Inc',
                'destination' => 'Makati to Baguio',
                'date_from' => '2025-08-10',
                'date_to' => '2025-08-12',
                'particular' => 'Conference materials delivery',
                'total_allowance' => 3000.00,
                'drivers_networth' => 2000.00,
                'status_1' => 'Pending',
                'amount_billed' => 15000.00,
                'vat_12_percent' => 1800.00,
                'total_amount' => 16800.00,
                'service_invoice' => 'INV-2025-003',
                'status_2' => 'Under Review',
            ],
        ];

        foreach ($dailyTrips as $tripData) {
            DailyTrip::create($tripData);
        }
    }
}
