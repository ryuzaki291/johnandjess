import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

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
    created_at?: string;
    updated_at?: string;
}

// SVG Icons
const ContractIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const CustomerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const MoneyIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const SortAscIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
);

const SortDescIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const ContractsNew: React.FC = () => {
    const [contractRecords, setContractRecords] = useState<ContractRecord[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewRecord, setViewRecord] = useState<ContractRecord | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ContractRecord | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'created_at' | 'updated_at'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const recordsPerPage = 8;
    
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

    // Helper functions
    const formatCurrency = (amount: number | string): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount || 0;
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(numAmount);
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // View handler
    const handleView = (record: ContractRecord) => {
        setViewRecord(record);
        setShowViewModal(true);
    };

    // Filter and sort records
    const filteredRecords = contractRecords.filter((record) =>
        record.particular.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ownersName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.companyAssigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.driversName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedRecords = [...filteredRecords].sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const totalRecords = sortedRecords.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedRecords = sortedRecords.slice(startIndex, endIndex);

    const handleSort = (field: 'created_at' | 'updated_at') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    // Statistics calculations
    const totalContracts = contractRecords.length;
    const totalContractAmount = contractRecords.reduce((sum, record) => {
        const amount = parseFloat(String(record.contractAmount)) || 0;
        return sum + amount;
    }, 0);
    const totalFinalAmount = contractRecords.reduce((sum, record) => {
        const amount = parseFloat(String(record.finalAmount)) || 0;
        return sum + amount;
    }, 0);
    const activeContracts = contractRecords.filter(record => record.endRemarks !== 'Terminated').length;

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
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Show loading alert
            Swal.fire({
                title: isEditing ? 'Updating Contract...' : 'Creating Contract...',
                text: 'Please wait while we process your request',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'rounded-2xl',
                }
            });

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
                contract_amount: parseFloat(String(formData.contractAmount)) || 0,
                less_ewt: parseFloat(String(formData.lessEwt)) || 0,
                final_amount: parseFloat(String(formData.finalAmount)) || 0,
                remarks: formData.remarks,
                suppliers_amount: parseFloat(String(formData.suppliersAmount)) || 0,
                drivers_salary: parseFloat(String(formData.driversSalary)) || 0,
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
                        contractAmount: parseFloat(String(result.data.contract_amount)) || 0,
                        lessEwt: parseFloat(String(result.data.less_ewt)) || 0,
                        finalAmount: parseFloat(String(result.data.final_amount)) || 0,
                        remarks: result.data.remarks || '',
                        suppliersAmount: parseFloat(String(result.data.suppliers_amount)) || 0,
                        driversSalary: parseFloat(String(result.data.drivers_salary)) || 0,
                        startDate: result.data.start_date || '',
                        endRemarks: result.data.end_remarks || '',
                        vehicle: result.data.vehicle,
                        created_at: result.data.created_at,
                        updated_at: result.data.updated_at
                    };

                    if (isEditing) {
                        setContractRecords(prev => 
                            prev.map(record => record.id === editingRecord!.id ? recordData : record)
                        );
                    } else {
                        setContractRecords(prev => [recordData, ...prev]);
                    }
                    
                    closeModal();
                    
                    // Show success alert
                    await Swal.fire({
                        title: 'Success!',
                        text: `Contract record ${isEditing ? 'updated' : 'created'} successfully!`,
                        icon: 'success',
                        confirmButtonColor: '#3b82f6',
                        confirmButtonText: 'Great!',
                        customClass: {
                            popup: 'rounded-2xl',
                            confirmButton: 'rounded-lg px-6 py-2 font-medium',
                        }
                    });
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} record`);
            }
        } catch (err: any) {
            console.error('Error saving record:', err);
            await Swal.fire({
                title: 'Error!',
                text: err.message || 'An error occurred while saving the record.',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });
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
    };

    const handleDelete = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    cancelButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });

            if (result.isConfirmed) {
                // Show loading
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait while we delete the contract record',
                    icon: 'info',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    willOpen: () => {
                        Swal.showLoading();
                    },
                    customClass: {
                        popup: 'rounded-2xl',
                    }
                });

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
                        
                        await Swal.fire({
                            title: 'Deleted!',
                            text: 'Contract record has been deleted successfully.',
                            icon: 'success',
                            confirmButtonColor: '#3b82f6',
                            confirmButtonText: 'OK',
                            customClass: {
                                popup: 'rounded-2xl',
                                confirmButton: 'rounded-lg px-6 py-2 font-medium',
                            }
                        });
                    }
                } else {
                    throw new Error('Failed to delete record');
                }
            }
        } catch (err: any) {
            console.error('Error deleting record:', err);
            await Swal.fire({
                title: 'Error!',
                text: err.message || 'An error occurred while deleting the record.',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent mb-2">
                        Contract Management
                    </h1>
                    <p className="text-slate-600 text-lg">Manage vehicle contracts and agreements</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-blue-100">
                                <ContractIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-slate-600 text-sm font-medium">Total Contracts</p>
                                <p className="text-3xl font-bold text-slate-900">{totalContracts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-green-100">
                                <MoneyIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-slate-600 text-sm font-medium">Contract Amount</p>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalContractAmount)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-purple-100">
                                <MoneyIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-slate-600 text-sm font-medium">Final Amount</p>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalFinalAmount)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-emerald-100">
                                <CustomerIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-slate-600 text-sm font-medium">Active Contracts</p>
                                <p className="text-3xl font-bold text-slate-900">{activeContracts}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
                    {/* Header with Search and Actions */}
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">Contract Records</h2>
                                <p className="text-slate-600">Manage and track all contract agreements</p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search contracts..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon />
                                    </div>
                                </div>

                                {/* Add Button */}
                                <button
                                    onClick={openModal}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    <PlusIcon />
                                    <span className="ml-2">Add Contract</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-slate-600">Loading contracts...</span>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700">
                                                <button
                                                    onClick={() => handleSort('created_at')}
                                                    className="flex items-center hover:text-slate-900 transition-colors"
                                                >
                                                    Particular
                                                    {sortBy === 'created_at' && (
                                                        sortOrder === 'asc' ? <SortAscIcon /> : <SortDescIcon />
                                                    )}
                                                </button>
                                            </th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Vehicle</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Owner</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Company</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Driver</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Contract Amount</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Final Amount</th>
                                            <th className="text-center py-4 px-6 font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {paginatedRecords.map((record, index) => (
                                            <tr key={record.id} className="hover:bg-slate-50 transition-colors duration-200">
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-slate-900">{record.particular}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-slate-700">{record.plateNumber}</div>
                                                    <div className="text-sm text-slate-500">{record.vehicleType}</div>
                                                </td>
                                                <td className="py-4 px-6 text-slate-700">{record.ownersName}</td>
                                                <td className="py-4 px-6 text-slate-700">{record.companyAssigned}</td>
                                                <td className="py-4 px-6 text-slate-700">{record.driversName}</td>
                                                <td className="py-4 px-6 font-semibold text-green-600">
                                                    {formatCurrency(record.contractAmount)}
                                                </td>
                                                <td className="py-4 px-6 font-semibold text-blue-600">
                                                    {formatCurrency(record.finalAmount)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleView(record)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                            title="View Details"
                                                        >
                                                            <EyeIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(record)}
                                                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                                                            title="Edit Record"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(record.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                            title="Delete Record"
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {paginatedRecords.length === 0 && (
                                    <div className="text-center py-12">
                                        <ContractIcon />
                                        <h3 className="mt-2 text-sm font-semibold text-slate-900">No contracts found</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating a new contract'}
                                        </p>
                                        {!searchTerm && (
                                            <button
                                                onClick={openModal}
                                                className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                            >
                                                <PlusIcon />
                                                <span className="ml-2">Add First Contract</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="border-t border-slate-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-600">
                                            Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of {totalRecords} results
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <ChevronLeftIcon />
                                            </button>
                                            
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(page => 
                                                    page === 1 || 
                                                    page === totalPages || 
                                                    Math.abs(page - currentPage) <= 1
                                                )
                                                .map((page, index, array) => (
                                                    <React.Fragment key={page}>
                                                        {index > 0 && array[index - 1] < page - 1 && (
                                                            <span className="px-2 text-slate-500">...</span>
                                                        )}
                                                        <button
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                                                                currentPage === page
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    </React.Fragment>
                                                ))
                                            }
                                            
                                            <button
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <ChevronRightIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
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

                {/* View Modal */}
                {showViewModal && viewRecord && (
                    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Contract Details</h2>
                                        <p className="text-slate-600">Complete information for {viewRecord.particular || 'Contract'}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Contract Overview */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <ContractIcon />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold text-slate-900">{viewRecord.particular || 'Contract'}</h3>
                                            <p className="text-slate-600">{viewRecord.plateNumber || 'No vehicle'} • {viewRecord.driversName || 'No driver'}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                                {formatCurrency(viewRecord.finalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contract Information Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Contract Information</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Particular:</span>
                                                    <span className="text-slate-900 font-semibold">{viewRecord.particular || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Vehicle:</span>
                                                    <span className="text-slate-900">{viewRecord.plateNumber || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Vehicle Type:</span>
                                                    <span className="text-slate-900">{viewRecord.vehicleType || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Owner:</span>
                                                    <span className="text-slate-900">{viewRecord.ownersName || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Company:</span>
                                                    <span className="text-slate-900">{viewRecord.companyAssigned || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Location & Personnel</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Driver:</span>
                                                    <span className="text-slate-900">{viewRecord.driversName || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Location/Area:</span>
                                                    <span className="text-slate-900">{viewRecord.locationArea || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Start Date:</span>
                                                    <span className="text-slate-900">{formatDate(viewRecord.startDate)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 font-medium block mb-1">Remarks:</span>
                                                    <span className="text-slate-900">{viewRecord.remarks || 'No remarks'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Financial Details</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Contract Amount:</span>
                                                    <span className="text-blue-600 font-semibold">{formatCurrency(viewRecord.contractAmount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Less EWT:</span>
                                                    <span className="text-slate-900">{formatCurrency(viewRecord.lessEwt)}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2">
                                                    <span className="text-slate-600 font-medium">Final Amount:</span>
                                                    <span className="text-green-600 font-bold text-lg">{formatCurrency(viewRecord.finalAmount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Suppliers Amount:</span>
                                                    <span className="text-slate-900">{formatCurrency(viewRecord.suppliersAmount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Drivers Salary:</span>
                                                    <span className="text-slate-900">{formatCurrency(viewRecord.driversSalary)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Amount Range:</span>
                                                    <span className="text-slate-900">{viewRecord.amountRange || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">12 Month VAT:</span>
                                                    <span className="text-slate-900">{viewRecord.twelveMonthVat || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 font-medium block mb-1">End Remarks:</span>
                                                    <span className="text-slate-900">{viewRecord.endRemarks || 'No end remarks'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Created:</span>
                                                    <span className="text-slate-900">{formatDate(viewRecord.created_at)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Last Updated:</span>
                                                    <span className="text-slate-900">{formatDate(viewRecord.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                                    <button
                                        onClick={() => {
                                            setShowViewModal(false);
                                            handleEdit(viewRecord);
                                        }}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <EditIcon />
                                        <span className="ml-2">Edit Contract</span>
                                    </button>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractsNew;
