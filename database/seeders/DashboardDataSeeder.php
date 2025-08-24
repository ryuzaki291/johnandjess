<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;
use App\Models\DailyTrip;
use App\Models\DriversMaintenance;
use App\Models\MainMaintenance;
use App\Models\Contract;
use App\Models\IncidentReport;
use App\Models\User;
use Carbon\Carbon;

class DashboardDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a user
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@johnandjess.com',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]);
        }

        // Sample Vehicles
        $vehicles = [
            ['ABC-123', 'Sedan', 'Toyota', 'John Doe', '2023-01-15', 'active'],
            ['XYZ-456', 'SUV', 'Honda', 'Jane Smith', '2023-02-10', 'active'],
            ['DEF-789', 'Truck', 'Ford', 'Bob Johnson', '2023-03-05', 'maintenance'],
            ['GHI-012', 'Van', 'Nissan', 'Alice Brown', '2023-04-20', 'active'],
            ['JKL-345', 'Sedan', 'Toyota', 'Mike Wilson', '2023-05-15', 'inactive'],
        ];

        foreach ($vehicles as $vehicleData) {
            Vehicle::updateOrCreate(
                ['plate_number' => $vehicleData[0]],
                [
                    'vehicle_type' => $vehicleData[1],
                    'vehicle_brand' => $vehicleData[2],
                    'vehicle_owner' => $vehicleData[3],
                    'vehicle_owner_address' => '123 Main St, City, Philippines',
                    'vehicle_status' => $vehicleData[5],
                    'add_date_in_company' => $vehicleData[4],
                    'creation_date' => $vehicleData[4],
                    'creator' => $user->id,
                ]
            );
        }

        // Sample Daily Trips
        $trips = [
            ['ABC-123', 'Manila to Cebu', 'ABC Corp', '2024-08-15', '2024-08-17'],
            ['XYZ-456', 'Quezon to Davao', 'XYZ Ltd', '2024-08-18', '2024-08-20'],
            ['DEF-789', 'Makati to Baguio', 'DEF Inc', '2024-08-20', '2024-08-22'],
            ['ABC-123', 'Cebu to Manila', 'ABC Corp', '2024-08-22', '2024-08-24'],
            ['GHI-012', 'BGC to Clark', 'GHI Co', '2024-08-23', '2024-08-24'],
        ];

        foreach ($trips as $tripData) {
            DailyTrip::create([
                'month_year' => 'Aug 2024',
                'department' => 'Transport',
                'plate_number' => $tripData[0],
                'customer_name' => $tripData[2],
                'destination' => $tripData[1],
                'date_from' => $tripData[3],
                'date_to' => $tripData[4],
                'particular' => 'Business trip - ' . $tripData[1],
                'total_allowance' => rand(5000, 15000),
                'drivers_networth' => rand(3000, 8000),
                'status_1' => 'Completed',
                'amount_billed' => rand(20000, 50000),
                'vat_12_percent' => rand(2000, 6000),
                'total_amount' => rand(22000, 56000),
                'service_invoice' => 'SI-' . rand(1000, 9999),
                'status_2' => 'Paid',
            ]);
        }

        // Sample Drivers Maintenance
        $maintenanceRecords = [
            ['ABC-123', 'Juan Cruz', '50000', 'Oil change'],
            ['XYZ-456', 'Pedro Santos', '75000', 'Brake pads replacement'],
            ['DEF-789', 'Maria Garcia', '100000', 'Engine tune-up'],
        ];

        foreach ($maintenanceRecords as $maintenance) {
            DriversMaintenance::create([
                'plate_number' => $maintenance[0],
                'driver_name' => $maintenance[1],
                'odometer_record' => $maintenance[2],
                'date' => Carbon::now()->subDays(rand(1, 30))->format('Y-m-d'),
                'performed' => $maintenance[3],
                'amount' => rand(2000, 10000),
                'qty' => 1,
                'description' => 'Routine maintenance - ' . $maintenance[3],
                'next_pms' => rand(5000, 10000),
                'registration_month_date' => Carbon::now()->addDays(rand(30, 90))->format('M Y'),
                'parts' => 'Standard parts',
                'creator' => $user->id,
            ]);
        }

        // Sample Main Maintenance
        $mainMaintenance = [
            ['ABC-123', 'Central Garage', 'Region 1'],
            ['XYZ-456', 'City Auto Shop', 'Region 2'],
        ];

        foreach ($mainMaintenance as $maintenance) {
            MainMaintenance::create([
                'assignee_name' => 'Maintenance Team',
                'region_assign' => $maintenance[2],
                'supplier_name' => $maintenance[1],
                'plate_number' => $maintenance[0],
                'vehicle_details' => 'Regular maintenance check',
                'odometer_record' => rand(80000, 120000),
                'remarks' => 'Scheduled maintenance completed',
                'date_of_pms' => Carbon::now()->subDays(rand(1, 15))->format('Y-m-d'),
                'performed' => 'Complete vehicle inspection',
                'amount' => rand(15000, 25000),
                'qty' => 1,
                'creator' => $user->id,
            ]);
        }

        // Sample Contracts
        $contracts = [
            ['ABC-123', 'ABC Corp Transport Contract'],
            ['XYZ-456', 'XYZ Ltd Delivery Service'],
        ];

        foreach ($contracts as $contract) {
            Contract::create([
                'particular' => $contract[1],
                'plate_number' => $contract[0],
                'vehicle_type' => 'Sedan',
                'owners_name' => 'John & Jess Transport',
                'company_assigned' => 'ABC Corporation',
                'location_area' => 'Metro Manila',
                'drivers_name' => 'Juan Cruz',
                'amount_range' => '50,000 - 100,000',
                '12m_vat' => '12%',
                'contract_amount' => rand(80000, 150000),
                'less_ewt' => rand(5000, 10000),
                'final_amount' => rand(75000, 140000),
                'remarks' => '6-month contract',
                'suppliers_amount' => rand(60000, 120000),
                'drivers_salary' => rand(15000, 25000),
                'start_date' => Carbon::now()->subDays(rand(30, 90)),
                'end_remarks' => 'Active contract',
                'creator' => $user->id,
            ]);
        }

        // Sample Incident Reports
        $incidents = [
            ['ABC-123', 'Minor Accident', 'High'],
            ['DEF-789', 'Mechanical Issue', 'Medium'],
        ];

        foreach ($incidents as $incident) {
            IncidentReport::create([
                'plate_number' => $incident[0],
                'vehicle_type' => 'Sedan',
                'vehicle_owner' => 'John Doe',
                'incident_type' => $incident[1],
                'incident_description' => 'Incident occurred during regular operation',
                'incident_date' => Carbon::now()->subDays(rand(1, 20)),
                'incident_time' => '14:30:00',
                'location' => 'EDSA, Quezon City',
                'reporter_name' => 'Juan Cruz',
                'reporter_contact' => '09123456789',
                'reporter_position' => 'Driver',
                'damage_description' => 'Minor damage to front bumper',
                'estimated_cost' => rand(5000, 20000),
                'severity_level' => $incident[2],
                'status' => rand(0, 1) ? 'Pending' : 'In Progress',
                'action_taken' => 'Filed insurance claim',
                'notes' => 'Waiting for insurance assessment',
                'created_by' => $user->id,
            ]);
        }

        echo "Sample data created successfully!\n";
    }
}
