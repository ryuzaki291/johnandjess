import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getStorageUrl, getFallbackImageUrl, getStorageUrlWithFallback, checkImageExists } from '../../utils/assetHelper';

// Helper function to get CSRF token
const getCsrfToken = (): string | null => {
    const token = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return token ? token.content : null;
};

// SVG Icons
const IncidentIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
);

const OpenIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ProgressIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ResolvedIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClosedIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const RefreshIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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

const SortDescIcon = () => (
    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

const SortAscIcon = () => (
    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const VehicleIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6h8l2 4v5H11V9l2-3z" />
    </svg>
);

interface Vehicle {
    plate_number: string;
    vehicle_type: string;
    vehicle_owner: string;
}

interface IncidentReport {
    id: number;
    plate_number: string;
    vehicle_type: string | null;
    vehicle_owner: string | null;
    incident_type: string;
    incident_description: string;
    incident_date: string;
    incident_time: string;
    location: string;
    reporter_name: string;
    reporter_contact: string;
    reporter_position: string;
    damage_description: string | null;
    estimated_cost: number | null;
    severity_level: 'Low' | 'Medium' | 'High' | 'Critical';
    incident_images: string[] | null;
    incident_documents: string[] | null;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    action_taken: string | null;
    notes: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    vehicle?: Vehicle;
}

interface IncidentFormData {
    plate_number: string;
    incident_type: string;
    incident_description: string;
    incident_date: string;
    incident_time: string;
    location: string;
    reporter_name: string;
    reporter_contact: string;
    reporter_position: string;
    damage_description: string;
    estimated_cost: string;
    severity_level: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    action_taken: string;
    notes: string;
}

const IncidentReportPage: React.FC = () => {
    const [incidents, setIncidents] = useState<IncidentReport[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingIncident, setEditingIncident] = useState<IncidentReport | null>(null);
    const [viewingIncident, setViewingIncident] = useState<IncidentReport | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'created_at' | 'incident_date' | 'plate_number' | 'severity_level' | 'status'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const itemsPerPage = 10;

    const [formData, setFormData] = useState<IncidentFormData>({
        plate_number: '',
        incident_type: '',
        incident_description: '',
        incident_date: '',
        incident_time: '',
        location: '',
        reporter_name: '',
        reporter_contact: '',
        reporter_position: '',
        damage_description: '',
        estimated_cost: '',
        severity_level: 'Low',
        status: 'Open',
        action_taken: '',
        notes: ''
    });

    useEffect(() => {
        fetchIncidents();
        fetchVehicles();
    }, []);

    // Sorting and pagination functions
    const filteredIncidents = incidents.filter(incident =>
        (incident.plate_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (incident.incident_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (incident.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (incident.reporter_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (incident.severity_level || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (incident.status || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedIncidents = filteredIncidents.sort((a, b) => {
        let aValue, bValue;
        
        if (sortBy === 'created_at') {
            aValue = new Date(a.created_at || 0);
            bValue = new Date(b.created_at || 0);
        } else {
            aValue = new Date(a.incident_date || 0);
            bValue = new Date(b.incident_date || 0);
        }
        
        if (sortOrder === 'desc') {
            return bValue.getTime() - aValue.getTime();
        } else {
            return aValue.getTime() - bValue.getTime();
        }
    });

    const totalPages = Math.ceil(sortedIncidents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentIncidents = sortedIncidents.slice(startIndex, endIndex);
    
    // Pagination display variables
    const indexOfFirstIncident = startIndex;
    const indexOfLastIncident = endIndex;

    const handleSort = (field: 'created_at' | 'incident_date' | 'plate_number' | 'severity_level' | 'status') => {
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

    const fetchIncidents = async () => {
        try {
            const response = await fetch('/api/incident-reports');
            const data = await response.json();
            
            if (data.success) {
                setIncidents(data.data);
                setMessage(null);
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch incident reports' });
            }
        } catch (error) {
            console.error('Error fetching incident reports:', error);
            setMessage({ type: 'error', text: 'Error fetching incident reports' });
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/incident-reports-vehicles');
            const data = await response.json();
            
            if (data.success) {
                setVehicles(data.data);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const openModal = (incident?: IncidentReport) => {
        if (incident) {
            setEditingIncident(incident);
            
            // Format date properly for input field
            let formattedDate = incident.incident_date;
            if (formattedDate.includes('T')) {
                formattedDate = formattedDate.split('T')[0];
            }
            
            // Format time properly for input field (remove seconds if present)
            let formattedTime = incident.incident_time;
            if (formattedTime && formattedTime.length > 5) {
                formattedTime = formattedTime.slice(0, 5); // Take only HH:MM
            }
            
            console.log('Editing incident:', incident);
            console.log('Formatted date:', formattedDate);
            console.log('Original incident time:', incident.incident_time);
            console.log('Formatted time:', formattedTime);
            
            setFormData({
                plate_number: incident.plate_number,
                incident_type: incident.incident_type,
                incident_description: incident.incident_description,
                incident_date: formattedDate,
                incident_time: formattedTime,
                location: incident.location,
                reporter_name: incident.reporter_name,
                reporter_contact: incident.reporter_contact,
                reporter_position: incident.reporter_position,
                damage_description: incident.damage_description || '',
                estimated_cost: incident.estimated_cost?.toString() || '',
                severity_level: incident.severity_level,
                status: incident.status,
                action_taken: incident.action_taken || '',
                notes: incident.notes || ''
            });
        } else {
            setEditingIncident(null);
            setFormData({
                plate_number: '',
                incident_type: '',
                incident_description: '',
                incident_date: new Date().toISOString().split('T')[0],
                incident_time: new Date().toTimeString().slice(0, 5),
                location: '',
                reporter_name: '',
                reporter_contact: '',
                reporter_position: '',
                damage_description: '',
                estimated_cost: '',
                severity_level: 'Low',
                status: 'Open',
                action_taken: '',
                notes: ''
            });
        }
        setSelectedImages([]);
        setSelectedDocuments([]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIncident(null);
        setSelectedImages([]);
        setSelectedDocuments([]);
    };

    const openViewModal = (incident: IncidentReport) => {
        console.log('Opening view modal for incident:', incident);
        console.log('Incident images:', incident.incident_images);
        console.log('Incident documents:', incident.incident_documents);
        setViewingIncident(incident);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setViewingIncident(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedDocuments(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();
            
            // Add text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== '') {
                    submitFormData.append(key, value);
                }
            });

            // Add image files
            selectedImages.forEach((image) => {
                submitFormData.append('incident_images[]', image);
            });

            // Add document files
            selectedDocuments.forEach((document) => {
                submitFormData.append('incident_documents[]', document);
            });

            let url, method;
            
            if (editingIncident) {
                // For updates, use POST with method spoofing
                url = `/api/incident-reports/${editingIncident.id}`;
                method = 'POST';
                submitFormData.append('_method', 'PUT');
            } else {
                // For creation, use POST
                url = '/api/incident-reports';
                method = 'POST';
            }

            console.log('Submitting to:', url, 'with method:', method);
            console.log('Form data entries:');
            for (let [key, value] of submitFormData.entries()) {
                console.log(key, value);
            }

            const response = await fetch(url, {
                method,
                body: submitFormData,
            });

            const data = await response.json();
            console.log('Response:', data);

            if (data.success) {
                setMessage(null);
                closeModal();
                await fetchIncidents();
                
                // Show success alert
                await Swal.fire({
                    title: editingIncident ? 'Report Updated!' : 'Report Created!',
                    text: `Incident report has been ${editingIncident ? 'updated' : 'created'} successfully.`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl',
                    }
                });
            } else {
                console.error('Validation errors:', data.errors);
                await Swal.fire({
                    title: 'Operation Failed!',
                    text: data.message || 'Failed to save incident report',
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
            console.error('Error saving incident report:', error);
            await Swal.fire({
                title: 'Network Error!',
                text: 'An error occurred while saving the incident report',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (incident: IncidentReport) => {
        const result = await Swal.fire({
            title: 'Delete Incident Report?',
            text: `Are you sure you want to delete this incident report for "${incident.plate_number}" - "${incident.incident_type}"? This action cannot be undone.`,
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
            const response = await fetch(`/api/incident-reports/${incident.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();

            if (data.success) {
                setIncidents(incidents.filter(i => i.id !== incident.id));
                // Reset to first page if current page becomes empty
                const remainingIncidents = incidents.length - 1;
                const maxPage = Math.ceil(remainingIncidents / itemsPerPage);
                if (currentPage > maxPage && maxPage > 0) {
                    setCurrentPage(maxPage);
                }
                setMessage(null);
                
                // Show success alert
                await Swal.fire({
                    title: 'Deleted!',
                    text: `Incident report for "${incident.plate_number}" has been deleted successfully.`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl',
                    }
                });
            } else {
                await Swal.fire({
                    title: 'Delete Failed!',
                    text: data.message || 'Failed to delete incident report',
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
            console.error('Error deleting incident report:', error);
            await Swal.fire({
                title: 'Delete Failed!',
                text: 'An error occurred while deleting the incident report',
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

    // Calculate summary statistics
    const totalIncidents = incidents.length;
    const openIncidents = incidents.filter(i => i.status === 'Open').length;
    const inProgressIncidents = incidents.filter(i => i.status === 'In Progress').length;
    const resolvedIncidents = incidents.filter(i => i.status === 'Resolved').length;
    const closedIncidents = incidents.filter(i => i.status === 'Closed').length;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Low': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading incident reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Incident Reports</h1>
                            <p className="text-slate-600">Manage and track vehicle incident reports</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                            <button 
                                onClick={fetchIncidents}
                                className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                            >
                                <RefreshIcon />
                                <span className="ml-2">Refresh</span>
                            </button>
                            <button 
                                onClick={() => openModal()}
                                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <PlusIcon />
                                <span className="ml-2">Report New Incident</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                            <IncidentIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Incidents</p>
                            <p className="text-2xl font-bold text-slate-900">{totalIncidents}</p>
                            <p className="text-xs text-slate-500 mt-1">All incidents</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                            <OpenIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Open</p>
                            <p className="text-2xl font-bold text-slate-900">{openIncidents}</p>
                            <p className="text-xs text-slate-500 mt-1">New reports</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                            <ProgressIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">In Progress</p>
                            <p className="text-2xl font-bold text-slate-900">{inProgressIncidents}</p>
                            <p className="text-xs text-slate-500 mt-1">Being handled</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-50 text-green-600">
                            <ResolvedIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Resolved</p>
                            <p className="text-2xl font-bold text-slate-900">{resolvedIncidents}</p>
                            <p className="text-xs text-slate-500 mt-1">Fixed issues</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-slate-50 text-slate-600">
                            <ClosedIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Closed</p>
                            <p className="text-2xl font-bold text-slate-900">{closedIncidents}</p>
                            <p className="text-xs text-slate-500 mt-1">Completed</p>
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
                                placeholder="Search incidents by vehicle, type, location, reporter, or status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{message.text}</p>
                            <button 
                                onClick={() => setMessage(null)}
                                className="mt-2 text-sm text-red-700 underline hover:no-underline"
                            >
                                Dismiss
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
                                onClick={() => handleSort('plate_number')}
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                                    sortBy === 'plate_number'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Vehicle {sortBy === 'plate_number' && (sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-4">
                {currentIncidents.map((incident) => (
                    <div key={incident.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{incident.plate_number}</h3>
                                    <p className="text-sm text-slate-500">{incident.incident_type}</p>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(incident.severity_level)}`}>
                                        {incident.severity_level}
                                    </span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                                        {incident.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-500">Location:</span>
                                    <span className="text-sm text-slate-900">{incident.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-500">Reporter:</span>
                                    <span className="text-sm text-slate-900">{incident.reporter_name}</span>
                                </div>
                                {incident.estimated_cost && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-slate-500">Est. Cost:</span>
                                        <span className="text-sm font-semibold text-slate-900">₱{Number(incident.estimated_cost).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => openViewModal(incident)}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <EyeIcon />
                                    <span className="ml-1">View</span>
                                </button>
                                <button 
                                    onClick={() => openModal(incident)}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <EditIcon />
                                    <span className="ml-1">Edit</span>
                                </button>
                                <button 
                                    onClick={() => handleDelete(incident)}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <DeleteIcon />
                                    <span className="ml-1">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {currentIncidents.length === 0 && !loading && incidents.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <IncidentIcon />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No incidents found</h3>
                        <p className="text-slate-500 mb-6">Get started by reporting your first incident.</p>
                        <button 
                            onClick={() => openModal()}
                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <PlusIcon />
                            <span className="ml-2">Report Incident</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                <tr>
                                    <th 
                                        onClick={() => handleSort('plate_number')}
                                        className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>Vehicle</span>
                                            {sortBy === 'plate_number' && (sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />)}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Type & Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Reporter
                                    </th>
                                    <th 
                                        onClick={() => handleSort('severity_level')}
                                        className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>Severity</span>
                                            {sortBy === 'severity_level' && (sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />)}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('status')}
                                        className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>Status</span>
                                            {sortBy === 'status' && (sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />)}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Est. Cost
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {currentIncidents.map((incident, index) => (
                                    <tr key={incident.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'} hover:bg-slate-50 transition-colors duration-200`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <VehicleIcon />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900">{incident.plate_number}</div>
                                                    <div className="text-sm text-slate-500">Incident #{incident.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{incident.incident_type}</div>
                                            <div className="text-sm text-slate-500 max-w-xs truncate">{incident.location}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                                                    <UserIcon />
                                                </div>
                                                <div className="text-sm font-medium text-slate-900">{incident.reporter_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getSeverityColor(incident.severity_level)}`}>
                                                {incident.severity_level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(incident.status)}`}>
                                                {incident.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {incident.estimated_cost ? (
                                                <div className="text-sm font-bold text-slate-900">₱{Number(incident.estimated_cost).toLocaleString()}</div>
                                            ) : (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button 
                                                    onClick={() => openViewModal(incident)}
                                                    className="inline-flex items-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg transition-colors duration-200"
                                                    title="View Details"
                                                >
                                                    <EyeIcon />
                                                </button>
                                                <button 
                                                    onClick={() => openModal(incident)}
                                                    className="inline-flex items-center p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 rounded-lg transition-colors duration-200"
                                                    title="Edit Incident"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(incident)}
                                                    className="inline-flex items-center p-2 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 rounded-lg transition-colors duration-200"
                                                    title="Delete Incident"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {currentIncidents.length === 0 && !loading && incidents.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <IncidentIcon />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No incidents found</h3>
                                <p className="text-slate-500 mb-6">Get started by reporting your first incident.</p>
                                <button 
                                    onClick={() => openModal()}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    <PlusIcon />
                                    <span className="ml-2">Report Incident</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {filteredIncidents.length > itemsPerPage && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-slate-700">
                        Showing <span className="font-medium">{indexOfFirstIncident + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(indexOfLastIncident, filteredIncidents.length)}</span> of{' '}
                        <span className="font-medium">{filteredIncidents.length}</span> incidents
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                currentPage === 1
                                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                    : 'bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                            }`}
                        >
                            <ChevronLeftIcon />
                            <span className="ml-1">Previous</span>
                        </button>
                        
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                    return (
                                        <span key={page} className="px-2 text-slate-500">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                currentPage === totalPages
                                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                    : 'bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                            }`}
                        >
                            <span className="mr-1">Next</span>
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    <IncidentIcon />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {editingIncident ? 'Edit Incident Report' : 'Create New Incident Report'}
                                    </h3>
                                    <p className="text-red-100 text-sm">
                                        {editingIncident ? 'Update incident details' : 'Report a new vehicle incident'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Vehicle Selection */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <VehicleIcon />
                                        <span className="ml-2">Vehicle Information</span>
                                    </h4>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Vehicle Plate Number *
                                        </label>
                                        <select
                                            name="plate_number"
                                            value={formData.plate_number}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                        >
                                            <option value="">Select Vehicle</option>
                                            {vehicles.map((vehicle) => (
                                                <option key={vehicle.plate_number} value={vehicle.plate_number}>
                                                {vehicle.plate_number} - {vehicle.vehicle_type} ({vehicle.vehicle_owner})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Incident Information */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <IncidentIcon />
                                        <span className="ml-2">Incident Details</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Incident Type *</label>
                                            <input
                                                type="text"
                                                name="incident_type"
                                                value={formData.incident_type}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Accident, Breakdown, Theft"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Severity Level *</label>
                                            <select
                                                name="severity_level"
                                                value={formData.severity_level}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Critical">Critical</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Incident Description *</label>
                                        <textarea
                                            name="incident_description"
                                            value={formData.incident_description}
                                            onChange={handleInputChange}
                                            required
                                            rows={4}
                                            placeholder="Provide a detailed description of the incident..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Date, Time, Location */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="ml-2">When & Where</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Incident Date *</label>
                                            <input
                                                type="date"
                                                name="incident_date"
                                                value={formData.incident_date}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Incident Time *</label>
                                            <input
                                                type="time"
                                                name="incident_time"
                                                value={formData.incident_time}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Location *</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Incident location"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Reporter Information */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <UserIcon />
                                        <span className="ml-2">Reporter Information</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Reporter Name *</label>
                                            <input
                                                type="text"
                                                name="reporter_name"
                                                value={formData.reporter_name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Full name"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number *</label>
                                            <input
                                                type="text"
                                                name="reporter_contact"
                                                value={formData.reporter_contact}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Phone number"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Position/Role *</label>
                                            <input
                                                type="text"
                                                name="reporter_position"
                                                value={formData.reporter_position}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Driver, Manager"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Damage and Cost */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        <span className="ml-2">Damage & Cost Assessment</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Damage Description</label>
                                            <textarea
                                                name="damage_description"
                                                value={formData.damage_description}
                                                onChange={handleInputChange}
                                                rows={4}
                                                placeholder="Describe the damage in detail..."
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Cost (₱)</label>
                                            <input
                                                type="number"
                                                name="estimated_cost"
                                                value={formData.estimated_cost}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Status and Actions */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="ml-2">Status & Actions</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Action Taken</label>
                                            <textarea
                                                name="action_taken"
                                                value={formData.action_taken}
                                                onChange={handleInputChange}
                                                rows={4}
                                                placeholder="Describe actions taken or planned..."
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* File Uploads */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="ml-2">Attachments</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Incident Images</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-slate-400"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Max 5MB per image. Supports: JPEG, PNG, GIF
                                            </p>
                                            {selectedImages.length > 0 && (
                                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <p className="text-sm font-medium text-green-800 flex items-center">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Selected: {selectedImages.length} image(s)
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Documents</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept=".pdf,.doc,.docx,.txt"
                                                    onChange={handleDocumentChange}
                                                    className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-slate-400"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Max 10MB per file. Supports: PDF, DOC, DOCX, TXT
                                            </p>
                                            {selectedDocuments.length > 0 && (
                                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <p className="text-sm font-medium text-green-800 flex items-center">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Selected: {selectedDocuments.length} document(s)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className="ml-2">Additional Notes</span>
                                    </h4>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Add any additional information, observations, or special instructions..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    />
                                </div>

                                {/* Existing Files Display for Edit Mode */}
                                {editingIncident && (editingIncident.incident_images?.length || editingIncident.incident_documents?.length) && (
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Existing Files
                                        </h4>
                                        
                                        {editingIncident.incident_images && editingIncident.incident_images.length > 0 && (
                                            <div className="mb-6">
                                                <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Images ({editingIncident.incident_images.length})
                                                </h5>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {editingIncident.incident_images.map((imagePath, index) => {
                                                        const { url, fallbackUrl, onError } = getStorageUrlWithFallback(imagePath);
                                                        const fileName = imagePath.split('/').pop() || 'Unknown image';
                                                        
                                                        return (
                                                            <div key={index} className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden">
                                                                <img 
                                                                    src={url}
                                                                    alt={`Existing image ${index + 1}`}
                                                                    className="w-full h-24 object-cover"
                                                                    onError={onError}
                                                                />
                                                                <div className="p-2">
                                                                    <p className="text-xs text-slate-600 truncate" title={fileName}>{fileName}</p>
                                                                    <div className="flex space-x-1 mt-1">
                                                                        <a 
                                                                            href={url} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded transition-colors"
                                                                        >
                                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            </svg>
                                                                            View
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {editingIncident.incident_documents && editingIncident.incident_documents.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Documents ({editingIncident.incident_documents.length})
                                                </h5>
                                                <div className="space-y-2">
                                                    {editingIncident.incident_documents.map((docPath, index) => {
                                                        const docUrl = getStorageUrl(docPath);
                                                        const fileName = docPath.split('/').pop() || 'Unknown file';
                                                        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
                                                        
                                                        return (
                                                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-3">
                                                                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-slate-900">{fileName}</p>
                                                                        <p className="text-xs text-slate-500 uppercase">{fileExtension} file</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex space-x-2">
                                                                    <a 
                                                                        href={docUrl} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded transition-colors"
                                                                    >
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                        View
                                                                    </a>
                                                                    <a 
                                                                        href={docUrl} 
                                                                        download={fileName}
                                                                        className="inline-flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded transition-colors"
                                                                    >
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                                                                        </svg>
                                                                        Download
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="inline-flex items-center px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {editingIncident ? 'Update Report' : 'Create Report'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && viewingIncident && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    <EyeIcon />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Incident Report Details
                                    </h3>
                                    <p className="text-slate-100 text-sm">
                                        Complete incident information and attachments
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeViewModal}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Basic Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                                            <label className="block text-sm font-bold text-slate-600 mb-1">Incident ID</label>
                                            <p className="text-lg font-bold text-slate-900">#{viewingIncident.id}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                                            <label className="block text-sm font-bold text-slate-600 mb-1">Status</label>
                                            <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(viewingIncident.status)}`}>
                                                {viewingIncident.status}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                                            <label className="block text-sm font-bold text-slate-600 mb-1">Severity Level</label>
                                            <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getSeverityColor(viewingIncident.severity_level)}`}>
                                                {viewingIncident.severity_level}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                                            <label className="block text-sm font-bold text-slate-600 mb-1">Reported Date</label>
                                            <p className="text-sm font-semibold text-slate-900">{new Date(viewingIncident.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Information */}
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                    <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                        <VehicleIcon />
                                        <span className="ml-2">Vehicle Information</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                                            <label className="block text-sm font-bold text-blue-700 mb-1">Plate Number</label>
                                            <p className="text-lg font-bold text-blue-900">{viewingIncident.plate_number}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                                            <label className="block text-sm font-bold text-blue-700 mb-1">Vehicle Type</label>
                                            <p className="text-sm font-semibold text-blue-800">{viewingIncident.vehicle_type || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                                            <label className="block text-sm font-bold text-blue-700 mb-1">Owner</label>
                                            <p className="text-sm font-semibold text-blue-800">{viewingIncident.vehicle_owner || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Incident Details */}
                                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                                    <h4 className="text-lg font-bold text-red-900 mb-4 flex items-center">
                                        <IncidentIcon />
                                        <span className="ml-2">Incident Details</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white rounded-lg p-4 border border-red-200">
                                            <label className="block text-sm font-bold text-red-700 mb-1">Incident Type</label>
                                            <p className="text-sm font-semibold text-red-800">{viewingIncident.incident_type}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-red-200">
                                            <label className="block text-sm font-bold text-red-700 mb-1">Location</label>
                                            <p className="text-sm font-semibold text-red-800">{viewingIncident.location}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-red-200">
                                            <label className="block text-sm font-bold text-red-700 mb-1">Incident Date</label>
                                            <p className="text-sm font-semibold text-red-800">{viewingIncident.incident_date}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-red-200">
                                            <label className="block text-sm font-bold text-red-700 mb-1">Incident Time</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.incident_time}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">{viewingIncident.incident_description}</p>
                                    </div>
                                </div>

                                {/* Reporter Information */}
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Reporter Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Reporter Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.reporter_name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.reporter_contact}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Position/Role</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.reporter_position}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Damage Assessment */}
                                {(viewingIncident.damage_description || viewingIncident.estimated_cost) && (
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Damage Assessment</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {viewingIncident.damage_description && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700">Damage Description</label>
                                                    <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">{viewingIncident.damage_description}</p>
                                                </div>
                                            )}
                                            {viewingIncident.estimated_cost && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Estimated Cost</label>
                                                    <p className="mt-1 text-sm font-bold text-gray-900">₱{Number(viewingIncident.estimated_cost).toLocaleString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions and Follow-up */}
                                {(viewingIncident.action_taken || viewingIncident.notes) && (
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Actions & Follow-up</h4>
                                        <div className="space-y-4">
                                            {viewingIncident.action_taken && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Action Taken</label>
                                                    <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">{viewingIncident.action_taken}</p>
                                                </div>
                                            )}
                                            {viewingIncident.notes && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                                                    <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">{viewingIncident.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* File Attachments */}
                                {(viewingIncident.incident_images?.length || viewingIncident.incident_documents?.length) && (
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">File Attachments</h4>
                                        
                                        {viewingIncident.incident_images && viewingIncident.incident_images.length > 0 && (
                                            <div className="mb-4">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Images ({viewingIncident.incident_images.length})</h5>
                                                <div className="space-y-2">
                                                    {viewingIncident.incident_images.map((imagePath, index) => {
                                                        const { url, fallbackUrl, onError } = getStorageUrlWithFallback(imagePath);
                                                        const fileName = imagePath.split('/').pop() || 'Unknown image';
                                                        
                                                        return (
                                                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border hover:border-blue-300 transition-colors">
                                                                <div className="flex items-center flex-1">
                                                                    <span className="text-2xl mr-3">🖼️</span>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm text-gray-900 font-medium">{fileName}</span>
                                                                        <span className="text-xs text-gray-500 uppercase">Image file</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <a 
                                                                        href={url} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded transition-colors"
                                                                        onClick={(e) => {
                                                                            console.log('Opening image:', url);
                                                                            // Check if image exists before opening
                                                                            checkImageExists(url).then(exists => {
                                                                                if (!exists) {
                                                                                    e.preventDefault();
                                                                                    alert('Image could not be loaded. Please check the server configuration.');
                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        View
                                                                    </a>
                                                                    <a 
                                                                        href={url} 
                                                                        download={fileName}
                                                                        className="inline-flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded transition-colors"
                                                                        onClick={(e) => {
                                                                            console.log('Downloading image:', url);
                                                                        }}
                                                                    >
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                        Download
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {viewingIncident.incident_documents && viewingIncident.incident_documents.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Documents ({viewingIncident.incident_documents.length})</h5>
                                                <div className="space-y-2">
                                                    {viewingIncident.incident_documents.map((docPath, index) => {
                                                        const fileName = docPath.split('/').pop() || 'Unknown file';
                                                        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
                                                        
                                                        // Get appropriate icon based on file extension
                                                        const getFileIcon = (ext: string) => {
                                                            switch (ext) {
                                                                case 'pdf':
                                                                    return '📄';
                                                                case 'doc':
                                                                case 'docx':
                                                                    return '📝';
                                                                case 'txt':
                                                                    return '📃';
                                                                default:
                                                                    return '📁';
                                                            }
                                                        };
                                                        
                                                        return (
                                                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border hover:border-blue-300 transition-colors">
                                                                <div className="flex items-center flex-1">
                                                                    <span className="text-2xl mr-3">{getFileIcon(fileExtension)}</span>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm text-gray-900 font-medium">{fileName}</span>
                                                                        <span className="text-xs text-gray-500 uppercase">{fileExtension} file</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <a 
                                                                        href={`/storage/${docPath}`} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded transition-colors"
                                                                    >
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        View
                                                                    </a>
                                                                    <a 
                                                                        href={`/storage/${docPath}`} 
                                                                        download={fileName}
                                                                        className="inline-flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded transition-colors"
                                                                    >
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                        Download
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Timestamps */}
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Record Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Created</label>
                                            <p className="mt-1 text-sm text-gray-900">{new Date(viewingIncident.created_at).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                            <p className="mt-1 text-sm text-gray-900">{new Date(viewingIncident.updated_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                                <button
                                    onClick={closeViewModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        closeViewModal();
                                        openModal(viewingIncident);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Edit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentReportPage;
