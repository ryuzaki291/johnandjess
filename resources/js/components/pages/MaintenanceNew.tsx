import React, { useState, useEffect } from 'react';
import MainMaintenanceTab from './MainMaintenanceTab';
import Swal from 'sweetalert2';

interface Vehicle {
    plate_number: string;
    vehicle_type: string;
    vehicle_brand: string;
    vehicle_status?: string;
}

interface DriverMaintenanceRecord {
    id: number;
    driverName: string;
    plateNumber: string;
    odometerRecord: string;
    date: string;
    performed: string;
    amount: number;
    qty: number;
    description: string;
    nextPms: string;
    registrationMonthDate: string;
    parts: string;
    vehicle?: Vehicle;
    created_at?: string;
    updated_at?: string;
}

// SVG Icons
const TruckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m0 0l-4-4m4 4l-4 4" />
    </svg>
);

const CustomerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const MoneyIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const SortAscIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
);

const SortDescIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MaintenanceIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const WrenchIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

interface MainMaintenanceRecord {
    id: number;
    assigneeName: string;
    regionAssign: string;
    supplierName: string;
    vehicleDetails: string;
    plateNumber: string;
    odometerRecord: string;
    remarks: string;
    dateOfPms: string;
    performed: string;
    amount: number;
    qty: number;
    vehicle?: Vehicle;
}

const MaintenanceNew: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'drivers' | 'main'>('drivers');
    const [driversMaintenanceRecords, setDriversMaintenanceRecords] = useState<DriverMaintenanceRecord[]>([]);
    const [mainMaintenanceRecords, setMainMaintenanceRecords] = useState<MainMaintenanceRecord[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewRecord, setViewRecord] = useState<DriverMaintenanceRecord | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DriverMaintenanceRecord | MainMaintenanceRecord | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'created_at' | 'updated_at'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const itemsPerPage = 10;
    
    const [formData, setFormData] = useState({
        // Driver maintenance fields
        driverName: '',
        plateNumber: '',
        odometerRecord: '',
        date: '',
        performed: '',
        amount: '',
        qty: 0,
        description: '',
        nextPms: '',
        registrationMonthDate: '',
        parts: '',
        // Main maintenance fields
        assigneeName: '',
        regionAssign: '',
        supplierName: '',
        vehicleDetails: '',
        remarks: '',
        dateOfPms: ''
    });

    useEffect(() => {
        fetchVehicles();
        fetchDriversMaintenanceRecords();
        fetchMainMaintenanceRecords();
    }, []);

    const handleView = (record: DriverMaintenanceRecord) => {
        setViewRecord(record);
        setShowViewModal(true);
    };

    // Sorting and pagination functions
    const filteredRecords = driversMaintenanceRecords.filter(record =>
        (record.driverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.plateNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.performed || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.parts || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedRecords = filteredRecords.sort((a, b) => {
        const aCreated = new Date(a.created_at || 0);
        const bCreated = new Date(b.created_at || 0);
        const aUpdated = new Date(a.updated_at || 0);
        const bUpdated = new Date(b.updated_at || 0);
        
        if (sortOrder === 'desc') {
            const createdDiff = bCreated.getTime() - aCreated.getTime();
            if (createdDiff !== 0) {
                return createdDiff;
            }
            return bUpdated.getTime() - aUpdated.getTime();
        } else {
            const createdDiff = aCreated.getTime() - bCreated.getTime();
            if (createdDiff !== 0) {
                return createdDiff;
            }
            return aUpdated.getTime() - bUpdated.getTime();
        }
    });

    const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRecords = sortedRecords.slice(startIndex, endIndex);

    const handleSort = (field: 'created_at' | 'updated_at') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const getPaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    // Statistics calculation
    const getDriverMaintenanceStats = () => {
        const totalRecords = driversMaintenanceRecords.length;
        const totalAmount = driversMaintenanceRecords.reduce((sum, record) => {
            const amount = parseFloat(String(record.amount)) || 0;
            return sum + amount;
        }, 0);
        const totalQty = driversMaintenanceRecords.reduce((sum, record) => {
            const qty = parseFloat(String(record.qty)) || 0;
            return sum + qty;
        }, 0);
        const today = new Date().toDateString();
        const newToday = driversMaintenanceRecords.filter(r => new Date(r.created_at || '').toDateString() === today).length;

        return { totalRecords, totalAmount, totalQty, newToday };
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid Date';
        }
    };

    const formatCurrency = (amount: number | null | undefined) => {
        const numAmount = parseFloat(String(amount)) || 0;
        if (isNaN(numAmount)) return '₱0.00';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(numAmount);
    };

    // Peso formatting helpers for input fields
    const formatPesoInput = (amount: number | string): string => {
        if (!amount && amount !== 0) return '';
        const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[₱,]/g, '')) : amount;
        if (isNaN(numAmount)) return '';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(numAmount);
    };

    const parsePesoInput = (value: string): number => {
        const cleaned = value.replace(/[₱,]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    };

    const handlePesoInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: string,
        formData: any,
        setFormData: React.Dispatch<React.SetStateAction<any>>
    ) => {
        const input = e.target;
        const cursorPosition = input.selectionStart || 0;
        const value = input.value;
        
        // Remove peso symbol and commas to get raw number
        const rawValue = value.replace(/[₱,]/g, '');
        
        // Check if it's a valid number
        if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
            const numericValue = parseFloat(rawValue) || 0;
            
            // Format the value
            const formattedValue = formatPesoInput(numericValue);
            
            // Calculate cursor position after formatting
            const commasBeforeCursor = (value.slice(0, cursorPosition).match(/,/g) || []).length;
            const commasAfterFormat = (formattedValue.slice(0, cursorPosition).match(/,/g) || []).length;
            const newCursorPosition = cursorPosition + (commasAfterFormat - commasBeforeCursor);
            
            // Update form data
            setFormData((prev: any) => ({
                ...prev,
                [fieldName]: formattedValue
            }));
            
            // Set cursor position after React updates the DOM
            setTimeout(() => {
                if (input) {
                    input.setSelectionRange(newCursorPosition, newCursorPosition);
                }
            }, 0);
        }
    };

    // Function to get CSRF token
    const getCSRFToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        return token ? token.content : '';
    };

    // Function to initialize form data based on active tab
    const initializeFormData = () => {
        return {
            // Driver maintenance fields
            driverName: '',
            plateNumber: '',
            odometerRecord: '',
            date: '',
            performed: '',
            amount: '',
            qty: 0,
            description: '',
            nextPms: '',
            registrationMonthDate: '',
            parts: '',
            // Main maintenance fields
            assigneeName: '',
            regionAssign: '',
            supplierName: '',
            vehicleDetails: '',
            remarks: '',
            dateOfPms: ''
        };
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/drivers-maintenance-vehicles', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCSRFToken()
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setVehicles(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const fetchDriversMaintenanceRecords = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/drivers-maintenance', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCSRFToken()
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const convertedRecords = data.data.map((record: any) => ({
                        id: record.id,
                        driverName: record.driver_name,
                        plateNumber: record.plate_number,
                        odometerRecord: record.odometer_record,
                        date: record.date,
                        performed: record.performed,
                        amount: parseFloat(record.amount) || 0,
                        qty: parseFloat(record.qty) || 0,
                        description: record.description,
                        nextPms: record.next_pms,
                        registrationMonthDate: record.registration_month_date,
                        parts: record.parts,
                        vehicle: record.vehicle,
                        created_at: record.created_at,
                        updated_at: record.updated_at
                    }));
                    setDriversMaintenanceRecords(convertedRecords);
                    setCurrentPage(1);
                    setError(null);
                }
            } else {
                throw new Error('Failed to fetch records');
            }
        } catch (error) {
            console.error('Error fetching driver maintenance records:', error);
            const errorMsg = 'Unable to connect to the server. Please check your connection and try again.';
            setError(errorMsg);
            await Swal.fire({
                title: 'Network Error!',
                text: errorMsg,
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Retry',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchDriversMaintenanceRecords();
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMainMaintenanceRecords = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/main-maintenance', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCSRFToken()
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const convertedRecords = data.data.map((record: any) => ({
                        id: record.id,
                        assigneeName: record.assignee_name,
                        regionAssign: record.region_assign,
                        supplierName: record.supplier_name,
                        vehicleDetails: record.vehicle_details,
                        plateNumber: record.plate_number,
                        odometerRecord: record.odometer_record,
                        remarks: record.remarks || '',
                        dateOfPms: record.date_of_pms,
                        performed: record.performed,
                        amount: record.amount,
                        qty: record.qty,
                        vehicle: record.vehicle
                    }));
                    setMainMaintenanceRecords(convertedRecords);
                }
            }
        } catch (error) {
            console.error('Error fetching main maintenance records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Handle peso-formatted amount field
        if (name === 'amount' && e.target instanceof HTMLInputElement) {
            handlePesoInput(e as React.ChangeEvent<HTMLInputElement>, name, formData, setFormData);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'qty' ? parseFloat(value) || 0 : value
            }));
        }
    };

    const openModal = () => {
        setFormData(initializeFormData());
        setIsEditing(false);
        setEditingRecord(null);
        setIsModalOpen(true);
        setError(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Show loading alert
            Swal.fire({
                title: isEditing ? 'Updating Record...' : 'Creating Record...',
                text: 'Please wait while we process your request',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'rounded-2xl',
                }
            });

            const apiData = {
                driver_name: formData.driverName,
                plate_number: formData.plateNumber,
                odometer_record: formData.odometerRecord,
                date: formData.date,
                performed: formData.performed,
                amount: parsePesoInput(formData.amount.toString()),
                qty: formData.qty,
                description: formData.description,
                next_pms: formData.nextPms,
                registration_month_date: formData.registrationMonthDate,
                parts: formData.parts
            };

            const url = isEditing && editingRecord 
                ? `/api/drivers-maintenance/${editingRecord.id}`
                : '/api/drivers-maintenance';
            
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCSRFToken()
                },
                body: JSON.stringify(apiData)
            });

            Swal.close();

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const recordData: DriverMaintenanceRecord = {
                        id: result.data.id,
                        driverName: result.data.driver_name,
                        plateNumber: result.data.plate_number,
                        odometerRecord: result.data.odometer_record,
                        date: result.data.date,
                        performed: result.data.performed,
                        amount: parseFloat(result.data.amount) || 0,
                        qty: parseFloat(result.data.qty) || 0,
                        description: result.data.description,
                        nextPms: result.data.next_pms,
                        registrationMonthDate: result.data.registration_month_date,
                        parts: result.data.parts,
                        vehicle: result.data.vehicle,
                        created_at: result.data.created_at,
                        updated_at: result.data.updated_at
                    };

                    if (isEditing) {
                        setDriversMaintenanceRecords(prev => 
                            prev.map(record => record.id === editingRecord!.id ? recordData : record)
                        );
                        await Swal.fire({
                            title: 'Record Updated!',
                            text: 'Driver maintenance record has been updated successfully.',
                            icon: 'success',
                            timer: 3000,
                            showConfirmButton: false,
                            customClass: {
                                popup: 'rounded-2xl',
                            }
                        });
                    } else {
                        setDriversMaintenanceRecords(prev => [recordData, ...prev]);
                        await Swal.fire({
                            title: 'Record Created!',
                            text: 'Driver maintenance record has been created successfully.',
                            icon: 'success',
                            timer: 3000,
                            showConfirmButton: false,
                            customClass: {
                                popup: 'rounded-2xl',
                            }
                        });
                    }
                    closeModal();
                }
            } else {
                throw new Error(`Failed to ${isEditing ? 'update' : 'create'} record`);
            }
        } catch (err) {
            console.error('Error saving record:', err);
            Swal.close();
            await Swal.fire({
                title: 'Error!',
                text: 'An error occurred while saving the record. Please try again.',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (record: DriverMaintenanceRecord | MainMaintenanceRecord) => {
        if ('driverName' in record) {
            // Driver maintenance record
            setFormData({
                ...initializeFormData(),
                driverName: record.driverName,
                plateNumber: record.plateNumber,
                odometerRecord: record.odometerRecord,
                date: record.date,
                performed: record.performed,
                amount: formatPesoInput(record.amount),
                qty: record.qty,
                description: record.description,
                nextPms: record.nextPms,
                registrationMonthDate: record.registrationMonthDate,
                parts: record.parts
            });
        } else {
            // Main maintenance record
            setFormData({
                ...initializeFormData(),
                assigneeName: record.assigneeName,
                regionAssign: record.regionAssign,
                supplierName: record.supplierName,
                vehicleDetails: record.vehicleDetails,
                plateNumber: record.plateNumber,
                odometerRecord: record.odometerRecord,
                remarks: record.remarks,
                dateOfPms: record.dateOfPms,
                performed: record.performed,
                amount: formatPesoInput(record.amount),
                qty: record.qty
            });
        }
        setIsEditing(true);
        setEditingRecord(record);
        setIsModalOpen(true);
        setError(null);
    };

    const handleDelete = async (id: number, recordInfo: string) => {
        const result = await Swal.fire({
            title: 'Delete Record?',
            text: `Are you sure you want to delete the record "${recordInfo}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg px-6 py-2 font-medium',
                cancelButton: 'rounded-lg px-6 py-2 font-medium',
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/drivers-maintenance/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCSRFToken()
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setDriversMaintenanceRecords(prev => prev.filter(record => record.id !== id));
                    // Reset to first page if current page becomes empty
                    const remainingRecords = driversMaintenanceRecords.length - 1;
                    const maxPage = Math.ceil(remainingRecords / itemsPerPage);
                    if (currentPage > maxPage && maxPage > 0) {
                        setCurrentPage(maxPage);
                    }
                    
                    await Swal.fire({
                        title: 'Deleted!',
                        text: `Record "${recordInfo}" has been deleted successfully.`,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'rounded-2xl',
                        }
                    });
                }
            } else {
                throw new Error('Failed to delete record');
            }
        } catch (err) {
            console.error('Error deleting record:', err);
            await Swal.fire({
                title: 'Error!',
                text: 'An error occurred while deleting the record. Please try again.',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg px-6 py-2 font-medium',
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && driversMaintenanceRecords.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 sm:h-32 w-16 sm:w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading maintenance records...</p>
                </div>
            </div>
        );
    }

    const driverStats = getDriverMaintenanceStats();

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Maintenance Management</h1>
                            <p className="text-slate-600">Manage driver and main maintenance activities</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                                <button 
                                    onClick={fetchDriversMaintenanceRecords}
                                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                                activeTab === 'drivers'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                            onClick={() => setActiveTab('drivers')}
                        >
                            <div className="flex items-center space-x-2">
                                <WrenchIcon />
                                <span>Drivers Maintenance</span>
                            </div>
                        </button>
                        <button
                            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                                activeTab === 'main'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                            onClick={() => setActiveTab('main')}
                        >
                            <div className="flex items-center space-x-2">
                                <TruckIcon />
                                <span>Main Maintenance</span>
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Drivers Maintenance Tab */}
                {activeTab === 'drivers' && (
                    <div>
                        {/* Action Buttons */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900 mb-1">Driver Maintenance Records</h2>
                                    <p className="text-slate-600">Manage driver maintenance activities and schedules</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button 
                                        onClick={fetchDriversMaintenanceRecords}
                                        className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <RefreshIcon />
                                        <span className="ml-2">Refresh</span>
                                    </button>
                                    <button 
                                        onClick={openModal}
                                        className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <PlusIcon />
                                        <span className="ml-2">Add New Record</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                        <WrenchIcon />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Records</p>
                                        <p className="text-2xl font-bold text-slate-900">{driverStats.totalRecords}</p>
                                        <p className="text-xs text-slate-500 mt-1">All time</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                        <MoneyIcon />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Amount</p>
                                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(driverStats.totalAmount)}</p>
                                        <p className="text-xs text-slate-500 mt-1">All records combined</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                                        <CustomerIcon />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Quantity</p>
                                        <p className="text-2xl font-bold text-slate-900">{driverStats.totalQty}</p>
                                        <p className="text-xs text-slate-500 mt-1">Items serviced</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                                        <CalendarIcon />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Added Today</p>
                                        <p className="text-2xl font-bold text-slate-900">{driverStats.newToday}</p>
                                        <p className="text-xs text-slate-500 mt-1">New records</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIcon />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search records by driver name, vehicle, performed work, description, or parts..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">{/* Desktop Table View - Hidden on mobile */}
                        <div className="hidden lg:block">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Driver
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Vehicle
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Performed
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {currentRecords.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-slate-900">{record.driverName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-900">{record.plateNumber}</div>
                                                    <div className="text-sm text-slate-500">{record.vehicle?.vehicle_brand} {record.vehicle?.vehicle_type}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-900">{record.date}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-900">{record.performed}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-slate-900">{formatCurrency(record.amount)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleView(record)}
                                                            className="inline-flex items-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                            title="View Details"
                                                        >
                                                            <EyeIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(record)}
                                                            className="inline-flex items-center p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                                                            title="Edit Record"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(record.id, `${record.driverName} - ${record.performed}`)}
                                                            className="inline-flex items-center p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                            title="Delete Record"
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {currentRecords.length === 0 && (
                                    <div className="p-8 text-center text-slate-500">
                                        <WrenchIcon />
                                        <p className="mt-2 text-sm">No driver maintenance records found.</p>
                                        <p className="text-xs text-slate-400">Try adjusting your search terms or add a new record.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Card View - Shown only on mobile */}
                        <div className="lg:hidden">
                            {currentRecords.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <WrenchIcon />
                                    <p className="mt-2 text-sm">No driver maintenance records found.</p>
                                    <p className="text-xs text-slate-400">Try adjusting your search terms or add a new record.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200">
                                    {currentRecords.map((record) => (
                                        <div key={record.id} className="p-4 hover:bg-slate-50 transition-colors duration-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h3 className="text-sm font-semibold text-slate-900 truncate">{record.driverName}</h3>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {record.plateNumber}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs text-slate-600">
                                                            <span className="font-medium">Vehicle:</span> {record.vehicle?.vehicle_brand} {record.vehicle?.vehicle_type}
                                                        </p>
                                                        <p className="text-xs text-slate-600">
                                                            <span className="font-medium">Date:</span> {record.date}
                                                        </p>
                                                        <p className="text-xs text-slate-600">
                                                            <span className="font-medium">Performed:</span> {record.performed}
                                                        </p>
                                                        <p className="text-xs text-slate-600">
                                                            <span className="font-medium">Amount:</span> {formatCurrency(record.amount)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <button
                                                        onClick={() => handleView(record)}
                                                        className="inline-flex items-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(record)}
                                                        className="inline-flex items-center p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                                                        title="Edit Record"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(record.id, `${record.driverName} - ${record.performed}`)}
                                                        className="inline-flex items-center p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                        title="Delete Record"
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {driversMaintenanceRecords.length > 0 && totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                                    <div className="text-sm text-slate-600">
                                        Showing <span className="font-medium text-slate-900">{startIndex + 1}</span> to <span className="font-medium text-slate-900">{Math.min(endIndex, sortedRecords.length)}</span> of <span className="font-medium text-slate-900">{sortedRecords.length}</span> results
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <ChevronLeftIcon />
                                            <span className="ml-1 hidden sm:block">Previous</span>
                                        </button>
                                        
                                        <div className="hidden sm:flex items-center space-x-2">
                                            {getPaginationNumbers().map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => goToPage(page)}
                                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                        currentPage === page
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'border border-slate-300 text-slate-500 bg-white hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div className="sm:hidden">
                                            <span className="text-sm text-slate-600">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                        </div>
                                        
                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <span className="mr-1 hidden sm:block">Next</span>
                                            <ChevronRightIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                )}

                {/* Main Maintenance Tab */}
                {activeTab === 'main' && (
                    <MainMaintenanceTab />
                )}

                {/* View Modal */}
                {showViewModal && viewRecord && (
                    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Driver Maintenance Details</h2>
                                        <p className="text-slate-600">Complete information for {viewRecord.driverName || 'Driver Maintenance Record'}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Record Overview */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <MaintenanceIcon />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold text-slate-900">{viewRecord.driverName || 'Unnamed Driver'}</h3>
                                            <p className="text-slate-600">{viewRecord.performed || 'No service performed'} • {viewRecord.plateNumber || 'No vehicle'}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                                {formatCurrency(viewRecord.amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Record Information Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Driver Information</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Driver Name:</span>
                                                    <span className="text-slate-900 font-semibold">{viewRecord.driverName || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Plate Number:</span>
                                                    <span className="text-slate-900">{viewRecord.plateNumber || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Vehicle:</span>
                                                    <span className="text-slate-900">{viewRecord.vehicle?.vehicle_brand} {viewRecord.vehicle?.vehicle_type || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Odometer:</span>
                                                    <span className="text-slate-900">{viewRecord.odometerRecord || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Service Information</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Date:</span>
                                                    <span className="text-slate-900">{formatDate(viewRecord.date)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Performed:</span>
                                                    <span className="text-slate-900">{viewRecord.performed || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Next PMS:</span>
                                                    <span className="text-slate-900">{viewRecord.nextPms || 'Not scheduled'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 font-medium block mb-1">Parts:</span>
                                                    <span className="text-slate-900">{viewRecord.parts || 'No parts listed'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Financial Details</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Amount:</span>
                                                    <span className="text-green-600 font-semibold">{formatCurrency(viewRecord.amount)}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2">
                                                    <span className="text-slate-600 font-medium">Quantity:</span>
                                                    <span className="text-slate-900 font-bold text-lg">{viewRecord.qty || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Registration:</span>
                                                    <span className="text-slate-900">{viewRecord.registrationMonthDate || 'Not provided'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-slate-600 font-medium block mb-1">Description:</span>
                                                    <span className="text-slate-900">{viewRecord.description || 'No description'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Created:</span>
                                                    <span className="text-slate-900">{formatDate(viewRecord.created_at)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Last Updated:</span>
                                                    <span className="text-slate-900">{formatDate(viewRecord.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                                    <button
                                        onClick={() => {
                                            setShowViewModal(false);
                                            handleEdit(viewRecord);
                                        }}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <EditIcon />
                                        <span className="ml-2">Edit Record</span>
                                    </button>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create/Edit Modal for Driver Maintenance */}
                {isModalOpen && activeTab === 'drivers' && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {isEditing ? 'Edit Driver Maintenance Record' : 'Add Driver Maintenance Record'}
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Driver Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="driverName"
                                                value={formData.driverName}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Vehicle *
                                            </label>
                                            <select
                                                name="plateNumber"
                                                value={formData.plateNumber}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            >
                                                <option value="">Select Vehicle</option>
                                                {vehicles.map((vehicle) => (
                                                    <option key={vehicle.plate_number} value={vehicle.plate_number}>
                                                        {vehicle.plate_number} - {vehicle.vehicle_brand} {vehicle.vehicle_type}
                                                        {vehicle.vehicle_status && vehicle.vehicle_status !== 'active' && ` (${vehicle.vehicle_status.toUpperCase()})`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Odometer Record
                                            </label>
                                            <input
                                                type="text"
                                                name="odometerRecord"
                                                value={formData.odometerRecord}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="text"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Performed
                                            </label>
                                            <input
                                                type="text"
                                                name="performed"
                                                value={formData.performed}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Amount
                                            </label>
                                            <input
                                                type="text"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                placeholder="₱0.00"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                name="qty"
                                                value={formData.qty}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Next PMS
                                            </label>
                                            <input
                                                type="text"
                                                name="nextPms"
                                                value={formData.nextPms}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Registration Month/Date
                                            </label>
                                            <input
                                                type="text"
                                                name="registrationMonthDate"
                                                value={formData.registrationMonthDate}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Parts
                                            </label>
                                            <input
                                                type="text"
                                                name="parts"
                                                value={formData.parts}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenanceNew;
