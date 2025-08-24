import React, { useState, useEffect } from 'react';

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

    const fetchIncidents = async () => {
        try {
            const response = await fetch('/api/incident-reports');
            const data = await response.json();
            
            if (data.success) {
                setIncidents(data.data);
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
                setMessage({ 
                    type: 'success', 
                    text: editingIncident ? 'Incident report updated successfully' : 'Incident report created successfully' 
                });
                closeModal();
                await fetchIncidents();
            } else {
                console.error('Validation errors:', data.errors);
                setMessage({ type: 'error', text: data.message || 'Failed to save incident report' });
            }
        } catch (error) {
            console.error('Error saving incident report:', error);
            setMessage({ type: 'error', text: 'Error saving incident report' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this incident report?')) {
            return;
        }

        try {
            const response = await fetch(`/api/incident-reports/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Incident report deleted successfully' });
                await fetchIncidents();
            } else {
                setMessage({ type: 'error', text: 'Failed to delete incident report' });
            }
        } catch (error) {
            console.error('Error deleting incident report:', error);
            setMessage({ type: 'error', text: 'Error deleting incident report' });
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
            <div className="p-4 sm:p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-6"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Incident Reports</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto"
                >
                    Report New Incident
                </button>
            </div>

            {/* Message Display */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                    <button 
                        onClick={() => setMessage(null)}
                        className="float-right text-xl leading-none"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                            <span className="text-xl sm:text-2xl">📋</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Total</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalIncidents}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                            <span className="text-xl sm:text-2xl">🆕</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Open</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{openIncidents}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
                            <span className="text-xl sm:text-2xl">⏳</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">In Progress</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{inProgressIncidents}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-green-100">
                            <span className="text-xl sm:text-2xl">✅</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Resolved</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{resolvedIncidents}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-gray-100">
                            <span className="text-xl sm:text-2xl">🔒</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Closed</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{closedIncidents}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
                {incidents.map((incident) => (
                    <div key={incident.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900">{incident.plate_number}</h3>
                                <div className="flex flex-col space-y-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity_level)}`}>
                                        {incident.severity_level}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                                        {incident.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Date:</span> {incident.incident_date}</p>
                                <p><span className="font-medium">Time:</span> {incident.incident_time}</p>
                                <p><span className="font-medium">Type:</span> {incident.incident_type}</p>
                                <p><span className="font-medium">Location:</span> {incident.location}</p>
                                <p><span className="font-medium">Reporter:</span> {incident.reporter_name}</p>
                                {incident.estimated_cost && (
                                    <p><span className="font-medium">Est. Cost:</span> ₱{Number(incident.estimated_cost).toLocaleString()}</p>
                                )}
                            </div>
                            <div className="flex space-x-2 pt-2">
                                <button 
                                    onClick={() => openViewModal(incident)}
                                    className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    View
                                </button>
                                <button 
                                    onClick={() => openModal(incident)}
                                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(incident.id)}
                                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Incident Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reporter
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Severity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Est. Cost
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {incidents.map((incident) => (
                            <tr key={incident.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                        <div className="font-medium">{incident.incident_date}</div>
                                        <div className="text-gray-500">{incident.incident_time}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div>
                                        <div className="font-bold">{incident.plate_number}</div>
                                        <div className="text-gray-500">{incident.vehicle_type}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {incident.incident_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {incident.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>
                                        <div className="font-medium">{incident.reporter_name}</div>
                                        <div className="text-gray-400">{incident.reporter_position}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(incident.severity_level)}`}>
                                        {incident.severity_level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                                        {incident.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {incident.estimated_cost ? `₱${Number(incident.estimated_cost).toLocaleString()}` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => openViewModal(incident)}
                                        className="text-green-600 hover:text-green-900 mr-3"
                                    >
                                        View
                                    </button>
                                    <button 
                                        onClick={() => openModal(incident)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(incident.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-8 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingIncident ? 'Edit Incident Report' : 'Create New Incident Report'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Debug info for development */}
                                {editingIncident && (
                                    <div className="bg-gray-100 p-2 rounded text-xs">
                                        <strong>Debug Info:</strong><br/>
                                        Plate: {formData.plate_number}<br/>
                                        Type: {formData.incident_type}<br/>
                                        Date: {formData.incident_date}<br/>
                                        Time: {formData.incident_time}<br/>
                                        Reporter: {formData.reporter_name}
                                    </div>
                                )}
                                
                                {/* Vehicle Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vehicle Plate Number *</label>
                                    <select
                                        name="plate_number"
                                        value={formData.plate_number}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Vehicle</option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.plate_number} value={vehicle.plate_number}>
                                            {vehicle.plate_number} - {vehicle.vehicle_type} ({vehicle.vehicle_owner})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Incident Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Incident Type *</label>
                                        <input
                                            type="text"
                                            name="incident_type"
                                            value={formData.incident_type}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., Accident, Breakdown, Theft"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Severity Level *</label>
                                        <select
                                            name="severity_level"
                                            value={formData.severity_level}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Incident Description *</label>
                                    <textarea
                                        name="incident_description"
                                        value={formData.incident_description}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Date, Time, Location */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Incident Date *</label>
                                        <input
                                            type="date"
                                            name="incident_date"
                                            value={formData.incident_date}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Incident Time *</label>
                                        <input
                                            type="time"
                                            name="incident_time"
                                            value={formData.incident_time}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Reporter Information */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Reporter Name *</label>
                                        <input
                                            type="text"
                                            name="reporter_name"
                                            value={formData.reporter_name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
                                        <input
                                            type="text"
                                            name="reporter_contact"
                                            value={formData.reporter_contact}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Position/Role *</label>
                                        <input
                                            type="text"
                                            name="reporter_position"
                                            value={formData.reporter_position}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., Driver, Manager"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Damage and Cost */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Damage Description</label>
                                        <textarea
                                            name="damage_description"
                                            value={formData.damage_description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Estimated Cost (₱)</label>
                                        <input
                                            type="number"
                                            name="estimated_cost"
                                            value={formData.estimated_cost}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Status and Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Action Taken</label>
                                        <textarea
                                            name="action_taken"
                                            value={formData.action_taken}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* File Uploads */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Incident Images</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Max 5MB per image. Supports: JPEG, PNG, GIF
                                        </p>
                                        {selectedImages.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">Selected: {selectedImages.length} image(s)</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Documents</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.txt"
                                            onChange={handleDocumentChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Max 10MB per file. Supports: PDF, DOC, DOCX, TXT
                                        </p>
                                        {selectedDocuments.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">Selected: {selectedDocuments.length} document(s)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Existing Files Display for Edit Mode */}
                                {editingIncident && (editingIncident.incident_images?.length || editingIncident.incident_documents?.length) && (
                                    <div className="border-t pt-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">Existing Files</h4>
                                        
                                        {editingIncident.incident_images && editingIncident.incident_images.length > 0 && (
                                            <div className="mb-4">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Images:</h5>
                                                <div className="space-y-2">
                                                    {editingIncident.incident_images.map((imagePath, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                            <span className="text-sm text-gray-600">{imagePath.split('/').pop()}</span>
                                                            <a 
                                                                href={`/storage/${imagePath}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                                            >
                                                                View
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {editingIncident.incident_documents && editingIncident.incident_documents.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Documents:</h5>
                                                <div className="space-y-2">
                                                    {editingIncident.incident_documents.map((docPath, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                            <span className="text-sm text-gray-600">{docPath.split('/').pop()}</span>
                                                            <a 
                                                                href={`/storage/${docPath}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                                            >
                                                                Download
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Saving...' : (editingIncident ? 'Update Report' : 'Create Report')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && viewingIncident && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-8 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Incident Report Details
                                </h3>
                                <button
                                    onClick={closeViewModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Incident ID</label>
                                            <p className="mt-1 text-sm text-gray-900">#{viewingIncident.id}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(viewingIncident.status)}`}>
                                                {viewingIncident.status}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Severity Level</label>
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSeverityColor(viewingIncident.severity_level)}`}>
                                                {viewingIncident.severity_level}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Reported Date</label>
                                            <p className="mt-1 text-sm text-gray-900">{new Date(viewingIncident.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Information */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Plate Number</label>
                                            <p className="mt-1 text-sm font-bold text-gray-900">{viewingIncident.plate_number}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.vehicle_type || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Owner</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.vehicle_owner || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Incident Details */}
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Incident Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Incident Type</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.incident_type}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.location}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Incident Date</label>
                                            <p className="mt-1 text-sm text-gray-900">{viewingIncident.incident_date}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Incident Time</label>
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
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {viewingIncident.incident_images.map((imagePath, index) => (
                                                        <div key={index} className="relative">
                                                            <img 
                                                                src={`/storage/${imagePath}`} 
                                                                alt={`Incident image ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded border"
                                                                onError={(e) => {
                                                                    console.error('Failed to load image:', `/storage/${imagePath}`);
                                                                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" fill="%236b7280" font-size="12">Image Error</text></svg>';
                                                                }}
                                                                onLoad={() => {
                                                                    console.log('Successfully loaded image:', `/storage/${imagePath}`);
                                                                }}
                                                            />
                                                            <a 
                                                                href={`/storage/${imagePath}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    console.log('Opening image:', `/storage/${imagePath}`);
                                                                }}
                                                            >
                                                                <span className="text-sm font-medium">View</span>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {viewingIncident.incident_documents && viewingIncident.incident_documents.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Documents ({viewingIncident.incident_documents.length})</h5>
                                                <div className="space-y-2">
                                                    {viewingIncident.incident_documents.map((docPath, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                                                            <div className="flex items-center">
                                                                <span className="text-2xl mr-3">📄</span>
                                                                <span className="text-sm text-gray-600">{docPath.split('/').pop()}</span>
                                                            </div>
                                                            <a 
                                                                href={`/storage/${docPath}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                                onClick={(e) => {
                                                                    console.log('Downloading document:', `/storage/${docPath}`);
                                                                }}
                                                            >
                                                                Download
                                                            </a>
                                                        </div>
                                                    ))}
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
