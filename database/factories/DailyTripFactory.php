<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DailyTrip>
 */
class DailyTripFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departments = ['Transportation', 'Logistics', 'Operations', 'Sales', 'Marketing'];
        $statuses1 = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
        $statuses2 = ['Active', 'Inactive', 'Under Review', 'Approved', 'Rejected'];
        $cities = ['Manila', 'Quezon City', 'Makati', 'Cebu', 'Davao', 'Baguio', 'Iloilo', 'Bacolod'];
        
        $amountBilled = $this->faker->randomFloat(2, 10000, 50000);
        $vat = $amountBilled * 0.12;
        $totalAmount = $amountBilled + $vat;
        
        return [
            'month_year' => $this->faker->monthName() . ' ' . $this->faker->year(),
            'department' => $this->faker->randomElement($departments),
            'plate_number' => null, // Will be set manually or by relationship
            'customer_name' => $this->faker->company(),
            'destination' => $this->faker->randomElement($cities) . ' to ' . $this->faker->randomElement($cities),
            'date_from' => $this->faker->dateTimeBetween('-30 days', '+30 days')->format('Y-m-d'),
            'date_to' => $this->faker->dateTimeBetween('+1 days', '+60 days')->format('Y-m-d'),
            'particular' => $this->faker->sentence(10),
            'total_allowance' => $this->faker->randomFloat(2, 2000, 8000),
            'drivers_networth' => $this->faker->randomFloat(2, 1500, 5000),
            'status_1' => $this->faker->randomElement($statuses1),
            'amount_billed' => $amountBilled,
            'vat_12_percent' => $vat,
            'total_amount' => $totalAmount,
            'service_invoice' => 'INV-' . $this->faker->year() . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'status_2' => $this->faker->randomElement($statuses2),
        ];
    }
}
