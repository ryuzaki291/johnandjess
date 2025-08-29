<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $vehicles = Vehicle::with('createdBy')->orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'vehicles' => $vehicles
            ]);
        } catch (\Exception $e) {
            \Log::error('Vehicle index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch vehicles'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        \Log::info('Creating vehicle with data:', $request->all());

        $validator = Validator::make($request->all(), [
            'plate_number' => 'required|string|max:20|unique:vehicles,plate_number',
            'vehicle_type' => 'nullable|string|max:100',
            'vehicle_owner' => 'nullable|string|max:255',
            'vehicle_owner_address' => 'nullable|string',
            'vehicle_brand' => 'nullable|string|max:100',
            'company_name' => 'nullable|string|in:DITO TELECOMMUNITY CORPORATION,CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION,FUTURENET AND TECHNOLOGY CORPORATION,BESTWORLD ENGINEERING SDN BHD',
            'vehicle_status' => 'nullable|string|max:50',
            'add_date_in_company' => 'nullable|date',
            'creation_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vehicleData = [
                'plate_number' => strtoupper($request->plate_number), // Convert to uppercase
                'vehicle_type' => $request->vehicle_type,
                'vehicle_owner' => $request->vehicle_owner,
                'vehicle_owner_address' => $request->vehicle_owner_address,
                'vehicle_brand' => $request->vehicle_brand,
                'company_name' => $request->company_name,
                'vehicle_status' => $request->vehicle_status ?? 'active',
                'add_date_in_company' => $request->add_date_in_company,
                'creator' => $request->user()->id, // Get creator ID from authenticated user
                'creation_date' => $request->creation_date ?? now()->toDateString(),
            ];

            \Log::info('Creating vehicle with processed data:', $vehicleData);

            $vehicle = Vehicle::create($vehicleData);
            $vehicle->load('createdBy'); // Load the relationship

            \Log::info('Vehicle created successfully:', $vehicle->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Vehicle created successfully',
                'vehicle' => $vehicle
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Vehicle creation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create vehicle'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $plate_number)
    {
        try {
            $vehicle = Vehicle::with('createdBy')->findOrFail($plate_number);
            return response()->json([
                'success' => true,
                'vehicle' => $vehicle
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $plate_number)
    {
        try {
            $vehicle = Vehicle::findOrFail($plate_number);

            $validator = Validator::make($request->all(), [
                'plate_number' => [
                    'required',
                    'string',
                    'max:20',
                    Rule::unique('vehicles', 'plate_number')->ignore($plate_number, 'plate_number')
                ],
                'vehicle_type' => 'nullable|string|max:100',
                'vehicle_owner' => 'nullable|string|max:255',
                'vehicle_owner_address' => 'nullable|string',
                'vehicle_brand' => 'nullable|string|max:100',
                'company_name' => 'nullable|string|in:DITO TELECOMMUNITY CORPORATION,CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION,FUTURENET AND TECHNOLOGY CORPORATION,BESTWORLD ENGINEERING SDN BHD',
                'vehicle_status' => 'nullable|string|max:50',
                'add_date_in_company' => 'nullable|date',
                'creation_date' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // If plate number is being changed, we need to handle it specially
            $newPlateNumber = strtoupper($request->plate_number);
            if ($newPlateNumber !== $plate_number) {
                // Create new record and delete old one (since plate_number is primary key)
                $vehicleData = $vehicle->toArray();
                unset($vehicleData['created_at'], $vehicleData['updated_at']);
                $vehicleData['plate_number'] = $newPlateNumber;
                
                // Update other fields
                $vehicleData['vehicle_type'] = $request->vehicle_type;
                $vehicleData['vehicle_owner'] = $request->vehicle_owner;
                $vehicleData['vehicle_owner_address'] = $request->vehicle_owner_address;
                $vehicleData['vehicle_brand'] = $request->vehicle_brand;
                $vehicleData['company_name'] = $request->company_name;
                $vehicleData['vehicle_status'] = $request->vehicle_status;
                $vehicleData['add_date_in_company'] = $request->add_date_in_company;
                $vehicleData['creation_date'] = $request->creation_date;

                $newVehicle = Vehicle::create($vehicleData);
                $vehicle->delete();
                $vehicle = $newVehicle;
            } else {
                // Normal update
                $vehicle->update([
                    'vehicle_type' => $request->vehicle_type,
                    'vehicle_owner' => $request->vehicle_owner,
                    'vehicle_owner_address' => $request->vehicle_owner_address,
                    'vehicle_brand' => $request->vehicle_brand,
                    'company_name' => $request->company_name,
                    'vehicle_status' => $request->vehicle_status,
                    'add_date_in_company' => $request->add_date_in_company,
                    'creation_date' => $request->creation_date,
                ]);
            }

            $vehicle->load('createdBy');

            return response()->json([
                'success' => true,
                'message' => 'Vehicle updated successfully',
                'vehicle' => $vehicle
            ]);
        } catch (\Exception $e) {
            \Log::error('Vehicle update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update vehicle'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $plate_number)
    {
        try {
            $vehicle = Vehicle::findOrFail($plate_number);
            $vehicle->delete();

            return response()->json([
                'success' => true,
                'message' => 'Vehicle deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Vehicle deletion error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete vehicle'
            ], 500);
        }
    }
}
