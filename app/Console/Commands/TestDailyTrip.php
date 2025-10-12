<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DailyTrip;

class TestDailyTrip extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:daily-trip';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test DailyTrip model with auto-calculated fields';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            // Test 1: FUTURENET company (2% withholding tax)
            $trip1 = DailyTrip::create([
                'month' => 'October 2025',
                'company_assigned' => 'FUTURENET AND TECHNOLOGY CORPORATION',
                'amount_net_of_vat' => 1000.00,
                'add_vat_12_percent' => 120.00, // 12% of 1000
                'total_sales_vat_inclusive' => 1120.00, // 1000 + 120
                'less_withholding_tax_5_percent' => 20.00, // 2% of 1000 (FUTURENET rate)
                'total_amount_due' => 1100.00, // 1120 - 20
                'driver' => 'Test Driver 1',
                'description' => 'Test FUTURENET auto-calculation'
            ]);

            $this->info("✅ Created FUTURENET trip ID: {$trip1->id}");
            $this->info("   - Net Amount: ₱{$trip1->amount_net_of_vat}");
            $this->info("   - VAT (12%): ₱{$trip1->add_vat_12_percent}");
            $this->info("   - Withholding Tax (2%): ₱{$trip1->less_withholding_tax_5_percent}");
            $this->info("   - Total Due: ₱{$trip1->total_amount_due}");
            $this->info("   - Company: {$trip1->company_assigned}");

            // Test 2: Other company (5% withholding tax)
            $trip2 = DailyTrip::create([
                'month' => 'October 2025',
                'company_assigned' => 'DITO TELECOMMUNITY CORPORATION',
                'amount_net_of_vat' => 1000.00,
                'add_vat_12_percent' => 120.00, // 12% of 1000
                'total_sales_vat_inclusive' => 1120.00, // 1000 + 120
                'less_withholding_tax_5_percent' => 50.00, // 5% of 1000 (standard rate)
                'total_amount_due' => 1070.00, // 1120 - 50
                'driver' => 'Test Driver 2',
                'description' => 'Test DITO auto-calculation'
            ]);

            $this->info("\n✅ Created DITO trip ID: {$trip2->id}");
            $this->info("   - Net Amount: ₱{$trip2->amount_net_of_vat}");
            $this->info("   - VAT (12%): ₱{$trip2->add_vat_12_percent}");
            $this->info("   - Withholding Tax (5%): ₱{$trip2->less_withholding_tax_5_percent}");
            $this->info("   - Total Due: ₱{$trip2->total_amount_due}");
            $this->info("   - Company: {$trip2->company_assigned}");

            $this->info("\n🎉 Backend can successfully save auto-calculated financial data!");
            
            // Clean up test data
            $trip1->delete();
            $trip2->delete();
            $this->info("\n🧹 Test data cleaned up");

        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            $this->error("Stack trace: " . $e->getTraceAsString());
        }
    }
}
