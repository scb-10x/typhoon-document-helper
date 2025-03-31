import React from 'react';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const ActionButton = ({ icon, label, onClick, disabled = false }: ActionButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default ActionButton; 