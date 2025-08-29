import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Helper function to get CSRF token
const getCsrfToken = (): string | null => {
    const token = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return token ? token.content : null;
};

// SVG Icons
const CarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TruckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m0 0l-4-4m4 4l-4 4" />
    </svg>
);

const MaintenanceIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

interface Vehicle {
    plate_number: string;
    vehicle_type: string | null;
    vehicle_owner: string | null;
    vehicle_owner_address: string | null;
    vehicle_brand: string | null;
    company_name: string | null;
    vehicle_status: string | null;
    add_date_in_company: string | null;
    creator: number | null;
    creation_date: string | null;
    created_at: string;
    updated_at: string;
    created_by?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface VehicleFormData {
    plate_number: string;
    vehicle_type: string;
    vehicle_owner: string;
    vehicle_owner_address: string;
    vehicle_brand: string;
    company_name: string;
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
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [formData, setFormData] = useState<VehicleFormData>({
        plate_number: '',
        vehicle_type: '',
        vehicle_owner: '',
        vehicle_owner_address: '',
        vehicle_brand: '',
        company_name: '',
        vehicle_status: 'active',
        add_date_in_company: '',
        creation_date: new Date().toISOString().split('T')[0]
    });
    const [formErrors, setFormErrors] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'created_at' | 'updated_at'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const itemsPerPage = 10;

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
                setCurrentPage(1); // Reset to first page
            } else {
                setError(data.message || 'Failed to fetch vehicles');
                await Swal.fire({
                    title: 'Fetch Error!',
                    text: data.message || 'Failed to fetch vehicles',
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'Retry',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetchVehicles();
                    }
                });
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error fetching vehicles');
            await Swal.fire({
                title: 'Network Error!',
                text: 'Unable to connect to the server. Please check your connection and try again.',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Retry',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchVehicles();
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleView = (vehicle: Vehicle) => {
        setViewVehicle(vehicle);
        setShowViewModal(true);
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
            company_name: '',
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
            company_name: vehicle.company_name || '',
            vehicle_status: vehicle.vehicle_status || 'active',
            add_date_in_company: vehicle.add_date_in_company || '',
            creation_date: vehicle.creation_date || ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDelete = async (vehicle: Vehicle) => {
        const result = await Swal.fire({
            title: 'Delete Vehicle?',
            text: `Are you sure you want to delete vehicle "${vehicle.plate_number}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg px-6 py-2 font-medium',
                cancelButton: 'rounded-lg px-6 py-2 font-medium',
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            await Swal.fire({
                title: 'Session Error!',
                text: 'CSRF token missing. Please refresh the page and try again.',
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });
            return;
        }

        try {
            const response = await fetch(`/api/vehicles/${encodeURIComponent(vehicle.plate_number)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (data.success) {
                setVehicles(vehicles.filter(v => v.plate_number !== vehicle.plate_number));
                setError(null);
                // Reset to first page if current page becomes empty
                const remainingVehicles = vehicles.length - 1;
                const maxPage = Math.ceil(remainingVehicles / itemsPerPage);
                if (currentPage > maxPage && maxPage > 0) {
                    setCurrentPage(maxPage);
                }
                
                // Show success alert
                await Swal.fire({
                    title: 'Deleted!',
                    text: `Vehicle "${vehicle.plate_number}" has been deleted successfully.`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl',
                    }
                });
            } else {
                await Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Failed to delete vehicle',
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
            }
        } catch (err) {
            await Swal.fire({
                title: 'Error!',
                text: 'An error occurred while deleting the vehicle',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            await Swal.fire({
                title: 'Session Error!',
                text: 'CSRF token missing. Please refresh the page and try again.',
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });
            setSubmitting(false);
            return;
        }

        const url = modalMode === 'create' 
            ? '/api/vehicles' 
            : `/api/vehicles/${encodeURIComponent(selectedVehicle?.plate_number || '')}`;
        const method = modalMode === 'create' ? 'POST' : 'PUT';

        console.log('Submitting form data:', formData);
        console.log('Using CSRF token:', csrfToken ? 'CSRF token exists' : 'No CSRF token');

        // Show loading alert
        Swal.fire({
            title: modalMode === 'create' ? 'Creating Vehicle...' : 'Updating Vehicle...',
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

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('API response:', data);

            // Close loading alert
            Swal.close();

            if (data.success) {
                if (modalMode === 'create') {
                    setVehicles([data.vehicle, ...vehicles]);
                    await Swal.fire({
                        title: 'Vehicle Created!',
                        text: `Vehicle "${data.vehicle.plate_number}" has been created successfully.`,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'rounded-2xl',
                        }
                    });
                } else {
                    setVehicles(vehicles.map(v => 
                        v.plate_number === selectedVehicle?.plate_number ? data.vehicle : v
                    ));
                    await Swal.fire({
                        title: 'Vehicle Updated!',
                        text: `Vehicle "${data.vehicle.plate_number}" has been updated successfully.`,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'rounded-2xl',
                        }
                    });
                }
                setShowModal(false);
                setError(null);
            } else {
                // Close loading alert first
                Swal.close();
                
                if (data.errors) {
                    setFormErrors(data.errors);
                } else {
                    await Swal.fire({
                        title: 'Error!',
                        text: data.message || 'Operation failed',
                        icon: 'error',
                        confirmButtonColor: '#3b82f6',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'rounded-2xl',
                            confirmButton: 'rounded-lg px-6 py-2 font-medium',
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Submit error:', err);
            // Close loading alert first
            Swal.close();
            
            await Swal.fire({
                title: 'Error!',
                text: 'An error occurred while submitting the form',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });
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

    // Sorting and pagination functions
    const sortedVehicles = vehicles.sort((a, b) => {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        
        if (sortOrder === 'desc') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVehicles = sortedVehicles.slice(startIndex, endIndex);

    const handleSort = (field: 'created_at' | 'updated_at') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1); // Reset to first page when sorting
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const getPaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'maintenance': return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'inactive': return 'bg-red-100 text-red-800 border border-red-200';
            case 'retired': return 'bg-slate-100 text-slate-800 border border-slate-200';
            default: return 'bg-slate-100 text-slate-800 border border-slate-200';
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
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Vehicle Management</h1>
                            <p className="text-slate-600">Manage your fleet of vehicles efficiently</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={fetchVehicles}
                                className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                            >
                                <RefreshIcon />
                                <span className="ml-2">Refresh</span>
                            </button>
                            <button 
                                onClick={handleCreate}
                                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <PlusIcon />
                                <span className="ml-2">Add Vehicle</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                <CarIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Vehicles</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalVehicles}</p>
                                <p className="text-xs text-slate-500 mt-1">Active fleet size</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.activeVehicles}</p>
                                <p className="text-xs text-slate-500 mt-1">Ready for service</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                                <MaintenanceIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Under Maintenance</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.maintenanceVehicles}</p>
                                <p className="text-xs text-slate-500 mt-1">Being serviced</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                                <CalendarIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Added Today</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.newToday}</p>
                                <p className="text-xs text-slate-500 mt-1">New additions</p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                                <button 
                                    onClick={fetchVehicles}
                                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sorting Controls for Mobile */}
                <div className="lg:hidden mb-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Sort by:</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleSort('created_at')}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                                        sortBy === 'created_at'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    Created {sortBy === 'created_at' && (sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />)}
                                </button>
                                <button
                                    onClick={() => handleSort('updated_at')}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                                        sortBy === 'updated_at'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    Updated {sortBy === 'updated_at' && (sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                    {currentVehicles.map((vehicle) => (
                        <div key={vehicle.plate_number} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{vehicle.plate_number}</h3>
                                        <p className="text-sm text-slate-500">{vehicle.vehicle_type || 'Unknown Type'} • {vehicle.vehicle_brand || 'Unknown Brand'}</p>
                                        {vehicle.company_name && (
                                            <p className="text-sm text-blue-600 font-medium">{vehicle.company_name}</p>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.vehicle_status)}`}>
                                        {vehicle.vehicle_status || 'Unknown'}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 font-medium">Owner</p>
                                        <p className="text-slate-900 truncate">{vehicle.vehicle_owner || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-medium">Date Added</p>
                                        <p className="text-slate-900">{formatDate(vehicle.add_date_in_company)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-medium">Creator</p>
                                        <p className="text-slate-900 truncate">{vehicle.created_by?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-medium">Created</p>
                                        <p className="text-slate-900">{formatDate(vehicle.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handleView(vehicle)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <EyeIcon />
                                        <span className="ml-1">View</span>
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(vehicle)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <EditIcon />
                                        <span className="ml-1">Edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(vehicle)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <DeleteIcon />
                                        <span className="ml-1">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {currentVehicles.length === 0 && !loading && vehicles.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <CarIcon />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No vehicles found</h3>
                            <p className="text-slate-500 mb-6">Get started by adding your first vehicle to the fleet.</p>
                            <button 
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <PlusIcon />
                                <span className="ml-2">Add Vehicle</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Vehicle Fleet</h3>
                                <p className="text-sm text-slate-500">Manage and monitor your entire vehicle fleet</p>
                            </div>
                            <div className="text-sm text-slate-500">
                                Showing {startIndex + 1}-{Math.min(endIndex, vehicles.length)} of {vehicles.length} vehicles
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Vehicle Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Owner
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Date Added
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Created</span>
                                            {sortBy === 'created_at' && (
                                                sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                        onClick={() => handleSort('updated_at')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Updated</span>
                                            {sortBy === 'updated_at' && (
                                                sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {currentVehicles.map((vehicle) => (
                                    <tr key={vehicle.plate_number} className="hover:bg-slate-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{vehicle.plate_number}</div>
                                                <div className="text-sm text-slate-500">{vehicle.vehicle_type || 'Unknown Type'} • {vehicle.vehicle_brand || 'Unknown Brand'}</div>
                                                {vehicle.company_name && (
                                                    <div className="text-sm text-blue-600 font-medium">{vehicle.company_name}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{vehicle.vehicle_owner || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.vehicle_status)}`}>
                                                {vehicle.vehicle_status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {formatDate(vehicle.add_date_in_company)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            <div className="flex flex-col">
                                                <span>{formatDate(vehicle.created_at)}</span>
                                                <span className="text-xs text-slate-500">{vehicle.created_by?.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            <div className="flex flex-col">
                                                <span>{formatDate(vehicle.updated_at)}</span>
                                                <span className="text-xs text-slate-500">Last modified</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button 
                                                    onClick={() => handleView(vehicle)}
                                                    className="inline-flex items-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                                    title="View Details"
                                                >
                                                    <EyeIcon />
                                                </button>
                                                <button 
                                                    onClick={() => handleEdit(vehicle)}
                                                    className="inline-flex items-center p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                    title="Edit Vehicle"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(vehicle)}
                                                    className="inline-flex items-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title="Delete Vehicle"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {currentVehicles.length === 0 && !loading && vehicles.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <CarIcon />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No vehicles found</h3>
                                <p className="text-slate-500 mb-6">Get started by adding your first vehicle to the fleet.</p>
                                <button 
                                    onClick={handleCreate}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    <PlusIcon />
                                    <span className="ml-2">Add Vehicle</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination for Desktop */}
                    {vehicles.length > 0 && totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-700">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, vehicles.length)}</span> of{' '}
                                    <span className="font-medium">{vehicles.length}</span> results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        <ChevronLeftIcon />
                                        <span className="ml-1">Previous</span>
                                    </button>
                                    
                                    <div className="flex items-center space-x-1">
                                        {getPaginationNumbers().map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        <span className="mr-1">Next</span>
                                        <ChevronRightIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination for Mobile */}
                {vehicles.length > 0 && totalPages > 1 && (
                    <div className="lg:hidden mt-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-slate-700">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {vehicles.length} total vehicles
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    <ChevronLeftIcon />
                                    <span className="ml-1">Previous</span>
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    {getPaginationNumbers().slice(0, 3).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    {totalPages > 3 && <span className="text-slate-400">...</span>}
                                </div>
                                
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    <span className="mr-1">Next</span>
                                    <ChevronRightIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {showViewModal && viewVehicle && (
                    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Vehicle Details</h2>
                                        <p className="text-slate-600">Complete information for {viewVehicle.plate_number}</p>
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
                                {/* Vehicle Overview */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <CarIcon />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold text-slate-900">{viewVehicle.plate_number}</h3>
                                            <p className="text-slate-600">{viewVehicle.vehicle_type || 'Unknown Type'} • {viewVehicle.vehicle_brand || 'Unknown Brand'}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(viewVehicle.vehicle_status)}`}>
                                                {viewVehicle.vehicle_status || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Information Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Plate Number:</span>
                                                    <span className="text-slate-900 font-semibold">{viewVehicle.plate_number}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Vehicle Type:</span>
                                                    <span className="text-slate-900">{viewVehicle.vehicle_type || 'Not specified'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Brand:</span>
                                                    <span className="text-slate-900">{viewVehicle.vehicle_brand || 'Not specified'}</span>
                                                </div>
                                                {viewVehicle.company_name && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600 font-medium">Company:</span>
                                                        <span className="text-slate-900">{viewVehicle.company_name}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Status:</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(viewVehicle.vehicle_status)}`}>
                                                        {viewVehicle.vehicle_status || 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Owner Information</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-slate-600 font-medium block mb-1">Owner Name:</span>
                                                    <span className="text-slate-900">{viewVehicle.vehicle_owner || 'Not specified'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 font-medium block mb-1">Owner Address:</span>
                                                    <span className="text-slate-900">{viewVehicle.vehicle_owner_address || 'Not specified'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Important Dates</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Date Added to Company:</span>
                                                    <span className="text-slate-900">{formatDate(viewVehicle.add_date_in_company)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Creation Date:</span>
                                                    <span className="text-slate-900">{formatDate(viewVehicle.creation_date)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Record Created:</span>
                                                    <span className="text-slate-900">{formatDate(viewVehicle.created_at)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Last Updated:</span>
                                                    <span className="text-slate-900">{formatDate(viewVehicle.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">System Information</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Created By:</span>
                                                    <span className="text-slate-900">{viewVehicle.created_by?.name || 'Unknown'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Creator Email:</span>
                                                    <span className="text-slate-900">{viewVehicle.created_by?.email || 'Not available'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Creator ID:</span>
                                                    <span className="text-slate-900">{viewVehicle.creator || 'Not available'}</span>
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
                                            handleEdit(viewVehicle);
                                        }}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <EditIcon />
                                        <span className="ml-2">Edit Vehicle</span>
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

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {modalMode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
                                        </h2>
                                        <p className="text-slate-600">
                                            {modalMode === 'create' 
                                                ? 'Fill in the details to add a new vehicle to your fleet' 
                                                : `Update information for ${selectedVehicle?.plate_number}`
                                            }
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-8">
                                    {/* Basic Information Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Plate Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="plate_number"
                                                    value={formData.plate_number}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                    required
                                                    placeholder="e.g., ABC-123"
                                                />
                                                {formErrors.plate_number && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.plate_number[0]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                                                <input
                                                    type="text"
                                                    name="vehicle_type"
                                                    value={formData.vehicle_type}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                    placeholder="e.g., Van, Truck, Car"
                                                />
                                                {formErrors.vehicle_type && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.vehicle_type[0]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Brand</label>
                                                <input
                                                    type="text"
                                                    name="vehicle_brand"
                                                    value={formData.vehicle_brand}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                    placeholder="e.g., Toyota, Honda, Ford"
                                                />
                                                {formErrors.vehicle_brand && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.vehicle_brand[0]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                                                <select
                                                    name="company_name"
                                                    value={formData.company_name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                >
                                                    <option value="">Select Company</option>
                                                    <option value="DITO TELECOMMUNITY CORPORATION">DITO TELECOMMUNITY CORPORATION</option>
                                                    <option value="CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION">CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION</option>
                                                    <option value="FUTURENET AND TECHNOLOGY CORPORATION">FUTURENET AND TECHNOLOGY CORPORATION</option>
                                                    <option value="BESTWORLD ENGINEERING SDN BHD">BESTWORLD ENGINEERING SDN BHD</option>
                                                </select>
                                                {formErrors.company_name && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.company_name[0]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Status</label>
                                                <select
                                                    name="vehicle_status"
                                                    value={formData.vehicle_status}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="maintenance">Maintenance</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="retired">Retired</option>
                                                </select>
                                                {formErrors.vehicle_status && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.vehicle_status[0]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Owner Information Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Owner Information</h3>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Owner</label>
                                                <input
                                                    type="text"
                                                    name="vehicle_owner"
                                                    value={formData.vehicle_owner}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                    placeholder="Owner name"
                                                />
                                                {formErrors.vehicle_owner && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.vehicle_owner[0]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Owner Address</label>
                                                <textarea
                                                    name="vehicle_owner_address"
                                                    value={formData.vehicle_owner_address}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                    placeholder="Owner address"
                                                />
                                                {formErrors.vehicle_owner_address && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.vehicle_owner_address[0]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Information Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Date Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date Added to Company</label>
                                                <input
                                                    type="date"
                                                    name="add_date_in_company"
                                                    value={formData.add_date_in_company}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                />
                                                {formErrors.add_date_in_company && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.add_date_in_company[0]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Creation Date</label>
                                                <input
                                                    type="date"
                                                    name="creation_date"
                                                    value={formData.creation_date}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                />
                                                {formErrors.creation_date && (
                                                    <p className="mt-2 text-sm text-red-600">{formErrors.creation_date[0]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-slate-200 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={submitting}
                                    >
                                        {submitting 
                                            ? (modalMode === 'create' ? 'Creating...' : 'Updating...') 
                                            : (modalMode === 'create' ? 'Create Vehicle' : 'Update Vehicle')
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vehicle;
