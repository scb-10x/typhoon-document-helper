'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AIMenuProps {
    title: string;
    icon: React.ReactNode;
    options: { label: string; value: string; icon?: React.ReactNode; description?: string }[];
    onAction: (action: string) => void;
    disabled?: boolean;
}

const AIMenu = ({ title, icon, options, onAction, disabled = false }: AIMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
                {icon}
                <span>{title}</span>
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-stripe-md border border-gray-200 z-50 py-1.5">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onAction(option.value);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-start gap-2 px-3 py-2.5 text-sm text-left text-gray-700 hover:bg-purple-50 transition-colors duration-150"
                        >
                            <div className="mt-0.5 flex-shrink-0">
                                {option.icon || icon}
                            </div>
                            <div>
                                <div className="font-medium">{option.label}</div>
                                {option.description && (
                                    <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AIMenu; 