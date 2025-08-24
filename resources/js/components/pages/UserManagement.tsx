import React, { useState, useEffect } from 'react';

// Helper function to get CSRF token
const getCsrfToken = (): string | null => {
    const token = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return token ? token.content : null;
};

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
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

    useEffect(() => {
        console.log('UserManagement mounted with token:', token); // Debug log
        fetchUsers();
    }, []);

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
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
            return;
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            setError('CSRF token missing. Please refresh the page.');
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
                setError(null);
            } else {
                setError(data.message || 'Failed to delete user');
            }
        } catch (err) {
            setError('Error deleting user');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            setError('CSRF token missing. Please refresh the page.');
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
            } else {
                if (data.errors) {
                    setFormErrors(data.errors);
                } else {
                    setError(data.message || 'Operation failed');
                }
            }
        } catch (err) {
            console.error('Submit error:', err); // Debug log
            setError('Error submitting form');
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
            default: return 'bg-gray-100 text-gray-800';
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
            <div className="p-4 sm:p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 sm:h-32 w-16 sm:w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
                <button 
                    onClick={handleCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto"
                >
                    Add User
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                            <span className="text-xl sm:text-2xl">👥</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                            <span className="text-xl sm:text-2xl">👑</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Admins</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.adminCount}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                            <span className="text-xl sm:text-2xl">👔</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Managers</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.managerCount}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
                            <span className="text-xl sm:text-2xl">📅</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">New Today</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.newToday}</p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
                    {error}
                    <button 
                        onClick={fetchUsers}
                        className="ml-4 text-sm underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
                {users.map((user) => (
                    <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">ID:</span> #{user.id}</p>
                                <p><span className="font-medium">Email:</span> {user.email}</p>
                                <p><span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-2 pt-2">
                                <button 
                                    onClick={() => handleEdit(user)}
                                    className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(user)}
                                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {users.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No users found. Click "Add User" to create your first user.
                    </div>
                )}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{user.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => handleEdit(user)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No users found. Click "Add User" to create your first user.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 text-center">
                                {modalMode === 'create' ? 'Add New User' : 'Edit User'}
                            </h3>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.name[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.email[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password {modalMode === 'edit' && '(leave blank to keep current)'}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required={modalMode === 'create'}
                                    />
                                    {formErrors.password && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.password[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required={modalMode === 'create' || formData.password !== ''}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {formErrors.role && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.role[0]}</p>
                                    )}
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Update'}
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

export default UserManagement;