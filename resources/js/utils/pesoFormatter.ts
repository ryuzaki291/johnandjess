/**
 * Utility functions for peso formatting in input fields
 * Provides consistent peso formatting across all components
 */

/**
 * Formats a number or string as peso currency for display
 * @param amount - The amount to format (number or string)
 * @returns Formatted peso string (e.g., "₱1,234.56")
 */
export const formatPesoInput = (amount: number | string): string => {
    if (!amount && amount !== 0) return '';
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[₱,]/g, '')) : amount;
    if (isNaN(numAmount)) return '';
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(numAmount);
};

/**
 * Parses a peso-formatted string to extract the numeric value
 * @param value - The peso-formatted string to parse
 * @returns The numeric value
 */
export const parsePesoInput = (value: string): number => {
    const cleaned = value.replace(/[₱,]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
};

/**
 * Handles peso input field changes with proper cursor positioning
 * @param e - The input change event
 * @param fieldName - The name of the form field
 * @param formData - Current form data object
 * @param setFormData - Function to update form data
 */
export const handlePesoInput = (
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

/**
 * Formats a number for currency display (read-only display purposes)
 * @param amount - The amount to format
 * @returns Formatted peso string or "₱0.00" if invalid
 */
export const formatCurrency = (amount: number | null | undefined): string => {
    const numAmount = parseFloat(String(amount)) || 0;
    if (isNaN(numAmount)) return '₱0.00';
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(numAmount);
};