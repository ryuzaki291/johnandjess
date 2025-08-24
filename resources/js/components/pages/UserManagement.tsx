import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Helper function to get CSRF token
const getCsrfToken = (): string | null => {
    const token = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return token ? token.content : null;
};

// SVG Icons
const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const AdminIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const ManagerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const UserDetailIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const RoleIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at?: string;
}

interface UserFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
}

interface UserManagementProps {
    token: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ token }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewUser, setViewUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user'
    });
    const [formErrors, setFormErrors] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'created_at' | 'updated_at'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const itemsPerPage = 10;

    useEffect(() => {
        console.log('UserManagement mounted with token:', token); // Debug log
        fetchUsers();
    }, []);

    const handleView = (user: User) => {
        setViewUser(user);
        setShowViewModal(true);
    };

    // Sorting and pagination functions
    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
        // Primary sort by created date
        const aCreated = new Date(a.created_at || 0);
        const bCreated = new Date(b.created_at || 0);
        
        // Secondary sort by updated date if available
        const aUpdated = new Date(a.updated_at || a.created_at || 0);
        const bUpdated = new Date(b.updated_at || b.created_at || 0);
        
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

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = sortedUsers.slice(startIndex, endIndex);

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

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();
            console.log('API Response:', data); // Debug log
            
            if (data.success) {
                setUsers(data.users || []);
            } else {
                setError(data.message || 'Failed to fetch users');
            }
        } catch (err) {
            console.error('Fetch error:', err); // Debug log
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setModalMode('create');
        setSelectedUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'user'
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEdit = (user: User) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.role
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDelete = async (user: User) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
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
            const response = await fetch(`/api/users/${user.id}`, {
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
                setUsers(users.filter(u => u.id !== user.id));
                // Reset to first page if current page becomes empty
                const remainingUsers = users.length - 1;
                const maxPage = Math.ceil(remainingUsers / itemsPerPage);
                if (currentPage > maxPage && maxPage > 0) {
                    setCurrentPage(maxPage);
                }
                setError(null);
                
                // Show success alert
                await Swal.fire({
                    title: 'Deleted!',
                    text: `User "${user.name}" has been deleted successfully.`,
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
                    text: data.message || 'Failed to delete user',
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
                title: 'Delete Failed!',
                text: 'An error occurred while deleting the user',
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

        const url = modalMode === 'create' ? '/api/users' : `/api/users/${selectedUser?.id}`;
        const method = modalMode === 'create' ? 'POST' : 'PUT';

        console.log('Submitting form data:', formData); // Debug log
        console.log('Using CSRF token:', csrfToken ? 'CSRF token exists' : 'No CSRF token');

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
            console.log('API response:', data); // Debug log

            if (data.success) {
                if (modalMode === 'create') {
                    setUsers([data.user, ...users]);
                } else {
                    setUsers(users.map(u => u.id === data.user.id ? data.user : u));
                }
                setShowModal(false);
                setError(null);
                
                // Show success alert
                await Swal.fire({
                    title: modalMode === 'create' ? 'User Created!' : 'User Updated!',
                    text: `User "${data.user.name}" has been ${modalMode === 'create' ? 'created' : 'updated'} successfully.`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl',
                    }
                });
            } else {
                if (data.errors) {
                    setFormErrors(data.errors);
                } else {
                    await Swal.fire({
                        title: 'Operation Failed!',
                        text: data.message || 'An error occurred',
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
            console.error('Submit error:', err); // Debug log
            await Swal.fire({
                title: 'Network Error!',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors((prev: any) => ({ ...prev, [name]: null }));
        }
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'manager': return 'bg-blue-100 text-blue-800';
            case 'user': return 'bg-slate-100 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getRoleStats = () => {
        const adminCount = users.filter(u => u.role === 'admin').length;
        const managerCount = users.filter(u => u.role === 'manager').length;
        const userCount = users.filter(u => u.role === 'user').length;
        const today = new Date().toDateString();
        const newToday = users.filter(u => new Date(u.created_at).toDateString() === today).length;

        return { adminCount, managerCount, userCount, newToday };
    };

    const stats = getRoleStats();

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading users...</p>
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
                            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                            <p className="text-slate-600">Manage and track your system users</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                            <button 
                                onClick={fetchUsers}
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
                                <span className="ml-2">Add New User</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                            <UsersIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Users</p>
                            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                            <p className="text-xs text-slate-500 mt-1">All users</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                            <AdminIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Admins</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.adminCount}</p>
                            <p className="text-xs text-slate-500 mt-1">Admin users</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                            <ManagerIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Managers</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.managerCount}</p>
                            <p className="text-xs text-slate-500 mt-1">Manager users</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-50 text-green-600">
                            <CalendarIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">New Today</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.newToday}</p>
                            <p className="text-xs text-slate-500 mt-1">Today's signups</p>
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
                                placeholder="Search users by name, email, or role..."
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
                                onClick={fetchUsers}
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
                {currentUsers.map((user) => (
                    <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                    {user.role}
                                </span>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-500">User ID:</span>
                                    <span className="text-sm text-slate-900">#{user.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-500">Joined:</span>
                                    <span className="text-sm text-slate-900">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => handleView(user)}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <EyeIcon />
                                    <span className="ml-1">View</span>
                                </button>
                                <button 
                                    onClick={() => handleEdit(user)}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <EditIcon />
                                    <span className="ml-1">Edit</span>
                                </button>
                                <button 
                                    onClick={() => handleDelete(user)}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <DeleteIcon />
                                    <span className="ml-1">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {currentUsers.length === 0 && !loading && users.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <UsersIcon />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
                        <p className="text-slate-500 mb-6">Get started by adding your first user.</p>
                        <button 
                            onClick={handleCreate}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <PlusIcon />
                            <span className="ml-2">Add User</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                            <p className="text-sm text-slate-500">Manage and track your system users</p>
                        </div>
                        <div className="text-sm text-slate-500">
                            Showing {startIndex + 1}-{Math.min(endIndex, sortedUsers.length)} of {sortedUsers.length} users
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    User Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Joined Date</span>
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
                            {currentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">#{user.id}</div>
                                            <div className="text-lg font-semibold text-slate-900">{user.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-500">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button 
                                                onClick={() => handleView(user)}
                                                className="inline-flex items-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                                title="View Details"
                                            >
                                                <EyeIcon />
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(user)}
                                                className="inline-flex items-center p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                title="Edit User"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user)}
                                                className="inline-flex items-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                title="Delete User"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {currentUsers.length === 0 && !loading && users.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <UsersIcon />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
                            <p className="text-slate-500 mb-6">Get started by adding your first user.</p>
                            <button 
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <PlusIcon />
                                <span className="ml-2">Add User</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination for Desktop */}
                {users.length > 0 && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-700">
                                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, sortedUsers.length)}</span> of{' '}
                                <span className="font-medium">{sortedUsers.length}</span> results
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
            {users.length > 0 && totalPages > 1 && (
                <div className="lg:hidden mt-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-slate-700">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="text-sm text-slate-500">
                                {sortedUsers.length} total users
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <ChevronLeftIcon />
                                <span className="ml-2">Previous</span>
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
                                <span className="mr-2">Next</span>
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-slate-900">
                                    {modalMode === 'create' ? 'Add New User' : 'Edit User'}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                    disabled={submitting}
                                >
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500"
                                    placeholder="Enter full name"
                                    required
                                />
                                {formErrors.name && (
                                    <p className="mt-2 text-sm text-red-600">{formErrors.name[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500"
                                    placeholder="Enter email address"
                                    required
                                />
                                {formErrors.email && (
                                    <p className="mt-2 text-sm text-red-600">{formErrors.email[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password {modalMode === 'edit' && <span className="text-slate-500 font-normal">(leave blank to keep current)</span>}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500"
                                    placeholder="Enter password"
                                    required={modalMode === 'create'}
                                />
                                {formErrors.password && (
                                    <p className="mt-2 text-sm text-red-600">{formErrors.password[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500"
                                    placeholder="Confirm password"
                                    required={modalMode === 'create' || formData.password !== ''}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                >
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {formErrors.role && (
                                    <p className="mt-2 text-sm text-red-600">{formErrors.role[0]}</p>
                                )}
                            </div>

                            <div className="flex space-x-4 pt-4 border-t border-slate-200">
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
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                                        </div>
                                    ) : (
                                        modalMode === 'create' ? 'Create User' : 'Update User'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && viewUser && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">User Details</h2>
                                    <p className="text-slate-600">Complete information for {viewUser.name}</p>
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
                            {/* User Overview */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <UserDetailIcon />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-slate-900">{viewUser.name}</h3>
                                        <p className="text-slate-600">User ID: #{viewUser.id}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <EmailIcon />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-slate-500">Email Address</p>
                                            <p className="text-slate-900">{viewUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <RoleIcon />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-slate-500">Role</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(viewUser.role)}`}>
                                                {viewUser.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6">
                                <h4 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Full Name</p>
                                            <p className="text-slate-900 font-medium">{viewUser.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Email Address</p>
                                            <p className="text-slate-900">{viewUser.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">User Role</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(viewUser.role)}`}>
                                                {viewUser.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">User ID</p>
                                            <p className="text-slate-900 font-mono">#{viewUser.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Date Joined</p>
                                            <p className="text-slate-900">{new Date(viewUser.created_at).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                        </div>
                                        {viewUser.updated_at && (
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">Last Updated</p>
                                                <p className="text-slate-900">{new Date(viewUser.updated_at).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Role Permissions */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6">
                                <h4 className="text-lg font-semibold text-slate-900 mb-4">Role & Permissions</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">Current Role</p>
                                        <div className="flex items-center">
                                            <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getRoleColor(viewUser.role)}`}>
                                                {viewUser.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">Role Description</p>
                                        <p className="text-slate-700">
                                            {viewUser.role === 'admin' && 'Full system access with all administrative privileges.'}
                                            {viewUser.role === 'manager' && 'Management access with ability to oversee operations and users.'}
                                            {viewUser.role === 'user' && 'Standard user access with basic system functionality.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedUser(viewUser);
                                    setFormData({
                                        name: viewUser.name,
                                        email: viewUser.email,
                                        password: '',
                                        password_confirmation: '',
                                        role: viewUser.role
                                    });
                                    setModalMode('edit');
                                    setShowModal(true);
                                }}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <EditIcon />
                                <span className="ml-2">Edit User</span>
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
            )}
        </div>
    );
};

export default UserManagement;