import React, { useState, useEffect } from 'react';
import { DailyTrip, DailyTripFormData } from '../../types/DailyTrip';
import { formatPesoInput, parsePesoInput, handlePesoInput } from '../../utils/pesoFormatter';

interface DailyTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DailyTripFormData) => void;
    editingTrip?: DailyTrip | null;
}


// Helper function to format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    
    try {
        // Handle various date formats that might come from the API
        let date: Date;
        
        // If it's already in YYYY-MM-DD format, use it directly
        if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        
        // Parse the date
        date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            // Try parsing common Laravel date formats
            if (typeof dateString === 'string') {
                // Handle Laravel's date format (Y-m-d H:i:s or Y-m-d)
                const dateOnly = dateString.split(' ')[0]; // Get just the date part
                date = new Date(dateOnly);
                
                if (isNaN(date.getTime())) {
                    console.warn('Unable to parse date:', dateString);
                    return '';
                }
            } else {
                return '';
            }
        }
        
        // Format as YYYY-MM-DD for HTML date input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

const DailyTripModal: React.FC<DailyTripModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingTrip
}) => {
    const [formData, setFormData] = useState<DailyTripFormData>({
        month: '',
        start_date: '',
        end_date: '',
        vehicle_type: '',
        plate_number: '',
        qty: '',
        driver: '',
        description: '',
        requestor: '',
        department: '',
        cost_center: '',
        location: '',
        e_bill_no: '',
        service_invoice_no: '',
        company_assigned: '',
        amount_net_of_vat: '',
        add_vat_12_percent: '',
        total_sales_vat_inclusive: '',
        less_withholding_tax_5_percent: '',
        total_amount_due: '',
        total_paid_invoice: '',
        paid_invoice: '',
        issuance_date_of_si: '',
        payment_ref_no: '',
        bir_form_2307: '',
        status: '',
        date_of_billing: '',
        due_date: '',
        remarks: ''
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (editingTrip) {
            const amountNetOfVat = parseFloat(String(editingTrip.amount_net_of_vat)) || 0;
            const vat = parseFloat(String(editingTrip.add_vat_12_percent)) || (amountNetOfVat * 0.12);
            const totalSales = parseFloat(String(editingTrip.total_sales_vat_inclusive)) || (amountNetOfVat + vat);
            
            setFormData({
                month: editingTrip.month || '',
                start_date: formatDateForInput(editingTrip.start_date),
                end_date: formatDateForInput(editingTrip.end_date),
                vehicle_type: editingTrip.vehicle_type || '',
                plate_number: editingTrip.plate_number || '',
                qty: String(editingTrip.qty || ''),
                driver: editingTrip.driver || '',
                description: editingTrip.description || '',
                requestor: editingTrip.requestor || '',
                department: editingTrip.department || '',
                cost_center: editingTrip.cost_center || '',
                location: editingTrip.location || '',
                e_bill_no: editingTrip.e_bill_no || '',
                service_invoice_no: editingTrip.service_invoice_no || '',
                company_assigned: editingTrip.company_assigned || '',
                amount_net_of_vat: formatPesoInput(amountNetOfVat),
                add_vat_12_percent: formatPesoInput(vat),
                total_sales_vat_inclusive: formatPesoInput(totalSales),
                less_withholding_tax_5_percent: formatPesoInput(parseFloat(String(editingTrip.less_withholding_tax_5_percent)) || 0),
                total_amount_due: formatPesoInput(parseFloat(String(editingTrip.total_amount_due)) || 0),
                total_paid_invoice: formatPesoInput(parseFloat(String(editingTrip.total_paid_invoice)) || 0),
                paid_invoice: editingTrip.paid_invoice || '',
                issuance_date_of_si: formatDateForInput(editingTrip.issuance_date_of_si),
                payment_ref_no: editingTrip.payment_ref_no || '',
                bir_form_2307: editingTrip.bir_form_2307 || '',
                status: editingTrip.status || '',
                date_of_billing: formatDateForInput(editingTrip.date_of_billing),
                due_date: formatDateForInput(editingTrip.due_date),
                remarks: editingTrip.remarks || ''
            });
        } else {
            setFormData({
                month: '',
                start_date: '',
                end_date: '',
                vehicle_type: '',
                plate_number: '',
                qty: '',
                driver: '',
                description: '',
                requestor: '',
                department: '',
                cost_center: '',
                location: '',
                e_bill_no: '',
                service_invoice_no: '',
                company_assigned: '',
                amount_net_of_vat: formatPesoInput(0),
                add_vat_12_percent: formatPesoInput(0),
                total_sales_vat_inclusive: formatPesoInput(0),
                less_withholding_tax_5_percent: formatPesoInput(0),
                total_amount_due: formatPesoInput(0),
                total_paid_invoice: formatPesoInput(0),
                paid_invoice: '',
                issuance_date_of_si: '',
                payment_ref_no: '',
                bir_form_2307: '',
                status: '',
                date_of_billing: '',
                due_date: '',
                remarks: ''
            });
        }
        setErrors({});
    }, [editingTrip, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Handle peso-formatted fields
        const editablePesoFields = ['amount_net_of_vat', 'total_paid_invoice'];
        const autoCalculatedPesoFields = ['add_vat_12_percent', 'total_sales_vat_inclusive', 
                                         'less_withholding_tax_5_percent', 'total_amount_due'];
        
        if (editablePesoFields.includes(name) && e.target instanceof HTMLInputElement) {
            // Handle editable peso fields
            if (name === 'amount_net_of_vat') {
                handlePesoInput(e as React.ChangeEvent<HTMLInputElement>, name, formData, setFormData);
                
                // Auto-compute all dependent financial fields
                const amountNetOfVat = parsePesoInput(value);
                
                // 12% VAT = 12% of Net Amount
                const vat = amountNetOfVat * 0.12;
                
                // Total Sales = Net Amount + VAT
                const totalSales = amountNetOfVat + vat;
                
                // Withholding Tax based on company (2% for FUTURENET, 5% for others)
                const ewtRate = formData.company_assigned === 'FUTURENET AND TECHNOLOGY CORPORATION' ? 0.02 : 0.05;
                const withholdingTax = amountNetOfVat * ewtRate;
                
                // Total Amount Due = Total Sales - Withholding Tax
                const totalAmountDue = totalSales - withholdingTax;
                
                setFormData(prev => ({
                    ...prev,
                    amount_net_of_vat: formatPesoInput(amountNetOfVat),
                    add_vat_12_percent: formatPesoInput(vat),
                    total_sales_vat_inclusive: formatPesoInput(totalSales),
                    less_withholding_tax_5_percent: formatPesoInput(withholdingTax),
                    total_amount_due: formatPesoInput(totalAmountDue)
                }));
            } else if (name === 'total_paid_invoice') {
                // Handle total paid invoice as normal peso input
                handlePesoInput(e as React.ChangeEvent<HTMLInputElement>, name, formData, setFormData);
            }
        } else if (autoCalculatedPesoFields.includes(name)) {
            // Prevent manual input on auto-calculated fields
            return;
        } else {
            // Handle regular fields
            setFormData(prev => {
                let newData = {
                    ...prev,
                    [name]: value
                };
                
                // Recalculate withholding tax when company changes (if net amount exists)
                if (name === 'company_assigned' && prev.amount_net_of_vat) {
                    const amountNetOfVat = parsePesoInput(String(prev.amount_net_of_vat));
                    
                    if (amountNetOfVat > 0) {
                        // 12% VAT = 12% of Net Amount
                        const vat = amountNetOfVat * 0.12;
                        
                        // Total Sales = Net Amount + VAT
                        const totalSales = amountNetOfVat + vat;
                        
                        // Withholding Tax based on new company (2% for FUTURENET, 5% for others)
                        const ewtRate = value === 'FUTURENET AND TECHNOLOGY CORPORATION' ? 0.02 : 0.05;
                        const withholdingTax = amountNetOfVat * ewtRate;
                        
                        // Total Amount Due = Total Sales - Withholding Tax
                        const totalAmountDue = totalSales - withholdingTax;
                        
                        newData = {
                            ...newData,
                            add_vat_12_percent: formatPesoInput(vat),
                            total_sales_vat_inclusive: formatPesoInput(totalSales),
                            less_withholding_tax_5_percent: formatPesoInput(withholdingTax),
                            total_amount_due: formatPesoInput(totalAmountDue)
                        };
                    }
                }
                
                return newData;
            });
        }
        
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
        
        // Convert peso-formatted strings to actual numbers for numeric fields
        const processedData = {
            ...formData,
            qty: formData.qty ? parseInt(String(formData.qty)) : undefined,
            amount_net_of_vat: formData.amount_net_of_vat ? parsePesoInput(String(formData.amount_net_of_vat)) : undefined,
            add_vat_12_percent: formData.add_vat_12_percent ? parsePesoInput(String(formData.add_vat_12_percent)) : undefined,
            total_sales_vat_inclusive: formData.total_sales_vat_inclusive ? parsePesoInput(String(formData.total_sales_vat_inclusive)) : undefined,
            less_withholding_tax_5_percent: formData.less_withholding_tax_5_percent ? parsePesoInput(String(formData.less_withholding_tax_5_percent)) : undefined,
            total_amount_due: formData.total_amount_due ? parsePesoInput(String(formData.total_amount_due)) : undefined,
            total_paid_invoice: formData.total_paid_invoice ? parsePesoInput(String(formData.total_paid_invoice)) : undefined,
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
                        {/* Month */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Month
                            </label>
                            <input
                                type="text"
                                name="month"
                                value={formData.month}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., October 2025"
                            />
                            {errors.month && (
                                <p className="text-red-500 text-xs mt-1">{errors.month[0]}</p>
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

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.end_date && (
                                <p className="text-red-500 text-xs mt-1">{errors.end_date[0]}</p>
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
                                placeholder="e.g., Toyota Innova"
                            />
                            {errors.vehicle_type && (
                                <p className="text-red-500 text-xs mt-1">{errors.vehicle_type[0]}</p>
                            )}
                        </div>

                        {/* Plate Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Plate Number
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

                        {/* Qty */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="qty"
                                value={formData.qty}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter quantity"
                                min="1"
                            />
                            {errors.qty && (
                                <p className="text-red-500 text-xs mt-1">{errors.qty[0]}</p>
                            )}
                        </div>

                        {/* Driver */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Driver
                            </label>
                            <input
                                type="text"
                                name="driver"
                                value={formData.driver}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter driver name"
                            />
                            {errors.driver && (
                                <p className="text-red-500 text-xs mt-1">{errors.driver[0]}</p>
                            )}
                        </div>

                        {/* Requestor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Requestor
                            </label>
                            <input
                                type="text"
                                name="requestor"
                                value={formData.requestor}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter requestor name"
                            />
                            {errors.requestor && (
                                <p className="text-red-500 text-xs mt-1">{errors.requestor[0]}</p>
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
                                placeholder="Enter department"
                            />
                            {errors.department && (
                                <p className="text-red-500 text-xs mt-1">{errors.department[0]}</p>
                            )}
                        </div>

                        {/* Cost Center */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cost Center
                            </label>
                            <input
                                type="text"
                                name="cost_center"
                                value={formData.cost_center}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter cost center"
                            />
                            {errors.cost_center && (
                                <p className="text-red-500 text-xs mt-1">{errors.cost_center[0]}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter location"
                            />
                            {errors.location && (
                                <p className="text-red-500 text-xs mt-1">{errors.location[0]}</p>
                            )}
                        </div>

                        {/* E-Bill No */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-Bill No.
                            </label>
                            <input
                                type="text"
                                name="e_bill_no"
                                value={formData.e_bill_no}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter e-bill number"
                            />
                            {errors.e_bill_no && (
                                <p className="text-red-500 text-xs mt-1">{errors.e_bill_no[0]}</p>
                            )}
                        </div>

                        {/* Service Invoice No */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Invoice No.
                            </label>
                            <input
                                type="text"
                                name="service_invoice_no"
                                value={formData.service_invoice_no}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter service invoice number"
                            />
                            {errors.service_invoice_no && (
                                <p className="text-red-500 text-xs mt-1">{errors.service_invoice_no[0]}</p>
                            )}
                        </div>

                        {/* Company Assigned */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Assigned *
                            </label>
                            <select
                                name="company_assigned"
                                value={formData.company_assigned}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Company</option>
                                <option value="DITO TELECOMMUNITY CORPORATION">DITO TELECOMMUNITY CORPORATION</option>
                                <option value="CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION">CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION</option>
                                <option value="FUTURENET AND TECHNOLOGY CORPORATION">FUTURENET AND TECHNOLOGY CORPORATION</option>
                                <option value="BESTWORLD ENGINEERING SDN BHD">BESTWORLD ENGINEERING SDN BHD</option>
                            </select>
                            {errors.company_assigned && (
                                <p className="text-red-500 text-xs mt-1">{errors.company_assigned[0]}</p>
                            )}
                        </div>

                        {/* Amount Net of VAT */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount: Net of VAT
                            </label>
                            <input
                                type="text"
                                name="amount_net_of_vat"
                                value={formData.amount_net_of_vat}
                                onChange={handleInputChange}
                                placeholder="₱0.00"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.amount_net_of_vat && (
                                <p className="text-red-500 text-xs mt-1">{errors.amount_net_of_vat[0]}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                This will auto-calculate VAT, Total Sales, Withholding Tax, and Total Amount Due
                            </p>
                        </div>

                        {/* ADD: VAT (12%) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ADD: VAT (12%) (Auto-calculated)
                                <span className="text-blue-600 text-xs ml-1">📊</span>
                            </label>
                            <input
                                type="text"
                                name="add_vat_12_percent"
                                value={formData.add_vat_12_percent}
                                className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-blue-800 font-medium cursor-not-allowed"
                                readOnly
                                tabIndex={-1}
                            />
                            {errors.add_vat_12_percent && (
                                <p className="text-red-500 text-xs mt-1">{errors.add_vat_12_percent[0]}</p>
                            )}
                        </div>

                        {/* Total Sales (VAT Inclusive) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Sales (VAT Inclusive) (Auto-calculated)
                                <span className="text-blue-600 text-xs ml-1">📊</span>
                            </label>
                            <input
                                type="text"
                                name="total_sales_vat_inclusive"
                                value={formData.total_sales_vat_inclusive}
                                className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-blue-800 font-medium cursor-not-allowed"
                                readOnly
                                tabIndex={-1}
                            />
                            {errors.total_sales_vat_inclusive && (
                                <p className="text-red-500 text-xs mt-1">{errors.total_sales_vat_inclusive[0]}</p>
                            )}
                        </div>

                        {/* LESS: Withholding Tax (Dynamic %) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                LESS: Withholding Tax ({formData.company_assigned === 'FUTURENET AND TECHNOLOGY CORPORATION' ? '2%' : '5%'}) (Auto-calculated)
                                <span className="text-blue-600 text-xs ml-1">📊</span>
                            </label>
                            <input
                                type="text"
                                name="less_withholding_tax_5_percent"
                                value={formData.less_withholding_tax_5_percent}
                                placeholder="₱0.00"
                                className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-blue-800 font-medium cursor-not-allowed"
                                readOnly
                            />
                            {errors.less_withholding_tax_5_percent && (
                                <p className="text-red-500 text-xs mt-1">{errors.less_withholding_tax_5_percent[0]}</p>
                            )}
                        </div>

                        {/* Total Amount Due */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Amount Due (Auto-calculated)
                                <span className="text-green-600 text-xs ml-1">💰</span>
                            </label>
                            <input
                                type="text"
                                name="total_amount_due"
                                value={formData.total_amount_due}
                                className="w-full border border-green-200 rounded-md px-3 py-2 bg-green-50 text-green-800 font-bold cursor-not-allowed"
                                readOnly
                                tabIndex={-1}
                            />
                            {errors.total_amount_due && (
                                <p className="text-red-500 text-xs mt-1">{errors.total_amount_due[0]}</p>
                            )}
                        </div>

                        {/* Total Paid Invoice */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Paid Invoice
                            </label>
                            <input
                                type="text"
                                name="total_paid_invoice"
                                value={formData.total_paid_invoice}
                                onChange={handleInputChange}
                                placeholder="₱0.00"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.total_paid_invoice && (
                                <p className="text-red-500 text-xs mt-1">{errors.total_paid_invoice[0]}</p>
                            )}
                        </div>

                        {/* Paid Invoice */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Paid Invoice
                            </label>
                            <input
                                type="text"
                                name="paid_invoice"
                                value={formData.paid_invoice}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter paid invoice reference"
                            />
                            {errors.paid_invoice && (
                                <p className="text-red-500 text-xs mt-1">{errors.paid_invoice[0]}</p>
                            )}
                        </div>

                        {/* Issuance Date of S.I */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Issuance Date of S.I
                            </label>
                            <input
                                type="date"
                                name="issuance_date_of_si"
                                value={formData.issuance_date_of_si}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.issuance_date_of_si && (
                                <p className="text-red-500 text-xs mt-1">{errors.issuance_date_of_si[0]}</p>
                            )}
                        </div>

                        {/* Payment Ref No */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Ref. No.
                            </label>
                            <input
                                type="text"
                                name="payment_ref_no"
                                value={formData.payment_ref_no}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter payment reference number"
                            />
                            {errors.payment_ref_no && (
                                <p className="text-red-500 text-xs mt-1">{errors.payment_ref_no[0]}</p>
                            )}
                        </div>

                        {/* BIR Form 2307 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                BIR Form 2307
                            </label>
                            <select
                                name="bir_form_2307"
                                value={formData.bir_form_2307}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Status</option>
                                <option value="Received">Received</option>
                                <option value="Pending">Pending</option>
                                <option value="Not Required">Not Required</option>
                            </select>
                            {errors.bir_form_2307 && (
                                <p className="text-red-500 text-xs mt-1">{errors.bir_form_2307[0]}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Status</option>
                                <option value="Paid">Paid</option>
                                <option value="Balance">Balance</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>
                            )}
                        </div>

                        {/* Date of Billing */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Billing
                            </label>
                            <input
                                type="date"
                                name="date_of_billing"
                                value={formData.date_of_billing}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.date_of_billing && (
                                <p className="text-red-500 text-xs mt-1">{errors.date_of_billing[0]}</p>
                            )}
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.due_date && (
                                <p className="text-red-500 text-xs mt-1">{errors.due_date[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Description - Full width */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter trip description..."
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
                        )}
                    </div>

                    {/* Remarks - Full width */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks
                        </label>
                        <select
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Remarks</option>
                            <option value="Due Today">Due Today</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Upcoming">Upcoming</option>
                        </select>
                        {errors.remarks && (
                            <p className="text-red-500 text-xs mt-1">{errors.remarks[0]}</p>
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
