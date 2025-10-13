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
        $statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
        $cities = ['Manila', 'Quezon City', 'Makati', 'Cebu', 'Davao', 'Baguio', 'Iloilo', 'Bacolod'];
        $companies = ['DITO TELECOMMUNITY CORPORATION', 'CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION', 'SMART COMMUNICATIONS', 'GLOBE TELECOM'];
        
        $netAmount = $this->faker->randomFloat(2, 10000, 50000);
        $vat = $netAmount * 0.12;
        $totalSales = $netAmount + $vat;
        $withholding = $totalSales * 0.05;
        $amountDue = $totalSales - $withholding;
        
        return [
            'month' => $this->faker->monthName() . ' ' . $this->faker->year(),
            'start_date' => $this->faker->dateTimeBetween('-30 days', '+30 days'),
            'end_date' => $this->faker->dateTimeBetween('+1 days', '+60 days'),
            'vehicle_type' => $this->faker->randomElement(['Sedan', 'SUV', 'Van', 'Truck', 'Bus']),
            'plate_number' => null, // Will be set manually or by relationship
            'qty' => $this->faker->numberBetween(1, 10),
            'driver' => $this->faker->name(),
            'description' => $this->faker->sentence(10),
            'requestor' => $this->faker->name(),
            'department' => $this->faker->randomElement($departments),
            'cost_center' => 'CC-' . $this->faker->numberBetween(1000, 9999),
            'location' => $this->faker->randomElement($cities),
            'e_bill_no' => 'EB-' . $this->faker->year() . '-' . $this->faker->numberBetween(1000, 9999),
            'service_invoice_no' => 'SI-' . $this->faker->year() . '-' . $this->faker->numberBetween(1000, 9999),
            'company_assigned' => $this->faker->randomElement($companies),
            'amount_net_of_vat' => $netAmount,
            'add_vat_12_percent' => $vat,
            'total_sales_vat_inclusive' => $totalSales,
            'less_withholding_tax_5_percent' => $withholding,
            'total_amount_due' => $amountDue,
            'total_paid_invoice' => $this->faker->randomFloat(2, 0, $amountDue),
            'paid_invoice' => $this->faker->randomElement(['Yes', 'No', 'Partial']),
            'issuance_date_of_si' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'payment_ref_no' => 'PAY-' . $this->faker->numberBetween(10000, 99999),
            'bir_form_2307' => 'BIR-' . $this->faker->numberBetween(1000, 9999),
            'status' => $this->faker->randomElement($statuses),
            'date_of_billing' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'due_date' => $this->faker->dateTimeBetween('now', '+30 days'),
            'remarks' => $this->faker->optional()->sentence(),
        ];
    }
}
