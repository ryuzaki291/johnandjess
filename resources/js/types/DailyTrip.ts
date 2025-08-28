export interface Vehicle {
    plate_number: string;
    vehicle_owner: string;
    vehicle_brand: string;
}

export interface DailyTrip {
    id: number;
    month_year?: string;
    department?: string;
    vehicle_type?: string;
    plate_number?: string;
    vehicle_owner?: string;
    vehicle_brand?: string;
    company_assigned?: string;
    location_area?: string;
    drivers_name?: string;
    customer_name?: string;
    destination?: string;
    date_from?: string;
    date_to?: string;
    particular?: string;
    total_allowance?: number;
    drivers_networth?: number;
    status_1?: string;
    amount_billed?: number;
    vat_12_percent?: number;
    contract_amount?: number;
    less_5_ewt?: number;
    final_amount?: number;
    total_amount?: number;
    remarks?: string;
    suppliers_amount?: number;
    drivers_salary?: number;
    start_date?: string;
    additional_remarks?: string;
    service_invoice?: string;
    status_2?: string;
    created_at: string;
    updated_at: string;
    vehicle?: Vehicle;
}

export interface DailyTripFormData {
    month_year?: string;
    department?: string;
    vehicle_type?: string;
    plate_number?: string;
    vehicle_owner?: string;
    vehicle_brand?: string;
    company_assigned?: string;
    location_area?: string;
    drivers_name?: string;
    customer_name?: string;
    destination?: string;
    date_from?: string;
    date_to?: string;
    particular?: string;
    total_allowance?: number | string;
    drivers_networth?: number | string;
    status_1?: string;
    amount_billed?: number | string;
    vat_12_percent?: number | string;
    contract_amount?: number | string;
    less_5_ewt?: number | string;
    final_amount?: number | string;
    total_amount?: number | string;
    remarks?: string;
    suppliers_amount?: number | string;
    drivers_salary?: number | string;
    start_date?: string;
    additional_remarks?: string;
    service_invoice?: string;
    status_2?: string;
}
