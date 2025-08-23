<?php

namespace App\Http\Controllers;

use App\Models\MainMaintenance;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MainMaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            Log::info('Main maintenance index request started');
            
            $mainMaintenance = MainMaintenance::with(['vehicle', 'createdBy'])->get();
            
            Log::info('Main maintenance records retrieved', ['count' => $mainMaintenance->count()]);
            
            return response()->json([
                'success' => true,
                'data' => $mainMaintenance
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching main maintenance records: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching main maintenance records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Main maintenance store request started');
            Log::info('Request data: ' . json_encode($request->all()));
            
            $validator = Validator::make($request->all(), [
                'assignee_name' => 'required|string|max:255',
                'region_assign' => 'required|string|max:255',
                'supplier_name' => 'required|string|max:255',
                'vehicle_details' => 'required|string|max:255',
                'plate_number' => 'required|string|exists:vehicles,plate_number',
                'odometer_record' => 'required|string|max:255',
                'date_of_pms' => 'required|string|max:255',
                'performed' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'qty' => 'required|numeric|min:0',
                'remarks' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . json_encode($validator->errors()));
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get authenticated user or use default creator
            $authUser = Auth::user();
            Log::info('Auth user: ' . ($authUser ? $authUser->id : 'null'));
            Log::info('Auth check: ' . (Auth::check() ? 'true' : 'false'));

            $data = $request->all();
            $data['creator'] = $authUser ? $authUser->id : 1; // Fallback to user 1 for testing

            Log::info('Creating main maintenance record with data: ' . json_encode($data));

            $mainMaintenance = MainMaintenance::create($data);
            
            // Load relationships
            $mainMaintenance->load(['vehicle', 'createdBy']);
            
            Log::info('Main maintenance record created successfully: ' . json_encode($mainMaintenance));

            return response()->json([
                'success' => true,
                'message' => 'Main maintenance record created successfully',
                'data' => $mainMaintenance
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating main maintenance record: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error creating main maintenance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $mainMaintenance = MainMaintenance::with(['vehicle', 'createdBy'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $mainMaintenance
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching main maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Main maintenance record not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Main maintenance update request started for ID: ' . $id);
            
            $mainMaintenance = MainMaintenance::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'assignee_name' => 'required|string|max:255',
                'region_assign' => 'required|string|max:255',
                'supplier_name' => 'required|string|max:255',
                'vehicle_details' => 'required|string|max:255',
                'plate_number' => 'required|string|exists:vehicles,plate_number',
                'odometer_record' => 'required|string|max:255',
                'date_of_pms' => 'required|string|max:255',
                'performed' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'qty' => 'required|numeric|min:0',
                'remarks' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $mainMaintenance->update($request->all());
            $mainMaintenance->load(['vehicle', 'createdBy']);
            
            Log::info('Main maintenance record updated successfully');

            return response()->json([
                'success' => true,
                'message' => 'Main maintenance record updated successfully',
                'data' => $mainMaintenance
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating main maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating main maintenance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            Log::info('Main maintenance delete request started for ID: ' . $id);
            
            $mainMaintenance = MainMaintenance::findOrFail($id);
            $mainMaintenance->delete();
            
            Log::info('Main maintenance record deleted successfully');

            return response()->json([
                'success' => true,
                'message' => 'Main maintenance record deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting main maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting main maintenance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vehicles for dropdown selection
     */
    public function getVehicles()
    {
        try {
            $vehicles = Vehicle::select('plate_number', 'vehicle_type', 'vehicle_brand')->get();
            
            return response()->json([
                'success' => true,
                'data' => $vehicles
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching vehicles: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching vehicles',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
