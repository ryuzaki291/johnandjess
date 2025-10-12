import React, { useState, useEffect } from 'react';
import ClientNameSettings from './ClientName';

interface ClientName {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: ClientName[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const ClientNameWrapper: React.FC = () => {
    const [clientNames, setClientNames] = useState<PaginatedData>({
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClientNames();
    }, []);

    const fetchClientNames = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/client-names');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                setClientNames(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch client names');
            }
        } catch (error) {
            console.error('Error fetching client names:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch client names');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading client names...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Client Names</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchClientNames}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return <ClientNameSettings clientNames={clientNames} />;
};

export default ClientNameWrapper;