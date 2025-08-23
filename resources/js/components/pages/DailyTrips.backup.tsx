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
            console.log('Fetching vehicles with token:', token ? 'Token exists' : 'No token');
            
            // Use the regular vehicles endpoint
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
                
                // The vehicles endpoint returns the vehicles directly in data property
                const vehiclesData = Array.isArray(data) ? data : (data.data || []);
                console.log('Extracted vehicles array:', vehiclesData);
                
                // Format the vehicles data to ensure it has the right structure
                const formattedVehicles = vehiclesData.map((vehicle: any) => ({
                    plate_number: vehicle.plate_number,
                    vehicle_owner: vehicle.vehicle_owner,
                    vehicle_brand: vehicle.vehicle_brand
                }));
                
                console.log('Final formatted vehicles:', formattedVehicles);
                setVehicles(formattedVehicles);
            } else {
                const errorData = await response.text();
                console.error('Failed to fetch vehicles. Status:', response.status, 'Error:', errorData);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const handleCreateTrip = async (formData: DailyTripFormData) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Creating trip with data:', formData);
            
            const response = await fetch('/api/daily-trips', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Create trip response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Trip created successfully:', data);
                setTrips(prev => [data.data, ...prev]);
                setIsModalOpen(false);
                alert('Daily trip created successfully!');
            } else {
                const errorText = await response.text();
                console.error('Failed to create trip. Status:', response.status, 'Response:', errorText);
                
                // Try to parse as JSON first
                try {
                    const errorData = JSON.parse(errorText);
                    console.error('Parsed error data:', errorData);
                    alert(`Failed to create trip: ${errorData.message || 'Unknown error'}`);
                } catch (parseError) {
                    console.error('Could not parse error response as JSON');
                    alert('Failed to create trip. Please check the form and try again.');
                }
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            alert('An error occurred while creating the trip.');
        }
    };

    const handleUpdateTrip = async (formData: DailyTripFormData) => {
        if (!editingTrip) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/daily-trips/${editingTrip.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setTrips(prev => prev.map(trip => 
                    trip.id === editingTrip.id ? data.data : trip
                ));
                setIsModalOpen(false);
                setEditingTrip(null);
                alert('Daily trip updated successfully!');
            } else {
                const errorData = await response.json();
                console.error('Failed to update trip:', errorData);
                alert('Failed to update trip. Please check the form and try again.');
            }
        } catch (error) {
            console.error('Error updating trip:', error);
            alert('An error occurred while updating the trip.');
        }
    };

    const handleDeleteTrip = async (tripId: number) => {
        if (!confirm('Are you sure you want to delete this daily trip?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/daily-trips/${tripId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setTrips(prev => prev.filter(trip => trip.id !== tripId));
                alert('Daily trip deleted successfully!');
            } else {
                console.error('Failed to delete trip');
                alert('Failed to delete trip.');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('An error occurred while deleting the trip.');
        }
    };

    const handleEditTrip = (trip: DailyTrip) => {
        setEditingTrip(trip);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (formData: DailyTripFormData) => {
        if (editingTrip) {
            handleUpdateTrip(formData);
        } else {
            handleCreateTrip(formData);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTrip(null);
    };

    const filteredTrips = trips.filter(trip => 
        trip.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.vehicle?.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.vehicle?.vehicle_owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.status_1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.status_2?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount: number | undefined) => {
        if (!amount) return '';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        
        switch (status.toLowerCase()) {
            case 'completed':
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'in progress':
            case 'active':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
            case 'under review':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Daily Trips</h1>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                        type="text"
                        placeholder="Search trips..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto"
                    >
                        Add Trip
                    </button>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
                {filteredTrips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-lg shadow p-4 border">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {trip.vehicle?.plate_number || 'No Vehicle'}
                                </h3>
                                <p className="text-sm text-gray-600">{trip.customer_name}</p>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handleEditTrip(trip)}
                                    className="text-blue-600 hover:text-blue-800 p-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteTrip(trip.id)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-gray-500">Vehicle Owner: </span>
                                <span className="text-gray-900">{trip.vehicle?.vehicle_owner || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">Destination: </span>
                                <span className="text-gray-900">{trip.destination || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">Total Amount: </span>
                                <span className="text-gray-900">{formatCurrency(trip.total_amount)}</span>
                            </div>
                            <div className="flex space-x-2 mt-2">
                                {trip.status_1 && (
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip.status_1)}`}>
                                        {trip.status_1}
                                    </span>
                                )}
                                {trip.status_2 && (
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip.status_2)}`}>
                                        {trip.status_2}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer & Destination
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dates
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Financial
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTrips.map((trip) => (
                                <tr key={trip.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {trip.vehicle?.plate_number || 'No Vehicle'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {trip.vehicle?.vehicle_owner}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {trip.vehicle?.vehicle_brand}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {trip.customer_name || 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {trip.destination || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>From: {trip.date_from || 'N/A'}</div>
                                        <div>To: {trip.date_to || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>Billed: {formatCurrency(trip.amount_billed)}</div>
                                        <div>VAT: {formatCurrency(trip.vat_12_percent)}</div>
                                        <div className="font-medium">Total: {formatCurrency(trip.total_amount)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            {trip.status_1 && (
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip.status_1)}`}>
                                                    {trip.status_1}
                                                </span>
                                            )}
                                            {trip.status_2 && (
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip.status_2)}`}>
                                                    {trip.status_2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditTrip(trip)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTrip(trip.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredTrips.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No daily trips found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new daily trip.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Trip
                        </button>
                    </div>
                </div>
            )}

            <DailyTripModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                editingTrip={editingTrip}
                vehicles={vehicles}
            />
        </div>
    );
};

export default DailyTrips;
