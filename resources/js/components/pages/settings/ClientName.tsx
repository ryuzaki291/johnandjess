import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface ClientNameProps {
    token?: string;
}

const ClientName: React.FC<ClientNameProps> = ({ token }) => {
    const [clientName, setClientName] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load existing client name from localStorage or API
        const savedClientName = localStorage.getItem('client_name') || 'John & Jess Corporation';
        setClientName(savedClientName);
    }, []);

    const handleSave = async () => {
        if (!clientName.trim()) {
            await Swal.fire({
                title: 'Error!',
                text: 'Client name cannot be empty.',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                customClass: {
                    popup: 'rounded-2xl',
                }
            });
            return;
        }

        setSaving(true);
        
        try {
            // Save to localStorage (you can extend this to save to API/database)
            localStorage.setItem('client_name', clientName.trim());
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await Swal.fire({
                title: 'Success!',
                text: 'Client name has been updated successfully.',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Great!',
                customClass: {
                    popup: 'rounded-2xl',
                }
            });
        } catch (error) {
            await Swal.fire({
                title: 'Error!',
                text: 'Failed to update client name. Please try again.',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                customClass: {
                    popup: 'rounded-2xl',
                }
            });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setClientName('John & Jess Corporation');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent mb-2">
                        Client Name Settings
                    </h1>
                    <p className="text-slate-600 text-lg">Configure your organization's display name</p>
                </div>

                {/* Settings Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-2xl">👤</span>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-2xl font-bold text-slate-900">Organization Name</h2>
                                <p className="text-slate-600">This name will appear throughout the application</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Client Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Client Name *
                                </label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="Enter your organization name"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                    disabled={saving}
                                    data-form-type="other"
                                    autoComplete="organization"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    This name will be displayed in reports, headers, and throughout the application
                                </p>
                            </div>

                            {/* Current Preview */}
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <h3 className="text-sm font-medium text-slate-700 mb-2">Preview:</h3>
                                <div className="text-xl font-bold text-slate-900">
                                    {clientName || 'No name set'}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !clientName.trim()}
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                                    data-form-type="other"
                                    type="button"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleReset}
                                    disabled={saving}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:cursor-not-allowed text-slate-700 font-medium rounded-lg transition-colors duration-200"
                                    data-form-type="other"
                                    type="button"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset to Default
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Card */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">About Client Name Settings</p>
                            <p>
                                The client name is used throughout the application for branding and identification purposes. 
                                This includes document headers, email signatures, and system notifications. 
                                Changes take effect immediately after saving.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientName;