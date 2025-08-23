import React, { useState } from 'react';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    currentPage: string;
    onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentPage, onPageChange }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'vehicle', label: 'Vehicle', icon: '🚗' },
        { id: 'daily-trips', label: 'Daily Trips', icon: '🗺️' },
        { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
        { id: 'contracts', label: 'Contracts', icon: '📋' },
        { id: 'incident-report', label: 'Incident Report', icon: '⚠️' },
        { id: 'user-management', label: 'User Management', icon: '👥' },
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                w-64
            `}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex justify-center flex-1">
                        <button
                            onClick={() => {
                                onPageChange('dashboard');
                                onToggle(); // Close sidebar on mobile after clicking logo
                            }}
                            className="hover:opacity-80 transition-opacity duration-200"
                            title="Go to Dashboard"
                        >
                            <img
                                className="h-12 w-auto"
                                src="/logo.png"
                                alt="John & Jess"
                            />
                        </button>
                    </div>
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-md hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-gray-600 hover:text-gray-900"
                        title="Close Menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-4">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => {
                                        onPageChange(item.id);
                                        // Close sidebar after selection
                                        onToggle();
                                    }}
                                    className={`
                                        w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors duration-200
                                        ${currentPage === item.id 
                                            ? 'bg-indigo-100 text-indigo-700 border-r-4 border-indigo-700' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    <span className="text-xl mr-3">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                        © 2025 John & Jess App
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
