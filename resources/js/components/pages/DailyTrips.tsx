import React, { useState } from 'react';

const DailyTrips: React.FC = () => {
    const [trips] = useState([
        { id: 1, date: '2025-08-23', vehicle: 'ABC-123', driver: 'John Doe', route: 'Manila to Quezon City', distance: '25km', status: 'Completed' },
        { id: 2, date: '2025-08-23', vehicle: 'XYZ-456', driver: 'Jane Smith', route: 'Makati to BGC', distance: '15km', status: 'In Progress' },
        { id: 3, date: '2025-08-22', vehicle: 'DEF-789', driver: 'Mike Johnson', route: 'Pasig to Ortigas', distance: '10km', status: 'Completed' },
    ]);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Daily Trips</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto">
                    Add Trip
                </button>
            </div>

            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
                {trips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-lg shadow p-4 border">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{trip.vehicle}</h3>
                                <p className="text-sm text-gray-600">{trip.date}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                trip.status === 'Completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {trip.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-gray-500">Driver: </span>
                                <span className="text-gray-900">{trip.driver}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">Route: </span>
                                <span className="text-gray-900">{trip.route}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">Distance: </span>
                                <span className="text-gray-900">{trip.distance}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
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
                                    Route
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Distance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {trips.map((trip) => (
                                <tr key={trip.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {trip.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {trip.vehicle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {trip.driver}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {trip.route}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {trip.distance}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            trip.status === 'Completed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {trip.status}
                                        </span>
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

export default DailyTrips;
