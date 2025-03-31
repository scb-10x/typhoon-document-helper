'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Editor } from '@tiptap/core';
import { useLanguage } from '../../contexts/LanguageContext';

const HeadingSelector = ({ editor }: { editor: Editor }) => {
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

    const getCurrentHeading = () => {
        if (editor.isActive('heading', { level: 1 })) return 'h1';
        if (editor.isActive('heading', { level: 2 })) return 'h2';
        if (editor.isActive('heading', { level: 3 })) return 'h3';
        return 'paragraph';
    };

    const handleHeadingChange = (value: string) => {
        setIsOpen(false);

        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else if (value === 'h1') {
            editor.chain().focus().setHeading({ level: 1 }).run();
        } else if (value === 'h2') {
            editor.chain().focus().setHeading({ level: 2 }).run();
        } else if (value === 'h3') {
            editor.chain().focus().setHeading({ level: 3 }).run();
        }
    };

    const currentValue = getCurrentHeading();

    return (
        <div className="relative mr-1.5" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-2 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 min-w-[110px]"
            >
                <span className="mr-1">
                    {currentValue === 'paragraph' ? t('paragraph') :
                        currentValue === 'h1' ? t('heading1') :
                            currentValue === 'h2' ? t('heading2') :
                                t('heading3')}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full min-w-[160px] bg-white border border-gray-200 rounded-md shadow-md z-20">
                    <div className="py-1">
                        <button
                            onClick={() => handleHeadingChange('h1')}
                            className={`w-full text-left px-3 py-1.5 text-sm ${currentValue === 'h1' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            {t('heading1')}
                        </button>
                        <button
                            onClick={() => handleHeadingChange('h2')}
                            className={`w-full text-left px-3 py-1.5 text-sm ${currentValue === 'h2' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            {t('heading2')}
                        </button>
                        <button
                            onClick={() => handleHeadingChange('h3')}
                            className={`w-full text-left px-3 py-1.5 text-sm ${currentValue === 'h3' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            {t('heading3')}
                        </button>
                        <button
                            onClick={() => handleHeadingChange('paragraph')}
                            className={`w-full text-left px-3 py-1.5 text-sm ${currentValue === 'paragraph' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            {t('paragraph')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeadingSelector; 