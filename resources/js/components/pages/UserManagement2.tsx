import React, { useState, useEffect } from 'react';

interface UserManagementProps {
    token: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ token }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (userId: number) => {
        // Simple role assignment based on user ID for demo
        if (userId === 1) return { color: 'bg-purple-100 text-purple-800', role: 'Admin' };
        if (userId === 2) return { color: 'bg-blue-100 text-blue-800', role: 'Manager' };
        return { color: 'bg-gray-100 text-gray-800', role: 'User' };
    };

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
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto">
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
                        <div className="p-2 sm:p-3 rounded-full bg-green-100">
                            <span className="text-xl sm:text-2xl">✅</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Active Users</p>
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
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">1</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
                            <span className="text-xl sm:text-2xl">📅</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">New Today</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
                {users.map((user) => {
                    const roleInfo = getRoleColor(user.id);
                    return (
                        <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                                        {roleInfo.role}
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">ID:</span> #{user.id}</p>
                                    <p><span className="font-medium">Email:</span> {user.email}</p>
                                    <p><span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-2 pt-2">
                                    <button className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium">
                                        Edit
                                    </button>
                                    <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {users.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No users found
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
                        {users.map((user) => {
                            const roleInfo = getRoleColor(user.id);
                            return (
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
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleInfo.color}`}>
                                            {roleInfo.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;