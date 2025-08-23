import React, { useState } from 'react';

const IncidentReport: React.FC = () => {
    const [incidents] = useState([
        { id: 1, date: '2025-08-22', vehicle: 'ABC-123', driver: 'John Doe', type: 'Minor Accident', location: 'EDSA Quezon City', severity: 'Low', status: 'Resolved' },
        { id: 2, date: '2025-08-20', vehicle: 'XYZ-456', driver: 'Jane Smith', type: 'Vehicle Breakdown', location: 'Makati Ave', severity: 'Medium', status: 'In Progress' },
        { id: 3, date: '2025-08-18', vehicle: 'DEF-789', driver: 'Mike Johnson', type: 'Traffic Violation', location: 'BGC Taguig', severity: 'Low', status: 'Pending' },
    ]);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Incident Reports</h1>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto">
                    Report Incident
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-red-100">
                            <span className="text-xl sm:text-2xl">⚠️</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Total Incidents</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">3</p>
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
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">1</p>
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
                        <div className="p-2 sm:p-3 rounded-full bg-orange-100">
                            <span className="text-xl sm:text-2xl">⏸️</span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Pending</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">1</p>
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
                                <h3 className="font-semibold text-gray-900">{incident.vehicle}</h3>
                                <div className="flex flex-col space-y-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        incident.severity === 'Low' 
                                            ? 'bg-green-100 text-green-800' 
                                            : incident.severity === 'Medium'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {incident.severity}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        incident.status === 'Resolved' 
                                            ? 'bg-green-100 text-green-800' 
                                            : incident.status === 'In Progress'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-orange-100 text-orange-800'
                                    }`}>
                                        {incident.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Date:</span> {incident.date}</p>
                                <p><span className="font-medium">Driver:</span> {incident.driver}</p>
                                <p><span className="font-medium">Type:</span> {incident.type}</p>
                                <p><span className="font-medium">Location:</span> {incident.location}</p>
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
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Driver
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Severity
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
                        {incidents.map((incident) => (
                            <tr key={incident.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {incident.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {incident.vehicle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {incident.driver}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {incident.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {incident.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        incident.severity === 'Low' 
                                            ? 'bg-green-100 text-green-800' 
                                            : incident.severity === 'Medium'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {incident.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        incident.status === 'Resolved' 
                                            ? 'bg-green-100 text-green-800' 
                                            : incident.status === 'In Progress'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-orange-100 text-orange-800'
                                    }`}>
                                        {incident.status}
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

export default IncidentReport;
