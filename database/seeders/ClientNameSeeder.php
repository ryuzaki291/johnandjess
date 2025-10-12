<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClientName;
use App\Models\DailyTrip;
use Illuminate\Support\Facades\DB;

class ClientNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing client names from daily_trips table if any exist
        $existingClientNames = collect();
        
        try {
            // Try to get distinct client names from daily trips
            $existingClientNames = DailyTrip::distinct('client_name')
                ->whereNotNull('client_name')
                ->where('client_name', '!=', '')
                ->pluck('client_name')
                ->filter()
                ->unique();
        } catch (\Exception $e) {
            // If the column doesn't exist or any error, continue with default names
        }

        // Default client names to seed
        $defaultClientNames = [
            [
                'name' => 'DITO TELECOMMUNITY CORPORATION',
                'description' => 'Telecommunications and Digital Services',
                'is_active' => true,
                'is_default' => false,
            ],
            [
                'name' => 'CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION',
                'description' => 'Communication Services and Infrastructure',
                'is_active' => true,
                'is_default' => false,
            ],
            [
                'name' => 'FUTURENET AND TECHNOLOGY CORPORATION',
                'description' => 'Technology Solutions and Innovation',
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'name' => 'BESTWORLD ENGINEERING SDN BHD',
                'description' => 'Engineering and Construction Services',
                'is_active' => true,
                'is_default' => false,
            ],
        ];

        // Merge existing and default names
        $allClientNames = $defaultClientNames;

        // Add existing client names from daily trips if they don't exist in defaults
        foreach ($existingClientNames as $existingName) {
            $exists = collect($defaultClientNames)->contains('name', $existingName);
            
            if (!$exists) {
                $allClientNames[] = [
                    'name' => $existingName,
                    'description' => "Imported from existing daily trips",
                    'is_active' => true,
                    'is_default' => false,
                ];
            }
        }

        // Create client names
        foreach ($allClientNames as $clientNameData) {
            // Check if client name already exists
            $existingClientName = ClientName::where('name', $clientNameData['name'])->first();
            
            if (!$existingClientName) {
                ClientName::create($clientNameData);
                $this->command->info("Created client name: {$clientNameData['name']}");
            } else {
                $this->command->info("Client name already exists: {$clientNameData['name']}");
            }
        }

        // Ensure only one default exists
        $defaultCount = ClientName::where('is_default', true)->count();
        if ($defaultCount === 0) {
            // Set FUTURENET AND TECHNOLOGY CORPORATION as default if no default exists
            $futurenet = ClientName::where('name', 'FUTURENET AND TECHNOLOGY CORPORATION')->first();
            if ($futurenet) {
                $futurenet->update(['is_default' => true]);
                $this->command->info("Set FUTURENET AND TECHNOLOGY CORPORATION as default client name");
            } else {
                // Set first client as default
                $firstClient = ClientName::first();
                if ($firstClient) {
                    $firstClient->update(['is_default' => true]);
                    $this->command->info("Set {$firstClient->name} as default client name");
                }
            }
        } elseif ($defaultCount > 1) {
            // Ensure only one default
            ClientName::where('is_default', true)->skip(1)->update(['is_default' => false]);
            $this->command->info("Ensured only one default client name exists");
        }

        $this->command->info('Client name seeding completed successfully!');
    }
}
