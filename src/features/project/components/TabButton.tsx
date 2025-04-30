import React from "react";

interface TabButtonProps {
    value: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

const TabButton = ({ value, icon, label, active, onClick }: TabButtonProps) => (
    <button
        type="button"
        className={`flex items-center space-x-1.5 py-2 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors
            ${active
            ? 'text-gray-800 bg-gray-100'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        onClick={onClick}
    >
        {icon}
        <span className="hidden xs:inline">{label}</span>
    </button>
);

export  default TabButton;