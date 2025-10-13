<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\DailyTrip;
use App\Models\DriversMaintenance;
use App\Models\MainMaintenance;
use App\Models\Contract;
use App\Models\IncidentReport;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function statistics()
    {
        try {
            // Get total counts
            $totalVehicles = Vehicle::count();
            $totalUsers = User::count();
            $totalDailyTrips = DailyTrip::count();
            $totalIncidentReports = IncidentReport::count();
            $totalContracts = Contract::count();
            $totalMaintenanceRecords = DriversMaintenance::count() + MainMaintenance::count();

            // Get vehicles by status
            $vehiclesByStatus = Vehicle::select('vehicle_status', DB::raw('count(*) as count'))
                ->groupBy('vehicle_status')
                ->get()
                ->pluck('count', 'vehicle_status');

            // Get recent daily trips (last 30 days)
            $recentTrips = DailyTrip::where('start_date', '>=', Carbon::now()->subDays(30))
                ->count();

            // Get pending/open incident reports
            $pendingIncidents = IncidentReport::whereIn('status', ['Pending', 'In Progress', 'Open'])
                ->count();

            // Get active contracts
            $activeContracts = Contract::count();

            // Get maintenance records from last 30 days
            $recentDriversMaintenance = DriversMaintenance::where('date', '>=', Carbon::now()->subDays(30)->format('Y-m-d'))
                ->count();
            $recentMainMaintenance = MainMaintenance::where('date_of_pms', '>=', Carbon::now()->subDays(30)->format('Y-m-d'))
                ->count();
            $recentMaintenance = $recentDriversMaintenance + $recentMainMaintenance;

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => [
                        'total_vehicles' => $totalVehicles,
                        'total_users' => $totalUsers,
                        'total_daily_trips' => $totalDailyTrips,
                        'total_incident_reports' => $totalIncidentReports,
                        'total_contracts' => $totalContracts,
                        'total_maintenance_records' => $totalMaintenanceRecords,
                        'recent_trips' => $recentTrips,
                        'pending_incidents' => $pendingIncidents,
                        'active_contracts' => $activeContracts,
                        'recent_maintenance' => $recentMaintenance
                    ],
                    'vehicles_by_status' => $vehiclesByStatus,
                    'recent_activities' => [],
                    'top_vehicles' => [],
                    'monthly_trends' => []
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard statistics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vehicle overview
     */
    public function vehicleOverview()
    {
        try {
            $vehicles = Vehicle::with('createdBy')->get();
            
            $overview = [
                'total' => $vehicles->count(),
                'by_status' => $vehicles->groupBy('vehicle_status')->map->count(),
                'by_type' => $vehicles->groupBy('vehicle_type')->map->count(),
                'by_brand' => $vehicles->groupBy('vehicle_brand')->map->count(),
                'recent_additions' => $vehicles->sortByDesc('created_at')->take(5)->values()
            ];

            return response()->json([
                'success' => true,
                'data' => $overview
            ]);
        } catch (\Exception $e) {
            \Log::error('Vehicle overview error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch vehicle overview'
            ], 500);
        }
    }
}
