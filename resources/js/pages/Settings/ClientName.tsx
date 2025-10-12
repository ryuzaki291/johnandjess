import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface ClientName {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: ClientName[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    clientNames: PaginatedData;
}

const ClientNameSettings: React.FC<Props> = ({ clientNames: initialData }) => {
    const [clientNames, setClientNames] = useState<ClientName[]>(initialData.data);
    const [currentPage, setCurrentPage] = useState(initialData.current_page);
    const [lastPage] = useState(initialData.last_page);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientName | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
        is_default: false,
    });

    const fetchClientNames = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/client-names?page=${page}`);
            const data = await response.json();
            setClientNames(data.data);
            setCurrentPage(data.current_page);
        } catch (error) {
            console.error('Error fetching client names:', error);
            Swal.fire('Error', 'Failed to fetch client names', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (client?: ClientName) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                description: client.description || '',
                is_active: client.is_active,
                is_default: client.is_default,
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '',
                description: '',
                is_active: true,
                is_default: false,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
        setFormData({
            name: '',
            description: '',
            is_active: true,
            is_default: false,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const url = editingClient 
                ? `/api/client-names/${editingClient.id}`
                : '/api/client-names';
            
            const method = editingClient ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success', data.message, 'success');
                closeModal();
                fetchClientNames(currentPage);
            } else {
                throw new Error(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving client name:', error);
            Swal.fire('Error', error instanceof Error ? error.message : 'Failed to save client name', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (client: ClientName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${client.name}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                const response = await fetch(`/api/client-names/${client.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                    },
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Deleted!', data.message, 'success');
                    fetchClientNames(currentPage);
                } else {
                    throw new Error(data.message || 'Delete failed');
                }
            } catch (error) {
                console.error('Error deleting client name:', error);
                Swal.fire('Error', error instanceof Error ? error.message : 'Failed to delete client name', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleActive = async (client: ClientName) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/client-names/${client.id}/toggle-active`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success', data.message, 'success');
                fetchClientNames(currentPage);
            } else {
                throw new Error(data.message || 'Toggle failed');
            }
        } catch (error) {
            console.error('Error toggling client status:', error);
            Swal.fire('Error', error instanceof Error ? error.message : 'Failed to update client status', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefault = async (client: ClientName) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/client-names/${client.id}/set-default`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success', data.message, 'success');
                fetchClientNames(currentPage);
            } else {
                throw new Error(data.message || 'Set default failed');
            }
        } catch (error) {
            console.error('Error setting default client:', error);
            Swal.fire('Error', error instanceof Error ? error.message : 'Failed to set default client', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage) {
            fetchClientNames(page);
        }
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Client Name Management</h1>
                            <button
                                onClick={() => openModal()}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                disabled={loading}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Client Name
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Default
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {clientNames.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{client.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {client.description || 'No description'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    client.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {client.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {client.is_default && (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    Default
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(client.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openModal(client)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    disabled={loading}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(client)}
                                                    className={`${
                                                        client.is_active
                                                            ? 'text-red-600 hover:text-red-900'
                                                            : 'text-green-600 hover:text-green-900'
                                                    }`}
                                                    disabled={loading}
                                                >
                                                    {client.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                                {!client.is_default && (
                                                    <button
                                                        onClick={() => handleSetDefault(client)}
                                                        className="text-purple-600 hover:text-purple-900"
                                                        disabled={loading}
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(client)}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={loading}
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

                    {/* Pagination */}
                    {lastPage > 1 && (
                        <div className="px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {lastPage}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === lastPage || loading}
                                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editingClient ? 'Edit Client Name' : 'Add Client Name'}
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Active</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_default}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Set as Default</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClientNameSettings;