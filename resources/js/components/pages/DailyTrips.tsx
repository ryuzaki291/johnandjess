import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { DailyTrip, DailyTripFormData } from '../../types/DailyTrip';
import DailyTripModal from '../modals/DailyTripModal';

// Helper function to get CSRF token
const getCsrfToken = (): string | null => {
    const token = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return token ? token.content : null;
};

// SVG Icons
const TruckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m0 0l-4-4m4 4l-4 4" />
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

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const DailyTrips: React.FC = () => {
    const [trips, setTrips] = useState<DailyTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewTrip, setViewTrip] = useState<DailyTrip | null>(null);
    const [editingTrip, setEditingTrip] = useState<DailyTrip | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'created_at' | 'updated_at'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const itemsPerPage = 10;

    useEffect(() => {
        // Check if user is authenticated - use the same key as the main app
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }
        setIsAuthenticated(true);
        fetchTrips();
    }, []);

    const handleView = (trip: DailyTrip) => {
        setViewTrip(trip);
        setShowViewModal(true);
    };

    // Sorting and pagination functions
    const filteredTrips = trips.filter(trip =>
        (trip.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.vehicle?.plate_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.month_year || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedTrips = filteredTrips.sort((a, b) => {
        // Primary sort by created date
        const aCreated = new Date(a.created_at || 0);
        const bCreated = new Date(b.created_at || 0);
        
        // Secondary sort by updated date
        const aUpdated = new Date(a.updated_at || 0);
        const bUpdated = new Date(b.updated_at || 0);
        
        if (sortOrder === 'desc') {
            // Sort by created date first (newest first)
            const createdDiff = bCreated.getTime() - aCreated.getTime();
            if (createdDiff !== 0) {
                return createdDiff;
            }
            // If created dates are the same, sort by updated date (newest first)
            return bUpdated.getTime() - aUpdated.getTime();
        } else {
            // Sort by created date first (oldest first)
            const createdDiff = aCreated.getTime() - bCreated.getTime();
            if (createdDiff !== 0) {
                return createdDiff;
            }
            // If created dates are the same, sort by updated date (oldest first)
            return aUpdated.getTime() - bUpdated.getTime();
        }
    });

    const totalPages = Math.ceil(sortedTrips.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTrips = sortedTrips.slice(startIndex, endIndex);

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

    // Statistics calculation
    const getTripStats = () => {
        const totalTrips = trips.length;
        
        // Fix for Total Revenue - ensure we're working with numbers
        const totalRevenue = trips.reduce((sum, trip) => {
            const amount = parseFloat(trip.total_amount?.toString() || '0');
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        
        // Fix for Amount Billed - ensure we're working with numbers
        const totalBilled = trips.reduce((sum, trip) => {
            const amount = parseFloat(trip.amount_billed?.toString() || '0');
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        
        const today = new Date().toDateString();
        const newToday = trips.filter(t => new Date(t.created_at).toDateString() === today).length;

        return { totalTrips, totalRevenue, totalBilled, newToday };
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid Date';
        }
    };

    const formatCurrency = (amount: number | null | undefined) => {
        if (!amount || isNaN(amount)) return '₱0.00';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const fetchTrips = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.error('No authentication token found');
                setIsAuthenticated(false);
                setLoading(false);
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
                setCurrentPage(1); // Reset to first page
                setError(null);
            } else if (response.status === 401) {
                console.error('Authentication failed');
                setIsAuthenticated(false);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            } else {
                const errorMsg = 'Failed to fetch trips';
                setError(errorMsg);
                await Swal.fire({
                    title: 'Fetch Error!',
                    text: errorMsg,
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'Retry',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetchTrips();
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching trips:', error);
            const errorMsg = 'Unable to connect to the server. Please check your connection and try again.';
            setError(errorMsg);
            await Swal.fire({
                title: 'Network Error!',
                text: errorMsg,
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Retry',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchTrips();
                }
            });
        } finally {
            setLoading(false);
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
            const token = localStorage.getItem('auth_token');
            const csrfToken = getCsrfToken();
            
            if (!token) {
                console.error('No authentication token found');
                await Swal.fire({
                    title: 'Authentication Required!',
                    text: 'Please log in again to continue.',
                    icon: 'warning',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
                setIsAuthenticated(false);
                return;
            }

            if (!csrfToken) {
                console.error('No CSRF token found');
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

            console.log('Creating trip with data:', tripData);
            
            // Show loading alert
            Swal.fire({
                title: 'Creating Trip...',
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
            
            const response = await fetch('/api/daily-trips', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(tripData),
            });

            console.log('Create trip response status:', response.status);
            
            const responseText = await response.text();
            console.log('Raw response text:', responseText);
            
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                Swal.close();
                await Swal.fire({
                    title: 'Server Error!',
                    text: 'Server returned invalid response. Please check the server logs.',
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
                return;
            }
            
            Swal.close();
            
            if (response.ok) {
                setTrips([...trips, responseData.data]);
                setIsModalOpen(false);
                await Swal.fire({
                    title: 'Trip Created!',
                    text: 'Daily trip has been created successfully.',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl',
                    }
                });
            } else if (response.status === 401) {
                console.error('Authentication failed during trip creation');
                setIsAuthenticated(false);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                await Swal.fire({
                    title: 'Authentication Expired!',
                    text: 'Please log in again.',
                    icon: 'warning',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
            } else if (response.status === 422) {
                console.error('Validation errors:', responseData.errors);
                await Swal.fire({
                    title: 'Validation Errors!',
                    text: 'Please check your input data: ' + JSON.stringify(responseData.errors),
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
            } else {
                console.error('Failed to create trip:', responseData);
                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to create trip: ' + (responseData.message || 'Unknown error'),
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            Swal.close();
            await Swal.fire({
                title: 'Error!',
                text: 'Error creating trip: ' + (error instanceof Error ? error.message : 'Unknown error'),
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

    const handleUpdateTrip = async (id: number, tripData: DailyTripFormData) => {
        try {
            const token = localStorage.getItem('auth_token');
            const csrfToken = getCsrfToken();
            
            if (!token) {
                console.error('No authentication token found');
                await Swal.fire({
                    title: 'Authentication Required!',
                    text: 'Please log in again to continue.',
                    icon: 'warning',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
                setIsAuthenticated(false);
                return;
            }

            if (!csrfToken) {
                console.error('No CSRF token found');
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

            // Show loading alert
            Swal.fire({
                title: 'Updating Trip...',
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

            const response = await fetch(`/api/daily-trips/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(tripData),
            });

            Swal.close();

            if (response.ok) {
                const responseData = await response.json();
                setTrips(trips.map(trip => trip.id === id ? responseData.data : trip));
                setIsModalOpen(false);
                setEditingTrip(null);
                await Swal.fire({
                    title: 'Trip Updated!',
                    text: 'Daily trip has been updated successfully.',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl',
                    }
                });
            } else if (response.status === 401) {
                console.error('Authentication failed during trip update');
                setIsAuthenticated(false);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                await Swal.fire({
                    title: 'Authentication Expired!',
                    text: 'Please log in again.',
                    icon: 'warning',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
            } else {
                const errorData = await response.json();
                console.error('Failed to update trip:', errorData);
                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update trip: ' + (errorData.message || 'Unknown error'),
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
            }
        } catch (error) {
            console.error('Error updating trip:', error);
            Swal.close();
            await Swal.fire({
                title: 'Error!',
                text: 'Error updating trip: ' + (error instanceof Error ? error.message : 'Unknown error'),
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

    const handleDeleteTrip = async (id: number, tripInfo: string) => {
        const result = await Swal.fire({
            title: 'Delete Trip?',
            text: `Are you sure you want to delete this trip "${tripInfo}"? This action cannot be undone.`,
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

        try {
            const token = localStorage.getItem('auth_token');
            const csrfToken = getCsrfToken();
            
            if (!token) {
                console.error('No authentication token found');
                await Swal.fire({
                    title: 'Authentication Required!',
                    text: 'Please log in again to continue.',
                    icon: 'warning',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
                setIsAuthenticated(false);
                return;
            }

            if (!csrfToken) {
                console.error('No CSRF token found');
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

            const response = await fetch(`/api/daily-trips/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                setTrips(trips.filter(trip => trip.id !== id));
                // Reset to first page if current page becomes empty
                const remainingTrips = trips.length - 1;
                const maxPage = Math.ceil(remainingTrips / itemsPerPage);
                if (currentPage > maxPage && maxPage > 0) {
                    setCurrentPage(maxPage);
                }
                
                // Show success alert
                await Swal.fire({
                    title: 'Deleted!',
                    text: `Trip "${tripInfo}" has been deleted successfully.`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl',
                    }
                });
            } else if (response.status === 401) {
                console.error('Authentication failed during trip deletion');
                setIsAuthenticated(false);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                await Swal.fire({
                    title: 'Authentication Expired!',
                    text: 'Please log in again.',
                    icon: 'warning',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
            } else {
                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete trip',
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium',
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            await Swal.fire({
                title: 'Error!',
                text: 'Error deleting trip: ' + (error instanceof Error ? error.message : 'Unknown error'),
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 sm:h-32 w-16 sm:w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading daily trips...</p>
                </div>
            </div>
        );
    }

    const stats = getTripStats();

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Daily Trips Management</h1>
                            <p className="text-slate-600">Manage and track your daily transportation trips</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={fetchTrips}
                                className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                            >
                                <RefreshIcon />
                                <span className="ml-2">Refresh</span>
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <PlusIcon />
                                <span className="ml-2">Add New Trip</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                <TruckIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Trips</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalTrips}</p>
                                <p className="text-xs text-slate-500 mt-1">All time</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                <MoneyIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Revenue</p>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
                                <p className="text-xs text-slate-500 mt-1">All trips combined</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                                <CustomerIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Amount Billed</p>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalBilled)}</p>
                                <p className="text-xs text-slate-500 mt-1">Total invoiced</p>
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
                                <p className="text-xs text-slate-500 mt-1">New trips</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search trips by customer, vehicle, destination, or date..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500"
                                />
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
                                    onClick={fetchTrips}
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
                                    Date {sortBy === 'created_at' && (sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                    {currentTrips.map((trip) => (
                        <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{trip.customer_name || 'Unnamed Customer'}</h3>
                                        <p className="text-sm text-slate-500">{trip.month_year} • {trip.vehicle?.plate_number || 'No Vehicle'}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        {formatCurrency(trip.amount_billed)}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 font-medium">Destination</p>
                                        <p className="text-slate-900 truncate">{trip.destination || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-medium">Total Allowance</p>
                                        <p className="text-slate-900">{formatCurrency(trip.total_allowance)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-medium">From Date</p>
                                        <p className="text-slate-900">{formatDate(trip.date_from || null)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-medium">To Date</p>
                                        <p className="text-slate-900">{formatDate(trip.date_to || null)}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handleView(trip)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <EyeIcon />
                                        <span className="ml-1">View</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setEditingTrip(trip);
                                            setIsModalOpen(true);
                                        }}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <EditIcon />
                                        <span className="ml-1">Edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteTrip(trip.id, `${trip.customer_name} - ${trip.destination}`)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <DeleteIcon />
                                        <span className="ml-1">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {currentTrips.length === 0 && !loading && trips.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <TruckIcon />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No trips found</h3>
                            <p className="text-slate-500 mb-6">Get started by adding your first daily trip.</p>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <PlusIcon />
                                <span className="ml-2">Add Trip</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Daily Trips</h3>
                                <p className="text-sm text-slate-500">Manage and track your transportation trips</p>
                            </div>
                            <div className="text-sm text-slate-500">
                                Showing {startIndex + 1}-{Math.min(endIndex, sortedTrips.length)} of {sortedTrips.length} trips
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Trip Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Customer & Vehicle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Destination & Dates
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Financial Details
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Date</span>
                                            {sortBy === 'created_at' && (
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
                                {currentTrips.map((trip) => (
                                    <tr key={trip.id} className="hover:bg-slate-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{trip.month_year || 'No Date'}</div>
                                                <div className="text-sm text-slate-500">{trip.department || 'No Department'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{trip.customer_name || 'Unnamed Customer'}</div>
                                                <div className="text-sm text-slate-500">{trip.vehicle?.plate_number || 'No Vehicle'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm text-slate-900">{trip.destination || 'No Destination'}</div>
                                                <div className="text-sm text-slate-500">
                                                    {formatDate(trip.date_from || null)} - {formatDate(trip.date_to || null)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">
                                                    Allowance: {formatCurrency(trip.total_allowance)}
                                                </div>
                                                <div className="text-sm text-green-600 font-semibold">
                                                    Billed: {formatCurrency(trip.amount_billed)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{formatDate(trip.created_at)}</span>
                                                <span className="text-xs text-slate-500">Created</span>
                                                <span className="mt-1">{formatDate(trip.updated_at)}</span>
                                                <span className="text-xs text-slate-500">Updated</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button 
                                                    onClick={() => handleView(trip)}
                                                    className="inline-flex items-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                                    title="View Details"
                                                >
                                                    <EyeIcon />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setEditingTrip(trip);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="inline-flex items-center p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                    title="Edit Trip"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteTrip(trip.id, `${trip.customer_name} - ${trip.destination}`)}
                                                    className="inline-flex items-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title="Delete Trip"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {currentTrips.length === 0 && !loading && trips.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <TruckIcon />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No trips found</h3>
                                <p className="text-slate-500 mb-6">Get started by adding your first daily trip.</p>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    <PlusIcon />
                                    <span className="ml-2">Add Trip</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination for Desktop */}
                    {trips.length > 0 && totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-700">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, sortedTrips.length)}</span> of{' '}
                                    <span className="font-medium">{sortedTrips.length}</span> results
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
                {trips.length > 0 && totalPages > 1 && (
                    <div className="lg:hidden mt-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-slate-700">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {sortedTrips.length} total trips
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
                {showViewModal && viewTrip && (
                    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Trip Details</h2>
                                        <p className="text-slate-600">Complete information for {viewTrip.customer_name || 'Trip'}</p>
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
                                {/* Trip Overview */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <TruckIcon />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold text-slate-900">{viewTrip.customer_name || 'Unnamed Customer'}</h3>
                                            <p className="text-slate-600">{viewTrip.destination || 'No destination'} • {viewTrip.vehicle?.plate_number || 'No vehicle'}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                                {formatCurrency(viewTrip.amount_billed)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Information Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Trip Information</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Customer:</span>
                                                    <span className="text-slate-900 font-semibold">{viewTrip.customer_name || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Month/Year:</span>
                                                    <span className="text-slate-900">{viewTrip.month_year || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Department:</span>
                                                    <span className="text-slate-900">{viewTrip.department || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Vehicle:</span>
                                                    <span className="text-slate-900">{viewTrip.vehicle?.plate_number || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Destination:</span>
                                                    <span className="text-slate-900">{viewTrip.destination || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Trip Dates</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">From Date:</span>
                                                    <span className="text-slate-900">{formatDate(viewTrip.date_from || null)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">To Date:</span>
                                                    <span className="text-slate-900">{formatDate(viewTrip.date_to || null)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 font-medium block mb-1">Particular:</span>
                                                    <span className="text-slate-900">{viewTrip.particular || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Financial Details</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Total Allowance:</span>
                                                    <span className="text-slate-900 font-semibold">{formatCurrency(viewTrip.total_allowance)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Driver's Networth:</span>
                                                    <span className="text-slate-900">{formatCurrency(viewTrip.drivers_networth)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Amount Billed:</span>
                                                    <span className="text-green-600 font-semibold">{formatCurrency(viewTrip.amount_billed)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">VAT (12%):</span>
                                                    <span className="text-slate-900">{formatCurrency(viewTrip.vat_12_percent)}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2">
                                                    <span className="text-slate-600 font-medium">Total Amount:</span>
                                                    <span className="text-slate-900 font-bold text-lg">{formatCurrency(viewTrip.total_amount)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Status & Invoice</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Status 1:</span>
                                                    <span className="text-slate-900">{viewTrip.status_1 || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Status 2:</span>
                                                    <span className="text-slate-900">{viewTrip.status_2 || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Service Invoice:</span>
                                                    <span className="text-slate-900">{viewTrip.service_invoice || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Created:</span>
                                                    <span className="text-slate-900">{formatDate(viewTrip.created_at)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Last Updated:</span>
                                                    <span className="text-slate-900">{formatDate(viewTrip.updated_at)}</span>
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
                                            setEditingTrip(viewTrip);
                                            setIsModalOpen(true);
                                        }}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <EditIcon />
                                        <span className="ml-2">Edit Trip</span>
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
                editingTrip={editingTrip}
            />
            </div>
        </div>
    );
};

export default DailyTrips;
