import React, { useState, useEffect } from 'react';

interface Vehicle {
    plate_number: string;
    vehicle_type: string;
    vehicle_brand: string;
}

interface MainMaintenanceRecord {
    id: number;
    assigneeName: string;
    regionAssign: string;
    supplierName: string;
    vehicleDetails: string;
    plateNumber: string;
    odometerRecord: string;
    remarks: string;
    dateOfPms: string;
    performed: string;
    amount: number;
    qty: number;
    vehicle?: Vehicle;
}

const MainMaintenanceTab: React.FC = () => {
    const [mainMaintenanceRecords, setMainMaintenanceRecords] = useState<MainMaintenanceRecord[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState<MainMaintenanceRecord | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        assigneeName: '',
        regionAssign: '',
        supplierName: '',
        vehicleDetails: '',
        plateNumber: '',
        odometerRecord: '',
        remarks: '',
        dateOfPms: '',
        performed: '',
        amount: 0,
        qty: 0
    });

    useEffect(() => {
        fetchVehicles();
        fetchMainMaintenanceRecords();
    }, []);

    // Function to get CSRF token
    const getCSRFToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        return token ? token.content : '';
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/main-maintenance-vehicles', {
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

    const fetchMainMaintenanceRecords = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/main-maintenance', {
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
                        assigneeName: record.assignee_name,
                        regionAssign: record.region_assign,
                        supplierName: record.supplier_name,
                        vehicleDetails: record.vehicle_details,
                        plateNumber: record.plate_number,
                        odometerRecord: record.odometer_record,
                        remarks: record.remarks || '',
                        dateOfPms: record.date_of_pms,
                        performed: record.performed,
                        amount: record.amount,
                        qty: record.qty,
                        vehicle: record.vehicle
                    }));
                    setMainMaintenanceRecords(convertedRecords);
                }
            }
        } catch (error) {
            console.error('Error fetching main maintenance records:', error);
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
            assigneeName: '',
            regionAssign: '',
            supplierName: '',
            vehicleDetails: '',
            plateNumber: '',
            odometerRecord: '',
            remarks: '',
            dateOfPms: '',
            performed: '',
            amount: 0,
            qty: 0
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
                assignee_name: formData.assigneeName,
                region_assign: formData.regionAssign,
                supplier_name: formData.supplierName,
                vehicle_details: formData.vehicleDetails,
                plate_number: formData.plateNumber,
                odometer_record: formData.odometerRecord,
                remarks: formData.remarks,
                date_of_pms: formData.dateOfPms,
                performed: formData.performed,
                amount: formData.amount,
                qty: formData.qty
            };

            const url = isEditing && editingRecord 
                ? `/api/main-maintenance/${editingRecord.id}`
                : '/api/main-maintenance';
            
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
                    const recordData: MainMaintenanceRecord = {
                        id: result.data.id,
                        assigneeName: result.data.assignee_name,
                        regionAssign: result.data.region_assign,
                        supplierName: result.data.supplier_name,
                        vehicleDetails: result.data.vehicle_details,
                        plateNumber: result.data.plate_number,
                        odometerRecord: result.data.odometer_record,
                        remarks: result.data.remarks || '',
                        dateOfPms: result.data.date_of_pms,
                        performed: result.data.performed,
                        amount: result.data.amount,
                        qty: result.data.qty,
                        vehicle: result.data.vehicle
                    };

                    if (isEditing) {
                        setMainMaintenanceRecords(prev => 
                            prev.map(record => record.id === editingRecord!.id ? recordData : record)
                        );
                        setSuccess('Main maintenance record updated successfully!');
                    } else {
                        setMainMaintenanceRecords(prev => [recordData, ...prev]);
                        setSuccess('Main maintenance record created successfully!');
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

    const handleEdit = (record: MainMaintenanceRecord) => {
        setFormData({
            assigneeName: record.assigneeName,
            regionAssign: record.regionAssign,
            supplierName: record.supplierName,
            vehicleDetails: record.vehicleDetails,
            plateNumber: record.plateNumber,
            odometerRecord: record.odometerRecord,
            remarks: record.remarks,
            dateOfPms: record.dateOfPms,
            performed: record.performed,
            amount: record.amount,
            qty: record.qty
        });
        setIsEditing(true);
        setEditingRecord(record);
        setIsModalOpen(true);
        setError(null);
        setSuccess(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this main maintenance record?')) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/main-maintenance/${id}`, {
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
                        setMainMaintenanceRecords(prev => prev.filter(record => record.id !== id));
                        setSuccess('Main maintenance record deleted successfully!');
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
        <div>
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

            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Main Maintenance Records</h2>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date PMS</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mainMaintenanceRecords.map((record) => (
                                    <tr key={record.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.assigneeName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.regionAssign}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.plateNumber} - {record.vehicle?.vehicle_brand} {record.vehicle?.vehicle_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.dateOfPms}
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
                        {mainMaintenanceRecords.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                No main maintenance records found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit Main Maintenance */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {isEditing ? 'Edit Main Maintenance Record' : 'Add Main Maintenance Record'}
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
                                            Assignee Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="assigneeName"
                                            value={formData.assigneeName}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Region Assign *
                                        </label>
                                        <input
                                            type="text"
                                            name="regionAssign"
                                            value={formData.regionAssign}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Supplier Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="supplierName"
                                            value={formData.supplierName}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Vehicle Details *
                                        </label>
                                        <input
                                            type="text"
                                            name="vehicleDetails"
                                            value={formData.vehicleDetails}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Plate Number *
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
                                            Odometer Record *
                                        </label>
                                        <input
                                            type="text"
                                            name="odometerRecord"
                                            value={formData.odometerRecord}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date of PMS *
                                        </label>
                                        <input
                                            type="text"
                                            name="dateOfPms"
                                            value={formData.dateOfPms}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Performed *
                                        </label>
                                        <input
                                            type="text"
                                            name="performed"
                                            value={formData.performed}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Amount *
                                        </label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            name="qty"
                                            value={formData.qty}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Remarks
                                    </label>
                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
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
    );
};

export default MainMaintenanceTab;
