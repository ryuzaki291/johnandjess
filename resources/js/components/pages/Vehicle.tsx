import React, { useState } from 'react';

const Vehicle: React.FC = () => {
    const [vehicles] = useState([
        { id: 1, plateNumber: 'ABC-123', model: 'Toyota Hiace', status: 'Active', driver: 'John Doe' },
        { id: 2, plateNumber: 'XYZ-456', model: 'Isuzu Elf', status: 'Maintenance', driver: 'Jane Smith' },
        { id: 3, plateNumber: 'DEF-789', model: 'Mitsubishi L300', status: 'Active', driver: 'Mike Johnson' },
    ]);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vehicle Management</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto">
                    Add Vehicle
                </button>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-white rounded-lg shadow p-4 border">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{vehicle.plateNumber}</h3>
                                <p className="text-sm text-gray-600">{vehicle.model}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                vehicle.status === 'Active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {vehicle.status}
                            </span>
                        </div>
                        <div className="mb-3">
                            <p className="text-sm text-gray-500">Driver</p>
                            <p className="text-sm font-medium text-gray-900">{vehicle.driver}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="flex-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium py-2 px-3 border border-indigo-600 rounded-md hover:bg-indigo-50">
                                Edit
                            </button>
                            <button className="flex-1 text-red-600 hover:text-red-900 text-sm font-medium py-2 px-3 border border-red-600 rounded-md hover:bg-red-50">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plate Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Model
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Driver
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {vehicle.plateNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vehicle.model}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            vehicle.status === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vehicle.driver}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Vehicle;
