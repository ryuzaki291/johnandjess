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
                'month_year' => 'nullable|string|max:255',
                'department' => 'nullable|string|max:255',
                'vehicle_type' => 'nullable|string|max:255',
                'plate_number' => 'nullable|string|max:255',
                'vehicle_owner' => 'nullable|string|max:255',
                'vehicle_brand' => 'nullable|string|max:255',
                'company_assigned' => 'nullable|string|max:255',
                'location_area' => 'nullable|string|max:255',
                'drivers_name' => 'nullable|string|max:255',
                'customer_name' => 'nullable|string|max:255',
                'destination' => 'nullable|string|max:255',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date|after_or_equal:date_from',
                'start_date' => 'nullable|date',
                'particular' => 'nullable|string',
                'total_allowance' => 'nullable|numeric|min:0',
                'drivers_networth' => 'nullable|numeric|min:0',
                'status_1' => 'nullable|string|max:255',
                'amount_billed' => 'nullable|numeric|min:0',
                'vat_12_percent' => 'nullable|numeric|min:0',
                'contract_amount' => 'nullable|numeric|min:0',
                'less_5_ewt' => 'nullable|numeric|min:0',
                'final_amount' => 'nullable|numeric|min:0',
                'total_amount' => 'nullable|numeric|min:0',
                'remarks' => 'nullable|string',
                'suppliers_amount' => 'nullable|numeric|min:0',
                'drivers_salary' => 'nullable|numeric|min:0',
                'additional_remarks' => 'nullable|string',
                'service_invoice' => 'nullable|string|max:255',
                'status_2' => 'nullable|string|max:255',
            ]);

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
                'month_year' => 'nullable|string|max:255',
                'department' => 'nullable|string|max:255',
                'vehicle_type' => 'nullable|string|max:255',
                'plate_number' => 'nullable|string|max:255',
                'vehicle_owner' => 'nullable|string|max:255',
                'vehicle_brand' => 'nullable|string|max:255',
                'company_assigned' => 'nullable|string|max:255',
                'location_area' => 'nullable|string|max:255',
                'drivers_name' => 'nullable|string|max:255',
                'customer_name' => 'nullable|string|max:255',
                'destination' => 'nullable|string|max:255',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date|after_or_equal:date_from',
                'start_date' => 'nullable|date',
                'particular' => 'nullable|string',
                'total_allowance' => 'nullable|numeric|min:0',
                'drivers_networth' => 'nullable|numeric|min:0',
                'status_1' => 'nullable|string|max:255',
                'amount_billed' => 'nullable|numeric|min:0',
                'vat_12_percent' => 'nullable|numeric|min:0',
                'contract_amount' => 'nullable|numeric|min:0',
                'less_5_ewt' => 'nullable|numeric|min:0',
                'final_amount' => 'nullable|numeric|min:0',
                'total_amount' => 'nullable|numeric|min:0',
                'remarks' => 'nullable|string',
                'suppliers_amount' => 'nullable|numeric|min:0',
                'drivers_salary' => 'nullable|numeric|min:0',
                'additional_remarks' => 'nullable|string',
                'service_invoice' => 'nullable|string|max:255',
                'status_2' => 'nullable|string|max:255',
            ]);

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
