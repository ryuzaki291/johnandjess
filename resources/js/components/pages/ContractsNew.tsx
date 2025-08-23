import React, { useState, useEffect } from 'react';

interface Vehicle {
    plate_number: string;
    vehicle_type: string;
    vehicle_brand: string;
    vehicle_owner: string;
}

interface ContractRecord {
    id: number;
    particular: string;
    vehicleType: string;
    plateNumber: string;
    ownersName: string;
    companyAssigned: string;
    locationArea: string;
    driversName: string;
    amountRange: string;
    twelveMonthVat: string;
    contractAmount: number;
    lessEwt: number;
    finalAmount: number;
    remarks: string;
    suppliersAmount: number;
    driversSalary: number;
    startDate: string;
    endRemarks: string;
    vehicle?: Vehicle;
}

const ContractsNew: React.FC = () => {
    const [contractRecords, setContractRecords] = useState<ContractRecord[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ContractRecord | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        particular: '',
        vehicleType: '',
        plateNumber: '',
        ownersName: '',
        companyAssigned: '',
        locationArea: '',
        driversName: '',
        amountRange: '',
        twelveMonthVat: '',
        contractAmount: 0,
        lessEwt: 0,
        finalAmount: 0,
        remarks: '',
        suppliersAmount: 0,
        driversSalary: 0,
        startDate: '',
        endRemarks: ''
    });

    useEffect(() => {
        fetchVehicles();
        fetchContractRecords();
    }, []);

    // Function to get CSRF token
    const getCSRFToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        return token ? token.content : '';
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/contracts-vehicles', {
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

    const fetchContractRecords = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/contracts', {
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
                        particular: record.particular,
                        vehicleType: record.vehicle_type,
                        plateNumber: record.plate_number,
                        ownersName: record.owners_name,
                        companyAssigned: record.company_assigned,
                        locationArea: record.location_area,
                        driversName: record.drivers_name,
                        amountRange: record.amount_range || '',
                        twelveMonthVat: record['12m_vat'] || '',
                        contractAmount: record.contract_amount,
                        lessEwt: record.less_ewt || 0,
                        finalAmount: record.final_amount,
                        remarks: record.remarks || '',
                        suppliersAmount: record.suppliers_amount || 0,
                        driversSalary: record.drivers_salary || 0,
                        startDate: record.start_date || '',
                        endRemarks: record.end_remarks || '',
                        vehicle: record.vehicle
                    }));
                    setContractRecords(convertedRecords);
                }
            }
        } catch (error) {
            console.error('Error fetching contract records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Auto-populate vehicle info when plate number is selected
        if (name === 'plateNumber') {
            const selectedVehicle = vehicles.find(v => v.plate_number === value);
            if (selectedVehicle) {
                setFormData(prev => ({
                    ...prev,
                    plateNumber: value,
                    vehicleType: selectedVehicle.vehicle_type,
                    ownersName: selectedVehicle.vehicle_owner
                }));
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: ['contractAmount', 'lessEwt', 'finalAmount', 'suppliersAmount', 'driversSalary'].includes(name) 
                ? parseFloat(value) || 0 
                : value
        }));
    };

    const openModal = () => {
        setFormData({
            particular: '',
            vehicleType: '',
            plateNumber: '',
            ownersName: '',
            companyAssigned: '',
            locationArea: '',
            driversName: '',
            amountRange: '',
            twelveMonthVat: '',
            contractAmount: 0,
            lessEwt: 0,
            finalAmount: 0,
            remarks: '',
            suppliersAmount: 0,
            driversSalary: 0,
            startDate: '',
            endRemarks: ''
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
                particular: formData.particular,
                vehicle_type: formData.vehicleType,
                plate_number: formData.plateNumber,
                owners_name: formData.ownersName,
                company_assigned: formData.companyAssigned,
                location_area: formData.locationArea,
                drivers_name: formData.driversName,
                amount_range: formData.amountRange,
                '12m_vat': formData.twelveMonthVat,
                contract_amount: formData.contractAmount,
                less_ewt: formData.lessEwt,
                final_amount: formData.finalAmount,
                remarks: formData.remarks,
                suppliers_amount: formData.suppliersAmount,
                drivers_salary: formData.driversSalary,
                start_date: formData.startDate,
                end_remarks: formData.endRemarks
            };

            const url = isEditing && editingRecord 
                ? `/api/contracts/${editingRecord.id}`
                : '/api/contracts';
            
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
                    const recordData: ContractRecord = {
                        id: result.data.id,
                        particular: result.data.particular,
                        vehicleType: result.data.vehicle_type,
                        plateNumber: result.data.plate_number,
                        ownersName: result.data.owners_name,
                        companyAssigned: result.data.company_assigned,
                        locationArea: result.data.location_area,
                        driversName: result.data.drivers_name,
                        amountRange: result.data.amount_range || '',
                        twelveMonthVat: result.data['12m_vat'] || '',
                        contractAmount: result.data.contract_amount,
                        lessEwt: result.data.less_ewt || 0,
                        finalAmount: result.data.final_amount,
                        remarks: result.data.remarks || '',
                        suppliersAmount: result.data.suppliers_amount || 0,
                        driversSalary: result.data.drivers_salary || 0,
                        startDate: result.data.start_date || '',
                        endRemarks: result.data.end_remarks || '',
                        vehicle: result.data.vehicle
                    };

                    if (isEditing) {
                        setContractRecords(prev => 
                            prev.map(record => record.id === editingRecord!.id ? recordData : record)
                        );
                        setSuccess('Contract record updated successfully!');
                    } else {
                        setContractRecords(prev => [recordData, ...prev]);
                        setSuccess('Contract record created successfully!');
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

    const handleEdit = (record: ContractRecord) => {
        setFormData({
            particular: record.particular,
            vehicleType: record.vehicleType,
            plateNumber: record.plateNumber,
            ownersName: record.ownersName,
            companyAssigned: record.companyAssigned,
            locationArea: record.locationArea,
            driversName: record.driversName,
            amountRange: record.amountRange,
            twelveMonthVat: record.twelveMonthVat,
            contractAmount: record.contractAmount,
            lessEwt: record.lessEwt,
            finalAmount: record.finalAmount,
            remarks: record.remarks,
            suppliersAmount: record.suppliersAmount,
            driversSalary: record.driversSalary,
            startDate: record.startDate,
            endRemarks: record.endRemarks
        });
        setIsEditing(true);
        setEditingRecord(record);
        setIsModalOpen(true);
        setError(null);
        setSuccess(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this contract record?')) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/contracts/${id}`, {
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
                        setContractRecords(prev => prev.filter(record => record.id !== id));
                        setSuccess('Contract record deleted successfully!');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Contract Management</h1>
                
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
                        <h2 className="text-lg font-medium text-gray-900">Contract Records</h2>
                        <button
                            onClick={openModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Add New Contract
                        </button>
                    </div>
                    
                    {isLoading ? (
                        <div className="p-6 text-center">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Particular</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {contractRecords.map((record) => (
                                        <tr key={record.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {record.particular}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.plateNumber} - {record.vehicleType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.ownersName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.companyAssigned}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.driversName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₱{record.contractAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₱{record.finalAmount.toLocaleString()}
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
                            {contractRecords.length === 0 && (
                                <div className="p-6 text-center text-gray-500">
                                    No contract records found.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal for Add/Edit Contract */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {isEditing ? 'Edit Contract Record' : 'Add Contract Record'}
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
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Particular *
                                            </label>
                                            <input
                                                type="text"
                                                name="particular"
                                                value={formData.particular}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Vehicle/Plate Number *
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
                                                        {vehicle.plate_number} - {vehicle.vehicle_type} ({vehicle.vehicle_owner})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Vehicle Type
                                            </label>
                                            <input
                                                type="text"
                                                name="vehicleType"
                                                value={formData.vehicleType}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Owner's Name
                                            </label>
                                            <input
                                                type="text"
                                                name="ownersName"
                                                value={formData.ownersName}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Assigned *
                                            </label>
                                            <input
                                                type="text"
                                                name="companyAssigned"
                                                value={formData.companyAssigned}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Location/Area *
                                            </label>
                                            <input
                                                type="text"
                                                name="locationArea"
                                                value={formData.locationArea}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Driver's Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="driversName"
                                                value={formData.driversName}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Amount Range
                                            </label>
                                            <input
                                                type="text"
                                                name="amountRange"
                                                value={formData.amountRange}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                12M VAT
                                            </label>
                                            <input
                                                type="text"
                                                name="twelveMonthVat"
                                                value={formData.twelveMonthVat}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contract Amount *
                                            </label>
                                            <input
                                                type="number"
                                                name="contractAmount"
                                                value={formData.contractAmount}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Less EWT
                                            </label>
                                            <input
                                                type="number"
                                                name="lessEwt"
                                                value={formData.lessEwt}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Final Amount *
                                            </label>
                                            <input
                                                type="number"
                                                name="finalAmount"
                                                value={formData.finalAmount}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Supplier's Amount
                                            </label>
                                            <input
                                                type="number"
                                                name="suppliersAmount"
                                                value={formData.suppliersAmount}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Driver's Salary
                                            </label>
                                            <input
                                                type="number"
                                                name="driversSalary"
                                                value={formData.driversSalary}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
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

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                End Remarks
                                            </label>
                                            <textarea
                                                name="endRemarks"
                                                value={formData.endRemarks}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
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

export default ContractsNew;
