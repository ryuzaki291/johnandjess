<?php

namespace App\Http\Controllers;

use App\Models\DailyTrip;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class DailyTripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $trips = DailyTrip::with('vehicle')->orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $trips
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch daily trips',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Log the incoming request data for debugging
            Log::info('Daily trip creation request data:', $request->all());
            
            $validated = $request->validate([
                'month' => 'nullable|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'vehicle_type' => 'nullable|string|max:255',
                'plate_number' => 'nullable|string|max:255',
                'qty' => 'nullable|integer|min:1',
                'driver' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'requestor' => 'nullable|string|max:255',
                'department' => 'nullable|string|max:255',
                'cost_center' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'e_bill_no' => 'nullable|string|max:255',
                'service_invoice_no' => 'nullable|string|max:255',
                'company_assigned' => 'nullable|string|max:255',
                'amount_net_of_vat' => 'nullable|numeric|min:0',
                'add_vat_12_percent' => 'nullable|numeric|min:0',
                'total_sales_vat_inclusive' => 'nullable|numeric|min:0',
                'less_withholding_tax_5_percent' => 'nullable|numeric|min:0',
                'total_amount_due' => 'nullable|numeric|min:0',
                'total_paid_invoice' => 'nullable|numeric|min:0',
                'paid_invoice' => 'nullable|string|max:255',
                'issuance_date_of_si' => 'nullable|date',
                'payment_ref_no' => 'nullable|string|max:255',
                'bir_form_2307' => 'nullable|string|max:255',
                'status' => 'nullable|string|max:255',
                'date_of_billing' => 'nullable|date',
                'due_date' => 'nullable|date',
                'remarks' => 'nullable|string|in:Due Today,Overdue,Upcoming',
            ]);

            // Auto-set billing date based on issuance date if not provided
            if (!empty($validated['issuance_date_of_si']) && empty($validated['date_of_billing'])) {
                $validated['date_of_billing'] = $validated['issuance_date_of_si'];
            }
            
            // Auto-calculate due date (60 days after billing date) if not provided
            if (!empty($validated['date_of_billing']) && empty($validated['due_date'])) {
                $billingDate = new \DateTime($validated['date_of_billing']);
                $dueDate = clone $billingDate;
                $dueDate->add(new \DateInterval('P60D')); // Add 60 days
                $validated['due_date'] = $dueDate->format('Y-m-d');
            }

            Log::info('Validated data:', $validated);

            $trip = DailyTrip::create($validated);
            $trip->load('vehicle');

            Log::info('Daily trip created successfully:', $trip->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Daily trip created successfully',
                'data' => $trip
            ], 201);
        } catch (ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create daily trip:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create daily trip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(DailyTrip $dailyTrip): JsonResponse
    {
        try {
            $dailyTrip->load('vehicle');
            
            return response()->json([
                'success' => true,
                'data' => $dailyTrip
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch daily trip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DailyTrip $dailyTrip): JsonResponse
    {
        try {
            $validated = $request->validate([
                'month' => 'nullable|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'vehicle_type' => 'nullable|string|max:255',
                'plate_number' => 'nullable|string|max:255',
                'qty' => 'nullable|integer|min:1',
                'driver' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'requestor' => 'nullable|string|max:255',
                'department' => 'nullable|string|max:255',
                'cost_center' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'e_bill_no' => 'nullable|string|max:255',
                'service_invoice_no' => 'nullable|string|max:255',
                'company_assigned' => 'nullable|string|max:255',
                'amount_net_of_vat' => 'nullable|numeric|min:0',
                'add_vat_12_percent' => 'nullable|numeric|min:0',
                'total_sales_vat_inclusive' => 'nullable|numeric|min:0',
                'less_withholding_tax_5_percent' => 'nullable|numeric|min:0',
                'total_amount_due' => 'nullable|numeric|min:0',
                'total_paid_invoice' => 'nullable|numeric|min:0',
                'paid_invoice' => 'nullable|string|max:255',
                'issuance_date_of_si' => 'nullable|date',
                'payment_ref_no' => 'nullable|string|max:255',
                'bir_form_2307' => 'nullable|string|max:255',
                'status' => 'nullable|string|max:255',
                'date_of_billing' => 'nullable|date',
                'due_date' => 'nullable|date',
                'remarks' => 'nullable|string|in:Due Today,Overdue,Upcoming',
            ]);

            // Auto-set billing date based on issuance date if not provided
            if (!empty($validated['issuance_date_of_si']) && empty($validated['date_of_billing'])) {
                $validated['date_of_billing'] = $validated['issuance_date_of_si'];
            }
            
            // Auto-calculate due date (60 days after billing date) if not provided
            if (!empty($validated['date_of_billing']) && empty($validated['due_date'])) {
                $billingDate = new \DateTime($validated['date_of_billing']);
                $dueDate = clone $billingDate;
                $dueDate->add(new \DateInterval('P60D')); // Add 60 days
                $validated['due_date'] = $dueDate->format('Y-m-d');
            }

            $dailyTrip->update($validated);
            $dailyTrip->load('vehicle');

            return response()->json([
                'success' => true,
                'message' => 'Daily trip updated successfully',
                'data' => $dailyTrip
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update daily trip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DailyTrip $dailyTrip): JsonResponse
    {
        try {
            $dailyTrip->delete();

            return response()->json([
                'success' => true,
                'message' => 'Daily trip deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete daily trip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all vehicles for dropdown selection
     */
    public function getVehicles(): JsonResponse
    {
        try {
            $vehicles = Vehicle::select('plate_number', 'vehicle_owner', 'vehicle_brand')->get();
            
            return response()->json([
                'success' => true,
                'data' => $vehicles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch vehicles',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
