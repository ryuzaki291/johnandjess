export interface Vehicle {
    plate_number: string;
    vehicle_owner: string;
    vehicle_brand: string;
}

export interface DailyTrip {
    id: number;
    month?: string;
    start_date?: string;
    end_date?: string;
    vehicle_type?: string;
    plate_number?: string;
    qty?: number;
    driver?: string;
    description?: string;
    requestor?: string;
    department?: string;
    cost_center?: string;
    location?: string;
    e_bill_no?: string;
    service_invoice_no?: string;
    company_assigned?: string;
    amount_net_of_vat?: number;
    add_vat_12_percent?: number;
    total_sales_vat_inclusive?: number;
    less_withholding_tax_5_percent?: number;
    total_amount_due?: number;
    total_paid_invoice?: number;
    paid_invoice?: string;
    issuance_date_of_si?: string;
    payment_ref_no?: string;
    bir_form_2307?: string;
    status?: string;
    date_of_billing?: string;
    due_date?: string;
    remarks?: string;
    created_at: string;
    updated_at: string;
    vehicle?: Vehicle;
}

export interface DailyTripFormData {
    month?: string;
    start_date?: string;
    end_date?: string;
    vehicle_type?: string;
    plate_number?: string;
    qty?: number | string;
    driver?: string;
    description?: string;
    requestor?: string;
    department?: string;
    cost_center?: string;
    location?: string;
    e_bill_no?: string;
    service_invoice_no?: string;
    company_assigned?: string;
    amount_net_of_vat?: number | string;
    add_vat_12_percent?: number | string;
    total_sales_vat_inclusive?: number | string;
    less_withholding_tax_5_percent?: number | string;
    total_amount_due?: number | string;
    total_paid_invoice?: number | string;
    paid_invoice?: string;
    issuance_date_of_si?: string;
    payment_ref_no?: string;
    bir_form_2307?: string;
    status?: string;
    date_of_billing?: string;
    due_date?: string;
    remarks?: string;
}
