import React, { useState, useEffect } from 'react';
import { DailyTrip, DailyTripFormData, Vehicle } from '../../types/DailyTrip';
import DailyTripModal from '../modals/DailyTripModal';

const DailyTrips: React.FC = () => {
    const [trips, setTrips] = useState<DailyTrip[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState<DailyTrip | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }
        setIsAuthenticated(true);
        fetchTrips();
        fetchVehicles();
    }, []);

    const fetchTrips = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            const response = await fetch('/api/daily-trips', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTrips(data.data);
            } else if (response.status === 401) {
                console.error('Authentication failed');
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            } else {
                console.error('Failed to fetch trips');
            }
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            console.log('Fetching vehicles with token: Token exists');
            
            const response = await fetch('/api/vehicles', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Vehicles API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Raw vehicles data received:', data);
                
                const vehiclesData = Array.isArray(data) ? data : (data.data || []);
                console.log('Extracted vehicles array:', vehiclesData);
                
                const formattedVehicles = vehiclesData.map((vehicle: any) => ({
                    plate_number: vehicle.plate_number,
                    vehicle_owner: vehicle.vehicle_owner,
                    vehicle_brand: vehicle.vehicle_brand
                }));
                
                console.log('Final formatted vehicles:', formattedVehicles);
                setVehicles(formattedVehicles);
            } else if (response.status === 401) {
                console.error('Authentication failed while fetching vehicles');
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            } else {
                const errorData = await response.text();
                console.error('Failed to fetch vehicles. Status:', response.status, 'Error:', errorData);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const handleLogin = () => {
        // Redirect to login page
        window.location.href = '/login';
    };

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Daily Trips Management</h1>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Authentication Required</h2>
                        <p className="text-yellow-700 mb-4">
                            You need to be logged in to access the Daily Trips management system.
                        </p>
                        <button
                            onClick={handleLogin}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleCreateTrip = async (tripData: DailyTripFormData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                alert('Authentication required. Please log in again.');
                setIsAuthenticated(false);
                return;
            }

            console.log('Creating trip with data:', tripData);
            console.log('Using token:', token ? 'Token exists' : 'No token');
            
            const response = await fetch('/api/daily-trips', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripData),
            });

            console.log('Create trip response status:', response.status);
            const responseData = await response.json();
            console.log('Create trip response data:', responseData);

            if (response.ok) {
                setTrips([...trips, responseData.data]);
                setIsModalOpen(false);
                alert('Trip created successfully!');
            } else if (response.status === 401) {
                console.error('Authentication failed during trip creation');
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                alert('Authentication expired. Please log in again.');
            } else if (response.status === 422) {
                console.error('Validation errors:', responseData.errors);
                alert('Validation errors: ' + JSON.stringify(responseData.errors));
            } else {
                console.error('Failed to create trip:', responseData);
                alert('Failed to create trip: ' + (responseData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            alert('Error creating trip: ' + error.message);
        }
    };

    const handleUpdateTrip = async (id: number, tripData: DailyTripFormData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                alert('Authentication required. Please log in again.');
                setIsAuthenticated(false);
                return;
            }

            const response = await fetch(`/api/daily-trips/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripData),
            });

            if (response.ok) {
                const responseData = await response.json();
                setTrips(trips.map(trip => trip.id === id ? responseData.data : trip));
                setIsModalOpen(false);
                setEditingTrip(null);
                alert('Trip updated successfully!');
            } else if (response.status === 401) {
                console.error('Authentication failed during trip update');
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                alert('Authentication expired. Please log in again.');
            } else {
                const errorData = await response.json();
                console.error('Failed to update trip:', errorData);
                alert('Failed to update trip: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating trip:', error);
            alert('Error updating trip: ' + error.message);
        }
    };

    const handleDeleteTrip = async (id: number) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                alert('Authentication required. Please log in again.');
                setIsAuthenticated(false);
                return;
            }

            const response = await fetch(`/api/daily-trips/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setTrips(trips.filter(trip => trip.id !== id));
                alert('Trip deleted successfully!');
            } else if (response.status === 401) {
                console.error('Authentication failed during trip deletion');
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                alert('Authentication expired. Please log in again.');
            } else {
                console.error('Failed to delete trip');
                alert('Failed to delete trip');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Error deleting trip: ' + error.message);
        }
    };

    const filteredTrips = trips.filter(trip =>
        trip.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.vehicle?.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading daily trips...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Daily Trips Management</h1>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search trips by customer, vehicle, or destination..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
                    >
                        <span>+</span>
                        Add New Trip
                    </button>
                </div>
            </div>

            {/* Trips Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toll Fee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTrips.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        {searchTerm ? 'No trips found matching your search.' : 'No trips found. Add your first trip!'}
                                    </td>
                                </tr>
                            ) : (
                                filteredTrips.map((trip) => (
                                    <tr key={trip.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trip.month_year}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trip.customer_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trip.vehicle?.plate_number || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trip.destination}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₱{trip.toll_fee}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₱{trip.fuel_cost}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingTrip(trip);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTrip(trip.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <DailyTripModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTrip(null);
                }}
                onSubmit={editingTrip ? 
                    (data) => handleUpdateTrip(editingTrip.id, data) : 
                    handleCreateTrip
                }
                trip={editingTrip}
                vehicles={vehicles}
            />
        </div>
    );
};

export default DailyTrips;
