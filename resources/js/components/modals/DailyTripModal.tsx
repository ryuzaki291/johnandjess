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
            total_allowance: formData.total_allowance ? Number(formData.total_allowance) : undefined,
            drivers_networth: formData.drivers_networth ? Number(formData.drivers_networth) : undefined,
            amount_billed: formData.amount_billed ? Number(formData.amount_billed) : undefined,
            vat_12_percent: formData.vat_12_percent ? Number(formData.vat_12_percent) : undefined,
            contract_amount: formData.contract_amount ? Number(formData.contract_amount) : undefined,
            less_5_ewt: formData.less_5_ewt ? Number(formData.less_5_ewt) : undefined,
            final_amount: formData.final_amount ? Number(formData.final_amount) : undefined,
            total_amount: formData.total_amount ? Number(formData.total_amount) : undefined,
            suppliers_amount: formData.suppliers_amount ? Number(formData.suppliers_amount) : undefined,
            drivers_salary: formData.drivers_salary ? Number(formData.drivers_salary) : undefined,
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

                        {/* Vehicle Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vehicle Type
                            </label>
                            <input
                                type="text"
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter vehicle type"
                            />
                            {errors.vehicle_type && (
                                <p className="text-red-500 text-xs mt-1">{errors.vehicle_type[0]}</p>
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

                        {/* Vehicle Owner */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vehicle Owner
                            </label>
                            <input
                                type="text"
                                name="vehicle_owner"
                                value={formData.vehicle_owner}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter vehicle owner"
                            />
                            {errors.vehicle_owner && (
                                <p className="text-red-500 text-xs mt-1">{errors.vehicle_owner[0]}</p>
                            )}
                        </div>

                        {/* Unit/Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit/Brand
                            </label>
                            <input
                                type="text"
                                name="vehicle_brand"
                                value={formData.vehicle_brand}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter vehicle brand"
                            />
                            {errors.vehicle_brand && (
                                <p className="text-red-500 text-xs mt-1">{errors.vehicle_brand[0]}</p>
                            )}
                        </div>

                        {/* Company Assigned */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Assigned
                            </label>
                            <input
                                type="text"
                                name="company_assigned"
                                value={formData.company_assigned}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter company assigned"
                            />
                            {errors.company_assigned && (
                                <p className="text-red-500 text-xs mt-1">{errors.company_assigned[0]}</p>
                            )}
                        </div>

                        {/* Location/Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location/Area
                            </label>
                            <input
                                type="text"
                                name="location_area"
                                value={formData.location_area}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter location or area"
                            />
                            {errors.location_area && (
                                <p className="text-red-500 text-xs mt-1">{errors.location_area[0]}</p>
                            )}
                        </div>

                        {/* Driver's Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Driver's Name
                            </label>
                            <input
                                type="text"
                                name="drivers_name"
                                value={formData.drivers_name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter driver's name"
                            />
                            {errors.drivers_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.drivers_name[0]}</p>
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

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.start_date && (
                                <p className="text-red-500 text-xs mt-1">{errors.start_date[0]}</p>
                            )}
                        </div>

                        {/* Total Allowance */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Allowance
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="total_allowance"
                                value={formData.total_allowance}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.total_allowance && (
                                <p className="text-red-500 text-xs mt-1">{errors.total_allowance[0]}</p>
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

                        {/* Contract Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contract Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="contract_amount"
                                value={formData.contract_amount}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.contract_amount && (
                                <p className="text-red-500 text-xs mt-1">{errors.contract_amount[0]}</p>
                            )}
                        </div>

                        {/* Less 5% EWT */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Less 5% EWT
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="less_5_ewt"
                                value={formData.less_5_ewt}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.less_5_ewt && (
                                <p className="text-red-500 text-xs mt-1">{errors.less_5_ewt[0]}</p>
                            )}
                        </div>

                        {/* Final Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Final Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="final_amount"
                                value={formData.final_amount}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.final_amount && (
                                <p className="text-red-500 text-xs mt-1">{errors.final_amount[0]}</p>
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

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks
                            </label>
                            <input
                                type="text"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter remarks"
                            />
                            {errors.remarks && (
                                <p className="text-red-500 text-xs mt-1">{errors.remarks[0]}</p>
                            )}
                        </div>

                        {/* Supplier's Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Supplier's Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="suppliers_amount"
                                value={formData.suppliers_amount}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.suppliers_amount && (
                                <p className="text-red-500 text-xs mt-1">{errors.suppliers_amount[0]}</p>
                            )}
                        </div>

                        {/* Driver's Salary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Driver's Salary
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="drivers_salary"
                                value={formData.drivers_salary}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.drivers_salary && (
                                <p className="text-red-500 text-xs mt-1">{errors.drivers_salary[0]}</p>
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

                        {/* Additional Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Remarks
                            </label>
                            <input
                                type="text"
                                name="additional_remarks"
                                value={formData.additional_remarks}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter additional remarks"
                            />
                            {errors.additional_remarks && (
                                <p className="text-red-500 text-xs mt-1">{errors.additional_remarks[0]}</p>
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
