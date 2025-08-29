import React, { useState, useEffect } from 'react';
import { DailyTrip, DailyTripFormData } from '../../types/DailyTrip';

interface DailyTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DailyTripFormData) => void;
    editingTrip?: DailyTrip | null;
}

const DailyTripModal: React.FC<DailyTripModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingTrip
}) => {
    const [formData, setFormData] = useState<DailyTripFormData>({
        month_year: '',
        department: '',
        vehicle_type: '',
        plate_number: '',
        vehicle_owner: '',
        vehicle_brand: '',
        company_assigned: '',
        location_area: '',
        drivers_name: '',
        customer_name: '',
        destination: '',
        date_from: '',
        date_to: '',
        particular: '',
        total_allowance: '',
        drivers_networth: '',
        status_1: '',
        amount_billed: '',
        vat_12_percent: '',
        contract_amount: '',
        less_5_ewt: '',
        final_amount: '',
        total_amount: '',
        remarks: '',
        suppliers_amount: '',
        drivers_salary: '',
        start_date: '',
        additional_remarks: '',
        service_invoice: '',
        status_2: ''
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (editingTrip) {
            setFormData({
                month_year: editingTrip.month_year || '',
                department: editingTrip.department || '',
                vehicle_type: editingTrip.vehicle_type || '',
                plate_number: editingTrip.plate_number || '',
                vehicle_owner: editingTrip.vehicle_owner || editingTrip.vehicle?.vehicle_owner || '',
                vehicle_brand: editingTrip.vehicle_brand || editingTrip.vehicle?.vehicle_brand || '',
                company_assigned: editingTrip.company_assigned || '',
                location_area: editingTrip.location_area || '',
                drivers_name: editingTrip.drivers_name || '',
                customer_name: editingTrip.customer_name || '',
                destination: editingTrip.destination || '',
                date_from: editingTrip.date_from || '',
                date_to: editingTrip.date_to || '',
                particular: editingTrip.particular || '',
                total_allowance: editingTrip.total_allowance || '',
                drivers_networth: editingTrip.drivers_networth || '',
                status_1: editingTrip.status_1 || '',
                amount_billed: editingTrip.amount_billed || '',
                vat_12_percent: editingTrip.vat_12_percent || '',
                contract_amount: editingTrip.contract_amount || '',
                less_5_ewt: editingTrip.less_5_ewt || '',
                final_amount: editingTrip.final_amount || '',
                total_amount: editingTrip.total_amount || '',
                remarks: editingTrip.remarks || '',
                suppliers_amount: editingTrip.suppliers_amount || '',
                drivers_salary: editingTrip.drivers_salary || '',
                start_date: editingTrip.start_date || '',
                additional_remarks: editingTrip.additional_remarks || '',
                service_invoice: editingTrip.service_invoice || '',
                status_2: editingTrip.status_2 || ''
            });
        } else {
            setFormData({
                month_year: '',
                department: '',
                vehicle_type: '',
                plate_number: '',
                vehicle_owner: '',
                vehicle_brand: '',
                company_assigned: '',
                location_area: '',
                drivers_name: '',
                customer_name: '',
                destination: '',
                date_from: '',
                date_to: '',
                particular: '',
                total_allowance: '',
                drivers_networth: '',
                status_1: '',
                amount_billed: '',
                vat_12_percent: '',
                contract_amount: '',
                less_5_ewt: '',
                final_amount: '',
                total_amount: '',
                remarks: '',
                suppliers_amount: '',
                drivers_salary: '',
                start_date: '',
                additional_remarks: '',
                service_invoice: '',
                status_2: ''
            });
        }
        setErrors({});
    }, [editingTrip, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: []
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Convert string numbers to actual numbers for numeric fields
        const processedData = {
            ...formData,
            drivers_networth: formData.drivers_networth ? Number(formData.drivers_networth) : undefined,
            amount_billed: formData.amount_billed ? Number(formData.amount_billed) : undefined,
            vat_12_percent: formData.vat_12_percent ? Number(formData.vat_12_percent) : undefined,
            total_amount: formData.total_amount ? Number(formData.total_amount) : undefined,
        };

        onSubmit(processedData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {editingTrip ? 'Edit Daily Trip' : 'Add New Daily Trip'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Month-Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Month-Year
                            </label>
                            <input
                                type="text"
                                name="month_year"
                                value={formData.month_year}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., January 2025"
                            />
                            {errors.month_year && (
                                <p className="text-red-500 text-xs mt-1">{errors.month_year[0]}</p>
                            )}
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.department && (
                                <p className="text-red-500 text-xs mt-1">{errors.department[0]}</p>
                            )}
                        </div>

                        {/* Plate Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vehicle (Plate Number)
                            </label>
                            <input
                                type="text"
                                name="plate_number"
                                value={formData.plate_number}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter plate number"
                            />
                            {errors.plate_number && (
                                <p className="text-red-500 text-xs mt-1">{errors.plate_number[0]}</p>
                            )}
                        </div>

                        {/* Customer Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.customer_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.customer_name[0]}</p>
                            )}
                        </div>

                        {/* Destination */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Destination
                            </label>
                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.destination && (
                                <p className="text-red-500 text-xs mt-1">{errors.destination[0]}</p>
                            )}
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date From
                            </label>
                            <input
                                type="date"
                                name="date_from"
                                value={formData.date_from}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.date_from && (
                                <p className="text-red-500 text-xs mt-1">{errors.date_from[0]}</p>
                            )}
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date To
                            </label>
                            <input
                                type="date"
                                name="date_to"
                                value={formData.date_to}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.date_to && (
                                <p className="text-red-500 text-xs mt-1">{errors.date_to[0]}</p>
                            )}
                        </div>

                        {/* Drivers Networth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Drivers Networth
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="drivers_networth"
                                value={formData.drivers_networth}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.drivers_networth && (
                                <p className="text-red-500 text-xs mt-1">{errors.drivers_networth[0]}</p>
                            )}
                        </div>

                        {/* Status 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status 1
                            </label>
                            <select
                                name="status_1"
                                value={formData.status_1}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            {errors.status_1 && (
                                <p className="text-red-500 text-xs mt-1">{errors.status_1[0]}</p>
                            )}
                        </div>

                        {/* Amount Billed */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount Billed
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="amount_billed"
                                value={formData.amount_billed}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.amount_billed && (
                                <p className="text-red-500 text-xs mt-1">{errors.amount_billed[0]}</p>
                            )}
                        </div>

                        {/* 12% VAT */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                12% VAT
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="vat_12_percent"
                                value={formData.vat_12_percent}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.vat_12_percent && (
                                <p className="text-red-500 text-xs mt-1">{errors.vat_12_percent[0]}</p>
                            )}
                        </div>

                        {/* Total Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="total_amount"
                                value={formData.total_amount}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.total_amount && (
                                <p className="text-red-500 text-xs mt-1">{errors.total_amount[0]}</p>
                            )}
                        </div>

                        {/* Service Invoice */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Invoice
                            </label>
                            <input
                                type="text"
                                name="service_invoice"
                                value={formData.service_invoice}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.service_invoice && (
                                <p className="text-red-500 text-xs mt-1">{errors.service_invoice[0]}</p>
                            )}
                        </div>

                        {/* Status 2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status 2
                            </label>
                            <select
                                name="status_2"
                                value={formData.status_2}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            {errors.status_2 && (
                                <p className="text-red-500 text-xs mt-1">{errors.status_2[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Particular - Full width */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Particular
                        </label>
                        <textarea
                            name="particular"
                            value={formData.particular}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter trip details..."
                        />
                        {errors.particular && (
                            <p className="text-red-500 text-xs mt-1">{errors.particular[0]}</p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {editingTrip ? 'Update' : 'Create'} Trip
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DailyTripModal;
