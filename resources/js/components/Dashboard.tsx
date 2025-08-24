import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import VehiclePage from './pages/Vehicle';
import DailyTrips from './pages/DailyTrips';
import Maintenance from './pages/Maintenance';
import Contracts from './pages/Contracts';
import IncidentReport from './pages/IncidentReport';
import UserManagement from './pages/UserManagement';

interface DashboardProps {
    user: any;
    token: string;
    onLogout: () => void;
}

interface ApiResponse {
    message: string;
    timestamp: string;
    database: string;
}

interface Vehicle {
    plate_number: string;
    vehicle_type: string;
    vehicle_brand: string;
    vehicle_status: string;
}

interface SearchResults {
    vehicle: any;
    daily_trips: any[];
    drivers_maintenance: any[];
    main_maintenance: any[];
    contracts: any[];
    incident_reports: any[];
    summary: {
        total_daily_trips: number;
        total_drivers_maintenance: number;
        total_main_maintenance: number;
        total_contracts: number;
        total_incident_reports: number;
    };
}

interface DashboardStats {
    overview: {
        total_vehicles: number;
        total_users: number;
        total_daily_trips: number;
        total_incident_reports: number;
        total_contracts: number;
        total_maintenance_records: number;
        recent_trips: number;
        pending_incidents: number;
        active_contracts: number;
        recent_maintenance: number;
    };
    vehicles_by_status: Record<string, number>;
    incidents_by_severity: Record<string, number>;
    top_vehicles: Array<{
        plate_number: string;
        trip_count: number;
        vehicle: Vehicle;
    }>;
    recent_activities: Array<{
        type: string;
        title: string;
        description: string;
        date: string;
        user: string;
    }>;
    monthly_trends: Array<{
        month: string;
        trips: number;
        incidents: number;
        maintenance: number;
    }>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, token, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('dashboard'); // New state for tabs
    const [apiData, setApiData] = useState<ApiResponse | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState<string | null>(null);
    
    // Search functionality state
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedPlateNumber, setSelectedPlateNumber] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
        setStatsLoading(true);
        setStatsError(null);
        try {
            const response = await fetch('/api/dashboard/statistics', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setDashboardStats(result.data);
                } else {
                    setStatsError(result.message || 'Failed to load dashboard data');
                }
            } else {
                setStatsError(`Failed to load dashboard data (${response.status})`);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard statistics:', error);
            setStatsError('Failed to connect to server');
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch API test data
        fetch('/api/test')
            .then(response => response.json())
            .then(data => {
                setApiData(data);
            })
            .catch(err => {
                setError('Failed to connect to API');
            });

        // Fetch users list
        fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.users) {
                    setUsers(data.users);
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch users');
                setLoading(false);
            });

        // Fetch dashboard statistics
        fetchDashboardStats();
    }, [token]);

    // Fetch vehicles for dropdown
    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/search/vehicles');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setVehicles(result.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    };

    // Perform search by plate number
    const handleSearch = async () => {
        if (!selectedPlateNumber) {
            setSearchError('Please select a plate number');
            return;
        }

        setSearchLoading(true);
        setSearchError(null);

        try {
            console.log('Making search request for plate number:', selectedPlateNumber);
            
            const response = await fetch('/api/search/plate-number', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    plate_number: selectedPlateNumber
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.ok) {
                const result = await response.json();
                console.log('Search result:', result);
                if (result.success) {
                    setSearchResults(result.data);
                } else {
                    setSearchError(result.message || 'Search failed');
                }
            } else {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                setSearchError(`Search request failed (${response.status}): ${errorText}`);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchError('An error occurred during search: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
            setSearchLoading(false);
        }
    };

    // Clear search results
    const handleClearSearch = () => {
        setSelectedPlateNumber('');
        setSearchResults(null);
        setSearchError(null);
    };

    // Load vehicles when search tab is active
    useEffect(() => {
        if (activeTab === 'search' && vehicles.length === 0) {
            fetchVehicles();
        }
    }, [activeTab]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            onLogout();
        }
    };

    const renderDashboardContent = () => {
        return (
            <div className="max-w-7xl mx-auto">
                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'dashboard'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('search')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'search'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Search
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'dashboard' && renderDashboardTab()}
                {activeTab === 'search' && renderSearchTab()}
            </div>
        );
    };

    const renderDashboardTab = () => {
        const stats = dashboardStats?.overview;
        
        return (
            <>
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-gray-600">John & Jess Transport Management System</p>
                    </div>
                    <button
                        onClick={fetchDashboardStats}
                        disabled={statsLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
                    >
                        <svg className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{statsLoading ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>

                {/* Loading State */}
                {statsLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading dashboard data...</span>
                    </div>
                )}

                {/* Error State */}
                {statsError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Dashboard Error</h3>
                                <p className="text-sm text-red-700 mt-1">{statsError}</p>
                                <button
                                    onClick={fetchDashboardStats}
                                    className="mt-2 text-sm text-red-800 underline hover:text-red-900"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <span className="text-2xl">🚗</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats ? stats.total_vehicles.toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <span className="text-2xl">🗺️</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Recent Trips (30 days)</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats ? stats.recent_trips.toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending Incidents</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats ? stats.pending_incidents.toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats ? stats.total_users.toLocaleString() : users.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100">
                                <span className="text-xl">📋</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Daily Trips</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats ? stats.total_daily_trips.toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100">
                                <span className="text-xl">🔧</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Maintenance Records</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats ? stats.total_maintenance_records.toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-teal-100">
                                <span className="text-xl">📄</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Active Contracts</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats ? stats.active_contracts.toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                        </div>
                        <div className="p-6">
                            {dashboardStats?.recent_activities.length ? (
                                <div className="space-y-4">
                                    {dashboardStats.recent_activities.slice(0, 6).map((activity, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                                activity.type === 'vehicle' ? 'bg-blue-500' :
                                                activity.type === 'incident' ? 'bg-red-500' :
                                                'bg-green-500'
                                            }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(activity.date).toLocaleDateString()} • {activity.user}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <p>No recent activities</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Vehicles */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Most Active Vehicles</h3>
                        </div>
                        <div className="p-6">
                            {dashboardStats?.top_vehicles.length ? (
                                <div className="space-y-4">
                                    {dashboardStats.top_vehicles.map((vehicle, index) => (
                                        <div key={vehicle.plate_number} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {vehicle.plate_number}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {vehicle.vehicle?.vehicle_type} - {vehicle.vehicle?.vehicle_brand}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {vehicle.trip_count} trips
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <p>No trip data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Monthly Trends Chart */}
                {dashboardStats?.monthly_trends && (
                    <div className="bg-white rounded-lg shadow-md mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends (Last 6 Months)</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {dashboardStats.monthly_trends.map((month, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium text-gray-900">{month.month}</h4>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <p className="text-blue-600 font-medium">Trips</p>
                                                <p className="text-xl font-bold text-blue-900">{month.trips}</p>
                                            </div>
                                            <div className="bg-red-50 p-3 rounded-lg">
                                                <p className="text-red-600 font-medium">Incidents</p>
                                                <p className="text-xl font-bold text-red-900">{month.incidents}</p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <p className="text-green-600 font-medium">Maintenance</p>
                                                <p className="text-xl font-bold text-green-900">{month.maintenance}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Vehicle Status Distribution */}
                {dashboardStats?.vehicles_by_status && Object.keys(dashboardStats.vehicles_by_status).length > 0 && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Vehicle Status Distribution</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(dashboardStats.vehicles_by_status).map(([status, count]) => (
                                    <div key={status} className="text-center p-4 border border-gray-200 rounded-lg">
                                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                                        <p className="text-sm text-gray-500 capitalize">{status || 'Unknown'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const renderSearchTab = () => {
        return (
            <>
                {/* Search Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Search by Plate Number</h1>
                    <p className="text-gray-600">Find all records related to a specific vehicle</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Vehicle (Plate Number)
                            </label>
                            <select 
                                value={selectedPlateNumber}
                                onChange={(e) => setSelectedPlateNumber(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a vehicle...</option>
                                {vehicles.map((vehicle) => (
                                    <option key={vehicle.plate_number} value={vehicle.plate_number}>
                                        {vehicle.plate_number} - {vehicle.vehicle_type} ({vehicle.vehicle_brand})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Or Enter Plate Number
                            </label>
                            <input
                                type="text"
                                value={selectedPlateNumber}
                                onChange={(e) => setSelectedPlateNumber(e.target.value.toUpperCase())}
                                placeholder="ABC-123"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    
                    {searchError && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {searchError}
                        </div>
                    )}

                    <div className="mt-4">
                        <button 
                            onClick={handleSearch}
                            disabled={searchLoading || !selectedPlateNumber}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium mr-3"
                        >
                            {searchLoading ? 'Searching...' : 'Search'}
                        </button>
                        <button 
                            onClick={handleClearSearch}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Search Results */}
                {searchResults && (
                    <div className="space-y-6">
                        {/* Vehicle Info */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Plate Number</p>
                                        <p className="text-lg text-gray-900">{searchResults.vehicle.plate_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
                                        <p className="text-lg text-gray-900">{searchResults.vehicle.vehicle_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Brand</p>
                                        <p className="text-lg text-gray-900">{searchResults.vehicle.vehicle_brand}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Owner</p>
                                        <p className="text-lg text-gray-900">{searchResults.vehicle.vehicle_owner}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            searchResults.vehicle.vehicle_status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {searchResults.vehicle.vehicle_status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Date Added</p>
                                        <p className="text-lg text-gray-900">
                                            {new Date(searchResults.vehicle.add_date_in_company).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-blue-600">Daily Trips</p>
                                <p className="text-2xl font-bold text-blue-900">{searchResults.summary.total_daily_trips}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-green-600">Drivers Maintenance</p>
                                <p className="text-2xl font-bold text-green-900">{searchResults.summary.total_drivers_maintenance}</p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-yellow-600">Main Maintenance</p>
                                <p className="text-2xl font-bold text-yellow-900">{searchResults.summary.total_main_maintenance}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-purple-600">Contracts</p>
                                <p className="text-2xl font-bold text-purple-900">{searchResults.summary.total_contracts}</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-red-600">Incident Reports</p>
                                <p className="text-2xl font-bold text-red-900">{searchResults.summary.total_incident_reports}</p>
                            </div>
                        </div>

                        {/* Daily Trips */}
                        {searchResults.daily_trips.length > 0 && (
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Daily Trips ({searchResults.daily_trips.length})</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">ID</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Month/Year</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Department</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Customer</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Destination</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Date From</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Date To</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Particular</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Total Allowance</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Drivers Networth</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Status 1</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Amount Billed</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">VAT 12%</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Total Amount</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Service Invoice</th>
                                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Status 2</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {searchResults.daily_trips.map((trip, index) => (
                                                <tr key={index}>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{trip.id}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{trip.month_year}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{trip.department}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{trip.customer_name}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{trip.destination}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(trip.date_from).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(trip.date_to).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-2 py-2 text-sm text-gray-900">{trip.particular}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">₱{trip.total_allowance}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">₱{trip.drivers_networth}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{trip.status_1}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">₱{trip.amount_billed}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">₱{trip.vat_12_percent}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">₱{trip.total_amount}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{trip.service_invoice}</td>
                                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{trip.status_2}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Drivers Maintenance */}
                        {/* Drivers Maintenance */}
                        {searchResults.drivers_maintenance.length > 0 && (
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Drivers Maintenance ({searchResults.drivers_maintenance.length})</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odometer</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next PMS</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parts</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {searchResults.drivers_maintenance.map((maintenance, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.driver_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.odometer_record}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(maintenance.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.performed}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{maintenance.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.qty}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{maintenance.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.next_pms}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.registration_month_date}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{maintenance.parts}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {maintenance.created_by?.name || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Main Maintenance */}
                        {searchResults.main_maintenance.length > 0 && (
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Main Maintenance ({searchResults.main_maintenance.length})</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region Assign</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Details</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odometer</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of PMS</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {searchResults.main_maintenance.map((maintenance, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.assignee_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.region_assign}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.supplier_name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{maintenance.vehicle_details}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.odometer_record}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{maintenance.remarks}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(maintenance.date_of_pms).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{maintenance.performed}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{maintenance.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.qty}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {maintenance.created_by?.name || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Contracts */}
                        {searchResults.contracts.length > 0 && (
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Contracts ({searchResults.contracts.length})</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Particular</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Assigned</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Area</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Range</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">12M VAT</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Less EWT</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suppliers Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drivers Salary</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Remarks</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {searchResults.contracts.map((contract, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{contract.particular}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.vehicle_type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.owners_name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{contract.company_assigned}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{contract.location_area}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.drivers_name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{contract.amount_range}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract['12m_vat']}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{contract.contract_amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{contract.less_ewt}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{contract.final_amount}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{contract.remarks}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{contract.suppliers_amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{contract.drivers_salary}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(contract.start_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{contract.end_remarks}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {contract.created_by?.name || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Incident Reports */}
                        {searchResults.incident_reports.length > 0 && (
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Incident Reports ({searchResults.incident_reports.length})</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Owner</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter Contact</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter Position</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Damage Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Cost</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Taken</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {searchResults.incident_reports.map((incident, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.vehicle_type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.vehicle_owner}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.incident_type}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{incident.incident_description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(incident.incident_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.incident_time}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{incident.location}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.reporter_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.reporter_contact}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.reporter_position}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{incident.damage_description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{incident.estimated_cost}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            incident.severity_level === 'High' 
                                                                ? 'bg-red-100 text-red-800' 
                                                                : incident.severity_level === 'Medium'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {incident.severity_level}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            incident.status === 'Resolved' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : incident.status === 'In Progress'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {incident.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{incident.action_taken}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{incident.notes}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {incident.creator?.name || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* No Results */}
                {searchResults === null && !searchLoading && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
                        </div>
                        <div className="p-6">
                            <div className="text-center text-gray-500 py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p>Select a vehicle and click search to view all related records</p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const renderPageContent = () => {
        switch (currentPage) {
            case 'vehicle':
                return <VehiclePage token={token} />;
            case 'daily-trips':
                return <DailyTrips />;
            case 'maintenance':
                return <Maintenance />;
            case 'contracts':
                return <Contracts />;
            case 'incident-report':
                return <IncidentReport />;
            case 'user-management':
                return <UserManagement token={token} />;
            default:
                return renderDashboardContent();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-gray-600 hover:text-gray-900"
                                title="Open Menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                className="ml-4 hover:opacity-80 transition-opacity duration-200"
                                title="Go to Dashboard"
                            >
                                <img
                                    className="h-12 w-auto"
                                    src="/logo.png"
                                    alt="John & Jess"
                                />
                            </button>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderPageContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
