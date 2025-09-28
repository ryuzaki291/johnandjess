import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
                            Hello back, {user.name}!
                        </h1>
                        <p className="text-gray-600">John & Jess Car Rental Service Corp.</p>
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
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Vehicle Search & Analytics</h1>
                            <p className="text-gray-600 mt-2">Comprehensive vehicle record lookup and analysis</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>Advanced Search</span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Search Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Vehicle Lookup</h2>
                            <p className="text-gray-600">Search by plate number to access complete vehicle records</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select from Fleet Registry
                            </label>
                            <div className="relative">
                                <select 
                                    value={selectedPlateNumber}
                                    onChange={(e) => setSelectedPlateNumber(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                                >
                                    <option value="">Choose a registered vehicle...</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.plate_number} value={vehicle.plate_number}>
                                            {vehicle.plate_number} • {vehicle.vehicle_type} • {vehicle.vehicle_brand}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Direct Plate Number Entry
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={selectedPlateNumber}
                                    onChange={(e) => setSelectedPlateNumber(e.target.value.toUpperCase())}
                                    placeholder="e.g., ABC-1234"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm font-mono"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {searchError && (
                        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                                    <p className="text-sm text-red-700 mt-1">{searchError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            {vehicles.length > 0 && (
                                <span>{vehicles.length} vehicles in registry</span>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                onClick={handleClearSearch}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                            >
                                Clear Search
                            </button>
                            <button 
                                onClick={handleSearch}
                                disabled={searchLoading || !selectedPlateNumber}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                            >
                                {searchLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>Search Records</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                {searchResults && (
                    <div className="space-y-8">
                        {/* Vehicle Information Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l5.5-2 5.5 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">Vehicle Profile</h3>
                                            <p className="text-blue-100 text-sm">Complete vehicle information</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{searchResults.vehicle.plate_number}</div>
                                        <div className="text-blue-100 text-sm">License Plate</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Vehicle Type</p>
                                        <p className="text-lg font-semibold text-gray-900">{searchResults.vehicle.vehicle_type}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Brand & Model</p>
                                        <p className="text-lg font-semibold text-gray-900">{searchResults.vehicle.vehicle_brand}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Owner</p>
                                        <p className="text-lg font-semibold text-gray-900">{searchResults.vehicle.vehicle_owner}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Company Name</p>
                                        <p className="text-lg font-semibold text-gray-900">{searchResults.vehicle.company_name || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                            searchResults.vehicle.vehicle_status === 'active' 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : searchResults.vehicle.vehicle_status === 'maintenance'
                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                : 'bg-red-100 text-red-800 border border-red-200'
                                        }`}>
                                            {searchResults.vehicle.vehicle_status?.charAt(0).toUpperCase() + searchResults.vehicle.vehicle_status?.slice(1)}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Date Added</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {new Date(searchResults.vehicle.add_date_in_company).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Owner Address</p>
                                        <p className="text-sm text-gray-700">{searchResults.vehicle.vehicle_owner_address || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Created By</p>
                                        <p className="text-lg font-semibold text-gray-900">{searchResults.vehicle.creator || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Creation Date</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {searchResults.vehicle.creation_date ? new Date(searchResults.vehicle.creation_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analytics Overview Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Daily Trips</p>
                                        <p className="text-3xl font-bold">{searchResults.summary.total_daily_trips}</p>
                                    </div>
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Driver Maintenance</p>
                                        <p className="text-3xl font-bold">{searchResults.summary.total_drivers_maintenance}</p>
                                    </div>
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-100 text-sm font-medium">Main Maintenance</p>
                                        <p className="text-3xl font-bold">{searchResults.summary.total_main_maintenance}</p>
                                    </div>
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">Contracts</p>
                                        <p className="text-3xl font-bold">{searchResults.summary.total_contracts}</p>
                                    </div>
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-red-100 text-sm font-medium">Incident Reports</p>
                                        <p className="text-3xl font-bold">{searchResults.summary.total_incident_reports}</p>
                                    </div>
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Daily Trips */}
                        {searchResults.daily_trips.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Trip Records</h3>
                                                <p className="text-sm text-gray-600">Complete trip history and billing information</p>
                                            </div>
                                        </div>
                                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            {searchResults.daily_trips.length} Records
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <div className="min-w-full" style={{ minWidth: '1800px' }}>
                                        <div className="bg-gray-50 flex text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                            <div className="px-3 py-3 w-20">Period</div>
                                            <div className="px-3 py-3 w-20">Dept</div>
                                            <div className="px-3 py-3 w-28">Vehicle Unit</div>
                                            <div className="px-3 py-3 w-32">Customer</div>
                                            <div className="px-3 py-3 w-40">Destination</div>
                                            <div className="px-3 py-3 w-24">From</div>
                                            <div className="px-3 py-3 w-24">To</div>
                                            <div className="px-3 py-3 w-48">Particular</div>
                                            <div className="px-3 py-3 w-28">Allowance</div>
                                            <div className="px-3 py-3 w-28">Driver Pay</div>
                                            <div className="px-3 py-3 w-20">Status</div>
                                            <div className="px-3 py-3 w-28">Billed</div>
                                            <div className="px-3 py-3 w-20">VAT</div>
                                            <div className="px-3 py-3 w-28">Total</div>
                                            <div className="px-3 py-3 w-24">Invoice</div>
                                            <div className="px-3 py-3 w-24">Payment</div>
                                        </div>
                                        <div className="bg-white divide-y divide-gray-100">
                                            {searchResults.daily_trips.map((trip, index) => (
                                                <div key={index} className="flex text-sm hover:bg-gray-50 transition-colors">
                                                    <div className="px-3 py-4 w-20 font-medium text-gray-900">{trip.month_year}</div>
                                                    <div className="px-3 py-4 w-20 text-gray-600">{trip.department}</div>
                                                    <div className="px-3 py-4 w-28 text-gray-600">{trip.vehicle_unit || 'N/A'}</div>
                                                    <div className="px-3 py-4 w-32 font-medium text-gray-900 truncate" title={trip.customer_name}>{trip.customer_name}</div>
                                                    <div className="px-3 py-4 w-40 text-gray-700 truncate" title={trip.destination}>{trip.destination}</div>
                                                    <div className="px-3 py-4 w-24 text-gray-600">
                                                        {new Date(trip.date_from).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                                    </div>
                                                    <div className="px-3 py-4 w-24 text-gray-600">
                                                        {new Date(trip.date_to).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                                    </div>
                                                    <div className="px-3 py-4 w-48 text-gray-700 truncate" title={trip.particular}>{trip.particular || 'N/A'}</div>
                                                    <div className="px-3 py-4 w-28 font-semibold text-green-700">₱{trip.total_allowance?.toLocaleString()}</div>
                                                    <div className="px-3 py-4 w-28 font-semibold text-blue-700">₱{trip.drivers_networth?.toLocaleString()}</div>
                                                    <div className="px-3 py-4 w-20">
                                                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                            {trip.status_1}
                                                        </span>
                                                    </div>
                                                    <div className="px-3 py-4 w-28 font-semibold text-gray-900">₱{trip.amount_billed?.toLocaleString()}</div>
                                                    <div className="px-3 py-4 w-20 text-orange-600">₱{trip.vat_12_percent?.toLocaleString()}</div>
                                                    <div className="px-3 py-4 w-28 font-bold text-gray-900">₱{trip.total_amount?.toLocaleString()}</div>
                                                    <div className="px-3 py-4 w-24 font-mono text-gray-600 text-xs">{trip.service_invoice}</div>
                                                    <div className="px-3 py-4 w-24">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                            trip.status_2 === 'Paid' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {trip.status_2}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Total trips recorded: {searchResults.daily_trips.length}</span>
                                        <span>
                                            Total revenue: ₱{searchResults.daily_trips.reduce((sum, trip) => sum + (trip.total_amount || 0), 0).toLocaleString()}
                                        </span>
                                    </div>
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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
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
                                                        {maintenance.documents && maintenance.documents.length > 0 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                {maintenance.documents.length}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">No docs</span>
                                                        )}
                                                    </td>
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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
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
                                                        {maintenance.documents && maintenance.documents.length > 0 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                {maintenance.documents.length}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">No docs</span>
                                                        )}
                                                    </td>
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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Remarks</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
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
                                                        {contract.revenue ? (
                                                            <span className="font-semibold text-green-700">₱{contract.revenue}</span>
                                                        ) : (
                                                            <span className="text-gray-400">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(contract.start_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{contract.end_remarks}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {contract.documents && contract.documents.length > 0 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                {contract.documents.length}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">No docs</span>
                                                        )}
                                                    </td>
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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
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
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {incident.incident_images && incident.incident_images.length > 0 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                {incident.incident_images.length}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">No images</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {incident.incident_documents && incident.incident_documents.length > 0 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                {incident.incident_documents.length}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">No docs</span>
                                                        )}
                                                    </td>
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

                {/* No Results State */}
                {searchResults === null && !searchLoading && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
                        </div>
                        <div className="p-12">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Search</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Select a vehicle from the dropdown or enter a plate number to view comprehensive records including trips, maintenance history, contracts, and incident reports.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="font-medium text-blue-900">Trip Records</div>
                                        <div className="text-blue-700">Complete journey history</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="font-medium text-green-900">Maintenance Data</div>
                                        <div className="text-green-700">Service & repair logs</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="font-medium text-purple-900">Business Analytics</div>
                                        <div className="text-purple-700">Contracts & incidents</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const renderPageContent = () => {
        return (
            <Routes>
                <Route path="/dashboard" element={renderDashboardContent()} />
                <Route path="/vehicle" element={<VehiclePage token={token} />} />
                <Route path="/daily-trips" element={<DailyTrips />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/incident-report" element={<IncidentReport />} />
                <Route path="/user-management" element={<UserManagement token={token} />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
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
                                onClick={() => navigate('/dashboard')}
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
