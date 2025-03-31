import React from 'react';

interface FormatButtonProps {
    icon: React.ReactNode;
    title?: string;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

const FormatButton = ({ icon, title, isActive = false, onClick, disabled = false }: FormatButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-8 h-8 flex items-center justify-center rounded transition-all duration-200 relative ${isActive
            ? 'bg-purple-100 text-purple-600 shadow-sm'
            : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={title}
    >
        {icon}
        {isActive && (
            <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></span>
        )}
    </button>
);

export default FormatButton; 