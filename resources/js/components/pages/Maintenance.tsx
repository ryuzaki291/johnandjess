import React, { useState } from 'react';

const Maintenance: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'drivers' | 'main'>('drivers');
    
    const [driversMaintenanceRecords] = useState([
        { id: 1, driver: 'John Doe', license: 'LIC-001', medical: '2025-12-15', training: '2025-10-20', status: 'Valid', nextDue: '2025-10-20' },
        { id: 2, driver: 'Jane Smith', license: 'LIC-002', medical: '2025-11-30', training: '2025-09-15', status: 'Expiring Soon', nextDue: '2025-09-15' },
        { id: 3, driver: 'Bob Wilson', license: 'LIC-003', medical: '2026-01-10', training: '2026-01-05', status: 'Valid', nextDue: '2026-01-05' },
    ]);

    const [mainMaintenanceRecords] = useState([
        { id: 1, vehicle: 'ABC-123', type: 'Oil Change', date: '2025-08-20', cost: '₱2,500', status: 'Completed', nextDue: '2025-11-20' },
        { id: 2, vehicle: 'XYZ-456', type: 'Tire Replacement', date: '2025-08-23', cost: '₱15,000', status: 'In Progress', nextDue: '2026-08-23' },
        { id: 3, vehicle: 'DEF-789', type: 'Engine Tune-up', date: '2025-08-15', cost: '₱8,000', status: 'Completed', nextDue: '2026-02-15' },
    ]);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Maintenance Management</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto">
                    {activeTab === 'drivers' ? 'Schedule Driver Maintenance' : 'Schedule Maintenance'}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('drivers')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'drivers'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Drivers Maintenance
                    </button>
                    <button
                        onClick={() => setActiveTab('main')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'main'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Main Maintenance
                    </button>
                </nav>
            </div>

            {/* Summary Cards */}
            {activeTab === 'drivers' ? (
                // Drivers Summary Cards
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-green-100">
                                <span className="text-xl sm:text-2xl">✅</span>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Valid Licenses</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">2</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
                                <span className="text-xl sm:text-2xl">⚠️</span>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Expiring Soon</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">1</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                                <span className="text-xl sm:text-2xl">👥</span>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Drivers</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Main Maintenance Summary Cards
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-green-100">
                                <span className="text-xl sm:text-2xl">✅</span>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Completed</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">2</p>
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
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">1</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-red-100">
                                <span className="text-xl sm:text-2xl">🔧</span>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Cost</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">₱25,500</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
                {activeTab === 'drivers' ? (
                    driversMaintenanceRecords.map((record) => (
                        <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-900">{record.driver}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        record.status === 'Valid' ? 'bg-green-100 text-green-800' :
                                        record.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {record.status}
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">License:</span> {record.license}</p>
                                    <p><span className="font-medium">Medical:</span> {record.medical}</p>
                                    <p><span className="font-medium">Training:</span> {record.training}</p>
                                    <p><span className="font-medium">Next Due:</span> {record.nextDue}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    mainMaintenanceRecords.map((record) => (
                        <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-900">{record.vehicle}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        record.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {record.status}
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Type:</span> {record.type}</p>
                                    <p><span className="font-medium">Date:</span> {record.date}</p>
                                    <p><span className="font-medium">Cost:</span> {record.cost}</p>
                                    <p><span className="font-medium">Next Due:</span> {record.nextDue}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block bg-white shadow-sm rounded-lg overflow-hidden">
                {activeTab === 'drivers' ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Driver Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    License
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Medical Expiry
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Training Expiry
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Next Due
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {driversMaintenanceRecords.map((record) => (
                                <tr key={record.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {record.driver}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.license}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.medical}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.training}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            record.status === 'Valid' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.nextDue}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cost
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Next Due
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mainMaintenanceRecords.map((record) => (
                                <tr key={record.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {record.vehicle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.cost}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            record.status === 'Completed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.nextDue}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Maintenance;
