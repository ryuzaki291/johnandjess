<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\DailyTrip;
use App\Models\DriversMaintenance;
use App\Models\MainMaintenance;
use App\Models\Contract;
use App\Models\IncidentReport;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    /**
     * Get all vehicles for dropdown
     */
    public function getVehicles(): JsonResponse
    {
        try {
            $vehicles = Vehicle::select('plate_number', 'vehicle_type', 'vehicle_brand', 'vehicle_status')
                ->orderBy('plate_number')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $vehicles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch vehicles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search all data by plate number
     */
    public function searchByPlateNumber(Request $request): JsonResponse
    {
        \Log::info('Search request started', ['request_data' => $request->all()]);
        
        try {
            $validator = \Validator::make($request->all(), [
                'plate_number' => 'required|string|exists:vehicles,plate_number'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $plateNumber = $request->plate_number;
            \Log::info('Searching for plate number: ' . $plateNumber);

            // Get vehicle details with all fields
            $vehicle = Vehicle::with(['createdBy:id,name'])
                ->where('plate_number', $plateNumber)
                ->first();

            \Log::info('Vehicle found', ['vehicle' => $vehicle ? $vehicle->toArray() : null]);

            // Get all related data with complete field selection and relationships
            $dailyTrips = DailyTrip::with(['clientName:id,name'])
                ->where('plate_number', $plateNumber)
                ->orderBy('start_date', 'desc')
                ->get();

            \Log::info('Daily trips found', ['count' => $dailyTrips->count()]);

            $driversMaintenances = DriversMaintenance::with('createdBy:id,name')
                ->where('plate_number', $plateNumber)
                ->orderBy('date', 'desc')
                ->get();

            \Log::info('Drivers maintenance found', ['count' => $driversMaintenances->count()]);

            $mainMaintenances = MainMaintenance::with('createdBy:id,name')
                ->where('plate_number', $plateNumber)
                ->orderBy('date_of_pms', 'desc')
                ->get();

            \Log::info('Main maintenance found', ['count' => $mainMaintenances->count()]);

            $contracts = Contract::with('createdBy:id,name')
                ->where('plate_number', $plateNumber)
                ->orderBy('start_date', 'desc')
                ->get();

            \Log::info('Contracts found', ['count' => $contracts->count()]);

            $incidentReports = IncidentReport::with('creator:id,name')
                ->where('plate_number', $plateNumber)
                ->orderBy('incident_date', 'desc')
                ->get();

            \Log::info('Incident reports found', ['count' => $incidentReports->count()]);

            return response()->json([
                'success' => true,
                'data' => [
                    'vehicle' => $vehicle,
                    'daily_trips' => $dailyTrips,
                    'drivers_maintenance' => $driversMaintenances,
                    'main_maintenance' => $mainMaintenances,
                    'contracts' => $contracts,
                    'incident_reports' => $incidentReports,
                    'summary' => [
                        'total_daily_trips' => $dailyTrips->count(),
                        'total_drivers_maintenance' => $driversMaintenances->count(),
                        'total_main_maintenance' => $mainMaintenances->count(),
                        'total_contracts' => $contracts->count(),
                        'total_incident_reports' => $incidentReports->count(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Search failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Search failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
