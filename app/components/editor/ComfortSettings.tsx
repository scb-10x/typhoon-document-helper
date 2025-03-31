'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ComfortSettingsProps {
    fontSize: number;
    setFontSize: (size: number) => void;
    lineHeight: number;
    setLineHeight: (height: number) => void;
    isLoading?: boolean;
}

const ComfortSettings: React.FC<ComfortSettingsProps> = ({
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    isLoading = false
}) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                disabled={isLoading}
                title={t('comfort')}
            >
                <Settings className="w-4 h-4" />
                <span>{t('comfort')}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-md z-20">
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('fontSize')}: {fontSize}px
                            </label>
                            <input
                                type="range"
                                min="12"
                                max="24"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('lineHeight')}: {lineHeight}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="2"
                                step="0.1"
                                value={lineHeight}
                                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComfortSettings; 