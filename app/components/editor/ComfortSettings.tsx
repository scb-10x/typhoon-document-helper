'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';

interface ComfortSettingsProps {
    fontSize: number;
    setFontSize: (size: number) => void;
    lineHeight: number;
    setLineHeight: (height: number) => void;
    isLoading?: boolean;
}

const ComfortSettings = ({ fontSize, setFontSize, lineHeight, setLineHeight, isLoading }: ComfortSettingsProps) => {
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
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Reading settings"
            >
                <Palette className="w-4 h-4" />
                <span>Comfort</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-64">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">Reading Comfort</h3>

                    <div className="mb-4">
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-medium text-gray-700">
                                Font Size: {fontSize}px
                            </label>
                            <button
                                className="text-xs text-purple-600 hover:text-purple-800"
                                onClick={() => setFontSize(16)}
                                type="button"
                            >
                                Reset
                            </button>
                        </div>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-medium text-gray-700">
                                Line Height: {lineHeight}
                            </label>
                            <button
                                className="text-xs text-purple-600 hover:text-purple-800"
                                onClick={() => setLineHeight(1.5)}
                                type="button"
                            >
                                Reset
                            </button>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="2.5"
                            step="0.1"
                            value={lineHeight}
                            onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Tight</span>
                            <span>Spacious</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComfortSettings; 