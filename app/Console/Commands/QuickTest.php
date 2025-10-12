<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DailyTrip;

class QuickTest extends Command
{
    protected $signature = 'test:quick';
    protected $description = 'Quick test of DailyTrip model';

    public function handle()
    {
        try {
            // Test creating a record with company_assigned
            $trip = DailyTrip::create([
                'month' => 'Test Month',
                'company_assigned' => 'FUTURENET AND TECHNOLOGY CORPORATION',
                'amount_net_of_vat' => 1000.00,
                'driver' => 'Test Driver'
            ]);

            $this->info("✅ Successfully created trip ID: {$trip->id}");
            $this->info("   Company: {$trip->company_assigned}");
            $this->info("   Amount: {$trip->amount_net_of_vat}");
            
            // Clean up
            $trip->delete();
            $this->info("✅ Test data cleaned up");
            $this->info("🎉 company_assigned field is working properly!");
            
        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
        }
    }
}
