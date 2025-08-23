import React, { useState, useEffect } from 'react';

interface Vehicle {
    plate_number: string;
    vehicle_type: string;
    vehicle_brand: string;
}

interface DriverMaintenanceRecord {
    id: number;
    driverName: string;
    plateNumber: string;
    odometerRecord: string;
    date: string;
    performed: string;
    amount: number;
    qty: number;
    description: string;
    nextPms: string;
    registrationMonthDate: string;
    parts: string;
    vehicle?: Vehicle;
}

const MaintenanceNew: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'drivers' | 'main'>('drivers');
    const [driversMaintenanceRecords, setDriversMaintenanceRecords] = useState<DriverMaintenanceRecord[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DriverMaintenanceRecord | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        driverName: '',
        plateNumber: '',
        odometerRecord: '',
        date: '',
        performed: '',
        amount: 0,
        qty: 0,
        description: '',
        nextPms: '',
        registrationMonthDate: '',
        parts: ''
    });

    useEffect(() => {
        fetchVehicles();
        fetchDriversMaintenanceRecords();
    }, []);

    // Function to get CSRF token
    const getCSRFToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        return token ? token.content : '';
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/drivers-maintenance-vehicles', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCSRFToken()
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setVehicles(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const fetchDriversMaintenanceRecords = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/drivers-maintenance', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCSRFToken()
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const convertedRecords = data.data.map((record: any) => ({
                        id: record.id,
                        driverName: record.driver_name,
                        plateNumber: record.plate_number,
                        odometerRecord: record.odometer_record,
                        date: record.date,
                        performed: record.performed,
                        amount: record.amount,
                        qty: record.qty,
                        description: record.description,
                        nextPms: record.next_pms,
                        registrationMonthDate: record.registration_month_date,
                        parts: record.parts,
                        vehicle: record.vehicle
                    }));
                    setDriversMaintenanceRecords(convertedRecords);
                }
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' || name === 'qty' ? parseFloat(value) || 0 : value
        }));
    };

    const openModal = () => {
        setFormData({
            driverName: '',
            plateNumber: '',
            odometerRecord: '',
            date: '',
            performed: '',
            amount: 0,
            qty: 0,
            description: '',
            nextPms: '',
            registrationMonthDate: '',
            parts: ''
        });
        setIsEditing(false);
        setEditingRecord(null);
        setIsModalOpen(true);
        setError(null);
        setSuccess(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const apiData = {
                driver_name: formData.driverName,
                plate_number: formData.plateNumber,
                odometer_record: formData.odometerRecord,
                date: formData.date,
                performed: formData.performed,
                amount: formData.amount,
                qty: formData.qty,
                description: formData.description,
                next_pms: formData.nextPms,
                registration_month_date: formData.registrationMonthDate,
                parts: formData.parts
            };

            const url = isEditing && editingRecord 
                ? `/api/drivers-maintenance/${editingRecord.id}`
                : '/api/drivers-maintenance';
            
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCSRFToken()
                },
                body: JSON.stringify(apiData)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const recordData: DriverMaintenanceRecord = {
                        id: result.data.id,
                        driverName: result.data.driver_name,
                        plateNumber: result.data.plate_number,
                        odometerRecord: result.data.odometer_record,
                        date: result.data.date,
                        performed: result.data.performed,
                        amount: result.data.amount,
                        qty: result.data.qty,
                        description: result.data.description,
                        nextPms: result.data.next_pms,
                        registrationMonthDate: result.data.registration_month_date,
                        parts: result.data.parts,
                        vehicle: result.data.vehicle
                    };

                    if (isEditing) {
                        setDriversMaintenanceRecords(prev => 
                            prev.map(record => record.id === editingRecord!.id ? recordData : record)
                        );
                        setSuccess('Driver maintenance record updated successfully!');
                    } else {
                        setDriversMaintenanceRecords(prev => [recordData, ...prev]);
                        setSuccess('Driver maintenance record created successfully!');
                    }
                    closeModal();
                }
            } else {
                throw new Error(`Failed to ${isEditing ? 'update' : 'create'} record`);
            }
        } catch (err) {
            console.error('Error saving record:', err);
            setError('An error occurred while saving the record.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (record: DriverMaintenanceRecord) => {
        setFormData({
            driverName: record.driverName,
            plateNumber: record.plateNumber,
            odometerRecord: record.odometerRecord,
            date: record.date,
            performed: record.performed,
            amount: record.amount,
            qty: record.qty,
            description: record.description,
            nextPms: record.nextPms,
            registrationMonthDate: record.registrationMonthDate,
            parts: record.parts
        });
        setIsEditing(true);
        setEditingRecord(record);
        setIsModalOpen(true);
        setError(null);
        setSuccess(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this driver maintenance record?')) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/drivers-maintenance/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCSRFToken()
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setDriversMaintenanceRecords(prev => prev.filter(record => record.id !== id));
                        setSuccess('Driver maintenance record deleted successfully!');
                    }
                } else {
                    throw new Error('Failed to delete record');
                }
            } catch (err) {
                console.error('Error deleting record:', err);
                setError('An error occurred while deleting the record.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Maintenance Management</h1>
                
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-4 text-green-700 bg-green-100 border border-green-300 rounded">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded">
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'drivers'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('drivers')}
                        >
                            Drivers Maintenance
                        </button>
                        <button
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'main'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('main')}
                        >
                            Main Maintenance
                        </button>
                    </nav>
                </div>

                {/* Drivers Maintenance Tab */}
                {activeTab === 'drivers' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Driver Maintenance Records</h2>
                            <button
                                onClick={openModal}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Add New Record
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="p-6 text-center">Loading...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {driversMaintenanceRecords.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {record.driverName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.plateNumber} - {record.vehicle?.vehicle_brand} {record.vehicle?.vehicle_type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.performed}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ₱{record.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(record)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(record.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {driversMaintenanceRecords.length === 0 && (
                                    <div className="p-6 text-center text-gray-500">
                                        No driver maintenance records found.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Maintenance Tab */}
                {activeTab === 'main' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Main Maintenance</h2>
                        <p className="text-gray-500">Main maintenance functionality coming soon...</p>
                    </div>
                )}

                {/* Modal for Add/Edit Driver Maintenance */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {isEditing ? 'Edit Driver Maintenance Record' : 'Add Driver Maintenance Record'}
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Driver Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="driverName"
                                                value={formData.driverName}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Vehicle *
                                            </label>
                                            <select
                                                name="plateNumber"
                                                value={formData.plateNumber}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            >
                                                <option value="">Select Vehicle</option>
                                                {vehicles.map((vehicle) => (
                                                    <option key={vehicle.plate_number} value={vehicle.plate_number}>
                                                        {vehicle.plate_number} - {vehicle.vehicle_brand} {vehicle.vehicle_type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Odometer Record
                                            </label>
                                            <input
                                                type="text"
                                                name="odometerRecord"
                                                value={formData.odometerRecord}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="text"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Performed
                                            </label>
                                            <input
                                                type="text"
                                                name="performed"
                                                value={formData.performed}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Amount
                                            </label>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                name="qty"
                                                value={formData.qty}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Next PMS
                                            </label>
                                            <input
                                                type="text"
                                                name="nextPms"
                                                value={formData.nextPms}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Registration Month/Date
                                            </label>
                                            <input
                                                type="text"
                                                name="registrationMonthDate"
                                                value={formData.registrationMonthDate}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Parts
                                            </label>
                                            <input
                                                type="text"
                                                name="parts"
                                                value={formData.parts}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenanceNew;
