<?php

namespace Tests\Feature;

use App\Models\DailyTrip;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use Carbon\Carbon;

class DailyTripBillingDateTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user and authenticate for API calls
        $user = User::factory()->create();
        Sanctum::actingAs($user);
    }

    /**
     * Test that billing date is automatically set when issuance date is provided during creation.
     */
    public function test_billing_date_auto_reflects_issuance_date_on_creation(): void
    {
        $issuanceDate = '2025-10-15';
        
        $response = $this->postJson('/api/daily-trips', [
            'month' => 'October 2025',
            'driver' => 'John Doe',
            'issuance_date_of_si' => $issuanceDate,
            // Note: we don't provide date_of_billing - it should be auto-set
            'amount_net_of_vat' => 1000.00,
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'issuance_date_of_si',
                        'date_of_billing',
                    ]
                ]);

        $data = $response->json('data');
        
        // Assert that the billing date matches the issuance date
        $this->assertEquals($issuanceDate, $data['issuance_date_of_si']);
        $this->assertEquals($issuanceDate, $data['date_of_billing']);
    }

    /**
     * Test that billing date is automatically set when issuance date is provided during update.
     */
    public function test_billing_date_auto_reflects_issuance_date_on_update(): void
    {
        // Create a daily trip first
        $trip = DailyTrip::factory()->create([
            'issuance_date_of_si' => null,
            'date_of_billing' => null,
        ]);

        $issuanceDate = '2025-10-20';
        
        $response = $this->putJson("/api/daily-trips/{$trip->id}", [
            'month' => $trip->month,
            'driver' => $trip->driver,
            'issuance_date_of_si' => $issuanceDate,
            // Note: we don't provide date_of_billing - it should be auto-set
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'issuance_date_of_si',
                        'date_of_billing',
                    ]
                ]);

        $data = $response->json('data');
        
        // Assert that the billing date matches the issuance date
        $this->assertEquals($issuanceDate, $data['issuance_date_of_si']);
        $this->assertEquals($issuanceDate, $data['date_of_billing']);
    }

    /**
     * Test that manual billing date is preserved when explicitly provided.
     */
    public function test_manual_billing_date_is_preserved(): void
    {
        $issuanceDate = '2025-10-15';
        $billingDate = '2025-10-20'; // Different from issuance date
        
        $response = $this->postJson('/api/daily-trips', [
            'month' => 'October 2025',
            'driver' => 'John Doe',
            'issuance_date_of_si' => $issuanceDate,
            'date_of_billing' => $billingDate, // Explicitly provided
            'amount_net_of_vat' => 1000.00,
        ]);

        $response->assertStatus(201);
        $data = $response->json('data');
        
        // Assert that the manually set billing date is preserved
        $this->assertEquals($issuanceDate, $data['issuance_date_of_si']);
        $this->assertEquals($billingDate, $data['date_of_billing']);
    }

    /**
     * Test that billing date unchanged when no issuance date is provided.
     */
    public function test_billing_date_unchanged_when_no_issuance_date(): void
    {
        $response = $this->postJson('/api/daily-trips', [
            'month' => 'October 2025',
            'driver' => 'John Doe',
            'amount_net_of_vat' => 1000.00,
            // Note: no issuance_date_of_si or date_of_billing provided
        ]);

        $response->assertStatus(201);
        $data = $response->json('data');
        
        // Assert that both dates are null (they may not be present in the response at all)
        $this->assertTrue(!isset($data['issuance_date_of_si']) || $data['issuance_date_of_si'] === null);
        $this->assertTrue(!isset($data['date_of_billing']) || $data['date_of_billing'] === null);
    }

    /**
     * Test that due date is automatically calculated (60 days after billing date) on creation.
     */
    public function test_due_date_auto_calculated_from_billing_date_on_creation(): void
    {
        $billingDate = '2025-10-15';
        $expectedDueDate = '2025-12-14'; // 60 days after billing date
        
        $response = $this->postJson('/api/daily-trips', [
            'month' => 'October 2025',
            'driver' => 'John Doe',
            'date_of_billing' => $billingDate,
            // Note: we don't provide due_date - it should be auto-calculated
            'amount_net_of_vat' => 1000.00,
        ]);

        $response->assertStatus(201);
        $data = $response->json('data');
        
        // Assert that the due date is correctly calculated (60 days after billing date)
        $this->assertEquals($billingDate, $data['date_of_billing']);
        $this->assertEquals($expectedDueDate, $data['due_date']);
    }

    /**
     * Test that due date is automatically calculated from issuance date when both billing and due dates are auto-set.
     */
    public function test_due_date_auto_calculated_from_issuance_date_chain(): void
    {
        $issuanceDate = '2025-10-15';
        $expectedBillingDate = '2025-10-15'; // Same as issuance date
        $expectedDueDate = '2025-12-14'; // 60 days after billing date
        
        $response = $this->postJson('/api/daily-trips', [
            'month' => 'October 2025',
            'driver' => 'John Doe',
            'issuance_date_of_si' => $issuanceDate,
            // Note: we don't provide date_of_billing or due_date - both should be auto-set
            'amount_net_of_vat' => 1000.00,
        ]);

        $response->assertStatus(201);
        $data = $response->json('data');
        
        // Assert the complete chain: issuance -> billing -> due date
        $this->assertEquals($issuanceDate, $data['issuance_date_of_si']);
        $this->assertEquals($expectedBillingDate, $data['date_of_billing']);
        $this->assertEquals($expectedDueDate, $data['due_date']);
    }

    /**
     * Test that due date is automatically calculated on update.
     */
    public function test_due_date_auto_calculated_on_update(): void
    {
        // Create a daily trip first
        $trip = DailyTrip::factory()->create([
            'date_of_billing' => null,
            'due_date' => null,
        ]);

        $billingDate = '2025-11-01';
        $expectedDueDate = '2025-12-31'; // 60 days after billing date
        
        $response = $this->putJson("/api/daily-trips/{$trip->id}", [
            'month' => $trip->month,
            'driver' => $trip->driver,
            'date_of_billing' => $billingDate,
            // Note: we don't provide due_date - it should be auto-calculated
        ]);

        $response->assertStatus(200);
        $data = $response->json('data');
        
        // Assert that the due date is correctly calculated
        $this->assertEquals($billingDate, $data['date_of_billing']);
        $this->assertEquals($expectedDueDate, $data['due_date']);
    }

    /**
     * Test that manual due date is preserved when explicitly provided.
     */
    public function test_manual_due_date_is_preserved(): void
    {
        $billingDate = '2025-10-15';
        $manualDueDate = '2025-11-30'; // Different from auto-calculated date
        
        $response = $this->postJson('/api/daily-trips', [
            'month' => 'October 2025',
            'driver' => 'John Doe',
            'date_of_billing' => $billingDate,
            'due_date' => $manualDueDate, // Explicitly provided
            'amount_net_of_vat' => 1000.00,
        ]);

        $response->assertStatus(201);
        $data = $response->json('data');
        
        // Assert that the manually set due date is preserved
        $this->assertEquals($billingDate, $data['date_of_billing']);
        $this->assertEquals($manualDueDate, $data['due_date']);
    }

    /**
     * Test edge case: due date calculation across year boundary.
     */
    public function test_due_date_calculation_across_year_boundary(): void
    {
        $billingDate = '2025-11-15';
        $expectedDueDate = '2026-01-14'; // 60 days later, crossing into next year
        
        $response = $this->postJson('/api/daily-trips', [
            'month' => 'November 2025',
            'driver' => 'John Doe',
            'date_of_billing' => $billingDate,
            'amount_net_of_vat' => 1000.00,
        ]);

        $response->assertStatus(201);
        $data = $response->json('data');
        
        // Assert that the due date correctly crosses year boundary
        $this->assertEquals($billingDate, $data['date_of_billing']);
        $this->assertEquals($expectedDueDate, $data['due_date']);
    }

    /**
     * Test automatic remarks calculation for overdue status.
     */
    public function test_automatic_remarks_overdue(): void
    {
        $pastDueDate = Carbon::now()->subDays(5)->format('Y-m-d'); // 5 days overdue
        
        $trip = DailyTrip::factory()->create([
            'due_date' => $pastDueDate,
        ]);

        // Test the computed attribute
        $this->assertEquals('Overdue', $trip->auto_remarks);
        
        // Test through API response
        $response = $this->getJson("/api/daily-trips/{$trip->id}");
        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertEquals('Overdue', $data['auto_remarks']);
    }

    /**
     * Test automatic remarks calculation for due today status.
     */
    public function test_automatic_remarks_due_today(): void
    {
        $todayDate = Carbon::now()->format('Y-m-d'); // Due today
        
        $trip = DailyTrip::factory()->create([
            'due_date' => $todayDate,
        ]);

        // Test the computed attribute
        $this->assertEquals('Due Today', $trip->auto_remarks);
        
        // Test through API response
        $response = $this->getJson("/api/daily-trips/{$trip->id}");
        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertEquals('Due Today', $data['auto_remarks']);
    }

    /**
     * Test automatic remarks calculation for upcoming status.
     */
    public function test_automatic_remarks_upcoming(): void
    {
        $futureDueDate = Carbon::now()->addDays(10)->format('Y-m-d'); // 10 days in future
        
        $trip = DailyTrip::factory()->create([
            'due_date' => $futureDueDate,
        ]);

        // Test the computed attribute
        $this->assertEquals('Upcoming', $trip->auto_remarks);
        
        // Test through API response
        $response = $this->getJson("/api/daily-trips/{$trip->id}");
        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertEquals('Upcoming', $data['auto_remarks']);
    }

    /**
     * Test automatic remarks when no due date is set.
     */
    public function test_automatic_remarks_no_due_date(): void
    {
        $trip = DailyTrip::factory()->create([
            'due_date' => null,
        ]);

        // Test the computed attribute
        $this->assertEquals('', $trip->auto_remarks);
        
        // Test through API response
        $response = $this->getJson("/api/daily-trips/{$trip->id}");
        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertEquals('', $data['auto_remarks']);
    }
}