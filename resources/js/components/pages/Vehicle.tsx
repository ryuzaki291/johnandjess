import React, { useState, useEffect } from 'react';

interface Vehicle {
    plate_number: string;
    vehicle_type: string | null;
    vehicle_owner: string | null;
    vehicle_owner_address: string | null;
    vehicle_brand: string | null;
    vehicle_status: string | null;
    add_date_in_company: string | null;
    creator: string | null;
    creation_date: string | null;
    created_at: string;
    updated_at: string;
}

interface VehicleFormData {
    plate_number: string;
    vehicle_type: string;
    vehicle_owner: string;
    vehicle_owner_address: string;
    vehicle_brand: string;
    vehicle_status: string;
    add_date_in_company: string;
    creation_date: string;
}

interface VehicleProps {
    token: string;
}

const Vehicle: React.FC<VehicleProps> = ({ token }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [formData, setFormData] = useState<VehicleFormData>({
        plate_number: '',
        vehicle_type: '',
        vehicle_owner: '',
        vehicle_owner_address: '',
        vehicle_brand: '',
        vehicle_status: 'active',
        add_date_in_company: '',
        creation_date: new Date().toISOString().split('T')[0]
    });
    const [formErrors, setFormErrors] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        console.log('Vehicle component mounted with token:', token);
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/vehicles', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();
            console.log('API Response:', data);
            
            if (data.success) {
                setVehicles(data.vehicles || []);
            } else {
                setError(data.message || 'Failed to fetch vehicles');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error fetching vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setModalMode('create');
        setSelectedVehicle(null);
        setFormData({
            plate_number: '',
            vehicle_type: '',
            vehicle_owner: '',
            vehicle_owner_address: '',
            vehicle_brand: '',
            vehicle_status: 'active',
            add_date_in_company: '',
            creation_date: new Date().toISOString().split('T')[0]
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEdit = (vehicle: Vehicle) => {
        setModalMode('edit');
        setSelectedVehicle(vehicle);
        setFormData({
            plate_number: vehicle.plate_number,
            vehicle_type: vehicle.vehicle_type || '',
            vehicle_owner: vehicle.vehicle_owner || '',
            vehicle_owner_address: vehicle.vehicle_owner_address || '',
            vehicle_brand: vehicle.vehicle_brand || '',
            vehicle_status: vehicle.vehicle_status || 'active',
            add_date_in_company: vehicle.add_date_in_company || '',
            creation_date: vehicle.creation_date || ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDelete = async (vehicle: Vehicle) => {
        if (!confirm(`Are you sure you want to delete vehicle ${vehicle.plate_number}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/vehicles/${encodeURIComponent(vehicle.plate_number)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();
            if (data.success) {
                setVehicles(vehicles.filter(v => v.plate_number !== vehicle.plate_number));
                setError(null);
                showSuccess(`Vehicle ${vehicle.plate_number} deleted successfully`);
            } else {
                setError(data.message || 'Failed to delete vehicle');
            }
        } catch (err) {
            setError('Error deleting vehicle');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});

        const url = modalMode === 'create' 
            ? '/api/vehicles' 
            : `/api/vehicles/${encodeURIComponent(selectedVehicle?.plate_number || '')}`;
        const method = modalMode === 'create' ? 'POST' : 'PUT';

        console.log('Submitting form data:', formData);

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('API response:', data);

            if (data.success) {
                if (modalMode === 'create') {
                    setVehicles([data.vehicle, ...vehicles]);
                    showSuccess(`Vehicle ${data.vehicle.plate_number} created successfully`);
                } else {
                    setVehicles(vehicles.map(v => 
                        v.plate_number === selectedVehicle?.plate_number ? data.vehicle : v
                    ));
                    showSuccess(`Vehicle ${data.vehicle.plate_number} updated successfully`);
                }
                setShowModal(false);
                setError(null);
            } else {
                if (data.errors) {
                    setFormErrors(data.errors);
                } else {
                    setError(data.message || 'Operation failed');
                }
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError('Error submitting form');
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let processedValue = value;
        
        // Convert plate number to uppercase
        if (name === 'plate_number') {
            processedValue = value.toUpperCase();
        }
        
        setFormData(prev => ({ ...prev, [name]: processedValue }));
        if (formErrors[name]) {
            setFormErrors((prev: any) => ({ ...prev, [name]: null }));
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid Date';
        }
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'retired': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getVehicleStats = () => {
        const totalVehicles = vehicles.length;
        const activeVehicles = vehicles.filter(v => v.vehicle_status?.toLowerCase() === 'active').length;
        const maintenanceVehicles = vehicles.filter(v => v.vehicle_status?.toLowerCase() === 'maintenance').length;
        const today = new Date().toDateString();
        const newToday = vehicles.filter(v => new Date(v.created_at).toDateString() === today).length;

        return { totalVehicles, activeVehicles, maintenanceVehicles, newToday };
    };

    const stats = getVehicleStats();

    if (loading) {
        return (
            <div className="p-4 sm:p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 sm:h-32 w-16 sm:w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading vehicles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vehicle Management</h1>
                <button 
                    onClick={handleCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto"
                >
                    Add Vehicle
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                            <span className="text-xl sm:text-2xl">🚐</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Total Vehicles</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-green-100">
                            <span className="text-xl sm:text-2xl">✅</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Active</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.activeVehicles}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
                            <span className="text-xl sm:text-2xl">🔧</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Maintenance</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.maintenanceVehicles}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                            <span className="text-xl sm:text-2xl">📅</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">New Today</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.newToday}</p>
                        </div>
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
                    {error}
                    <button 
                        onClick={fetchVehicles}
                        className="ml-4 text-sm underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.plate_number} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900">{vehicle.plate_number}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.vehicle_status)}`}>
                                    {vehicle.vehicle_status || 'Unknown'}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Type:</span> {vehicle.vehicle_type || 'N/A'}</p>
                                <p><span className="font-medium">Brand:</span> {vehicle.vehicle_brand || 'N/A'}</p>
                                <p><span className="font-medium">Owner:</span> {vehicle.vehicle_owner || 'N/A'}</p>
                                <p><span className="font-medium">Added:</span> {formatDate(vehicle.add_date_in_company)}</p>
                                <p><span className="font-medium">Creator:</span> {vehicle.creator || 'N/A'}</p>
                            </div>
                            <div className="flex space-x-2 pt-2">
                                <button 
                                    onClick={() => handleEdit(vehicle)}
                                    className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(vehicle)}
                                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {vehicles.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No vehicles found. Click "Add Vehicle" to create your first vehicle.
                    </div>
                )}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plate Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Brand
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Added
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Creator
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.plate_number}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {vehicle.plate_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vehicle.vehicle_type || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vehicle.vehicle_brand || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vehicle.vehicle_owner || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.vehicle_status)}`}>
                                            {vehicle.vehicle_status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(vehicle.add_date_in_company)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vehicle.creator || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => handleEdit(vehicle)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(vehicle)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {vehicles.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            No vehicles found. Click "Add Vehicle" to create your first vehicle.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                                {modalMode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Plate Number *</label>
                                        <input
                                            type="text"
                                            name="plate_number"
                                            value={formData.plate_number}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                            placeholder="e.g., ABC-123"
                                        />
                                        {formErrors.plate_number && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.plate_number[0]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                                        <input
                                            type="text"
                                            name="vehicle_type"
                                            value={formData.vehicle_type}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="e.g., Van, Truck, Car"
                                        />
                                        {formErrors.vehicle_type && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_type[0]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Vehicle Brand</label>
                                        <input
                                            type="text"
                                            name="vehicle_brand"
                                            value={formData.vehicle_brand}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="e.g., Toyota, Honda, Ford"
                                        />
                                        {formErrors.vehicle_brand && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_brand[0]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Vehicle Status</label>
                                        <select
                                            name="vehicle_status"
                                            value={formData.vehicle_status}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="retired">Retired</option>
                                        </select>
                                        {formErrors.vehicle_status && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_status[0]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Vehicle Owner</label>
                                        <input
                                            type="text"
                                            name="vehicle_owner"
                                            value={formData.vehicle_owner}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Owner name"
                                        />
                                        {formErrors.vehicle_owner && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_owner[0]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date Added to Company</label>
                                        <input
                                            type="date"
                                            name="add_date_in_company"
                                            value={formData.add_date_in_company}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {formErrors.add_date_in_company && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.add_date_in_company[0]}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vehicle Owner Address</label>
                                    <textarea
                                        name="vehicle_owner_address"
                                        value={formData.vehicle_owner_address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Owner address"
                                    />
                                    {formErrors.vehicle_owner_address && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_owner_address[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Creation Date</label>
                                    <input
                                        type="date"
                                        name="creation_date"
                                        value={formData.creation_date}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {formErrors.creation_date && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.creation_date[0]}</p>
                                    )}
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Vehicle' : 'Update Vehicle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehicle;
