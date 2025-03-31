'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
    const { currentLanguage, setLanguage } = useLanguage();
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

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'th', name: 'ไทย', flag: '🇹🇭' }
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Change language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage === 'en' ? 'EN' : 'TH'}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => {
                                setLanguage(language.code as 'en' | 'th');
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${currentLanguage === language.code ? 'font-medium bg-gray-50' : ''
                                }`}
                        >
                            <span className="text-base">{language.flag}</span>
                            {language.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher; 