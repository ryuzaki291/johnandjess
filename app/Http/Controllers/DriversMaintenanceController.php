<?php

namespace App\Http\Controllers;

use App\Models\DriversMaintenance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DriversMaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $records = DriversMaintenance::with(['createdBy:id,name', 'vehicle'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $records
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching drivers maintenance records: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching records'
            ], 500);
        }
    }

    /**
     * Get vehicles for dropdown
     */
    public function getVehicles(): JsonResponse
    {
        try {
            $vehicles = \App\Models\Vehicle::select('plate_number', 'vehicle_type', 'vehicle_brand', 'vehicle_status')
                ->orderBy('plate_number')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $vehicles
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching vehicles: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching vehicles'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Drivers maintenance store request started');
            Log::info('Request data: ' . json_encode($request->all()));
            Log::info('Auth user: ' . json_encode(Auth::user()));
            Log::info('Auth check: ' . (Auth::check() ? 'true' : 'false'));

            $validator = Validator::make($request->all(), [
                'driver_name' => 'required|string|max:255',
                'plate_number' => 'required|string|max:255|exists:vehicles,plate_number',
                'odometer_record' => 'nullable|string|max:255',
                'date' => 'nullable|string|max:255',
                'performed' => 'nullable|string|max:255',
                'amount' => 'nullable|numeric|min:0',
                'qty' => 'nullable|numeric|min:0',
                'description' => 'nullable|string',
                'next_pms' => 'nullable|string|max:255',
                'registration_month_date' => 'nullable|string|max:255',
                'parts' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . json_encode($validator->errors()));
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();
            $validatedData['creator'] = Auth::id() ?: 1; // Default to user ID 1 if not authenticated

            Log::info('Creating drivers maintenance record with data: ' . json_encode($validatedData));

            $record = DriversMaintenance::create($validatedData);
            $record->load(['createdBy:id,name', 'vehicle']);

            Log::info('Drivers maintenance record created successfully: ' . json_encode($record));

            return response()->json([
                'success' => true,
                'message' => 'Drivers maintenance record created successfully',
                'data' => $record
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating drivers maintenance record: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error creating record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $record = DriversMaintenance::with(['createdBy:id,name', 'vehicle'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $record
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching drivers maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Record not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $record = DriversMaintenance::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'driver_name' => 'required|string|max:255',
                'plate_number' => 'required|string|max:255|exists:vehicles,plate_number',
                'odometer_record' => 'nullable|string|max:255',
                'date' => 'nullable|string|max:255',
                'performed' => 'nullable|string|max:255',
                'amount' => 'nullable|numeric|min:0',
                'qty' => 'nullable|numeric|min:0',
                'description' => 'nullable|string',
                'next_pms' => 'nullable|string|max:255',
                'registration_month_date' => 'nullable|string|max:255',
                'parts' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();

            Log::info('Updating drivers maintenance record with data: ' . json_encode($validatedData));

            $record->update($validatedData);
            $record->load(['createdBy:id,name', 'vehicle']);

            Log::info('Drivers maintenance record updated successfully: ' . json_encode($record));

            return response()->json([
                'success' => true,
                'message' => 'Drivers maintenance record updated successfully',
                'data' => $record
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating drivers maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating record'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $record = DriversMaintenance::findOrFail($id);

            Log::info('Deleting drivers maintenance record: ' . json_encode($record));

            $record->delete();

            Log::info('Drivers maintenance record deleted successfully');

            return response()->json([
                'success' => true,
                'message' => 'Drivers maintenance record deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting drivers maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting record'
            ], 500);
        }
    }
}
