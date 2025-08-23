import React, { useState } from 'react';

const Contracts: React.FC = () => {
    const [contracts] = useState([
        { id: 1, client: 'ABC Corporation', type: 'Monthly Service', startDate: '2025-01-01', endDate: '2025-12-31', value: '₱500,000', status: 'Active' },
        { id: 2, client: 'XYZ Company', type: 'Project-based', startDate: '2025-08-01', endDate: '2025-12-31', value: '₱250,000', status: 'Active' },
        { id: 3, client: 'DEF Industries', type: 'One-time Service', startDate: '2025-07-15', endDate: '2025-07-15', value: '₱50,000', status: 'Completed' },
    ]);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contracts</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto">
                    New Contract
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-green-100">
                            <span className="text-xl sm:text-2xl">📋</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Total Contracts</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">3</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                            <span className="text-xl sm:text-2xl">✅</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Active</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">2</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-gray-100">
                            <span className="text-xl sm:text-2xl">✔️</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Completed</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">1</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
                            <span className="text-xl sm:text-2xl">💰</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Total Value</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">₱800K</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
                {contracts.map((contract) => (
                    <div key={contract.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900">{contract.client}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    contract.status === 'Active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {contract.status}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Type:</span> {contract.type}</p>
                                <p><span className="font-medium">Start Date:</span> {contract.startDate}</p>
                                <p><span className="font-medium">End Date:</span> {contract.endDate}</p>
                                <p><span className="font-medium">Value:</span> {contract.value}</p>
                            </div>
                            <div className="flex space-x-2 pt-2">
                                <button className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium">
                                    View
                                </button>
                                <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium">
                                    Edit
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
                                Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                End Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {contracts.map((contract) => (
                            <tr key={contract.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {contract.client}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {contract.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {contract.startDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {contract.endDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {contract.value}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        contract.status === 'Active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {contract.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Contracts;
