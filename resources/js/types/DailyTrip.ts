export interface Vehicle {
    plate_number: string;
    vehicle_owner: string;
    vehicle_brand: string;
}

export interface DailyTrip {
    id: number;
    month_year?: string;
    department?: string;
    plate_number?: string;
    vehicle_owner?: string;
    vehicle_brand?: string;
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
    total_amount?: number;
    service_invoice?: string;
    status_2?: string;
    created_at: string;
    updated_at: string;
    vehicle?: Vehicle;
}

export interface DailyTripFormData {
    month_year?: string;
    department?: string;
    plate_number?: string;
    vehicle_owner?: string;
    vehicle_brand?: string;
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
    total_amount?: number | string;
    service_invoice?: string;
    status_2?: string;
}
