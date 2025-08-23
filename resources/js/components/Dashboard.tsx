import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Vehicle from './pages/Vehicle';
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

const Dashboard: React.FC<DashboardProps> = ({ user, token, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [apiData, setApiData] = useState<ApiResponse | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, [token]);

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

    const renderPageContent = () => {
        switch (currentPage) {
            case 'vehicle':
                return <Vehicle />;
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
                return (
                    <div className="p-6">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {user.name}!
                            </h1>
                            <p className="text-gray-600">John & Jess Transport Management System</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <span className="text-2xl">🚗</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
                                        <p className="text-2xl font-bold text-gray-900">12</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100">
                                        <span className="text-2xl">🗺️</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Active Trips</p>
                                        <p className="text-2xl font-bold text-gray-900">8</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-yellow-100">
                                        <span className="text-2xl">⚠️</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Pending Incidents</p>
                                        <p className="text-2xl font-bold text-gray-900">2</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Info Card */}
                        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Name</p>
                                        <p className="text-lg text-gray-900">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-lg text-gray-900">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Member since</p>
                                        <p className="text-lg text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Account ID</p>
                                        <p className="text-lg text-gray-900">#{user.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* API Status Card */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
                                {apiData && (
                                    <div className="text-green-600 bg-green-50 p-4 rounded-lg">
                                        <p className="font-semibold">✅ {apiData.message}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Database: {apiData.database} | Time: {new Date(apiData.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
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
            <div className="flex-1">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex justify-between items-center px-4 py-4">
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
                <main className="flex-1 overflow-y-auto">
                    {renderPageContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
