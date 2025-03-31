'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Highlighter } from 'lucide-react';
import FormatButton from './FormatButton';
import { Editor } from '@tiptap/core';

const HighlightPicker = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const highlightPickerRef = useRef<HTMLDivElement>(null);

    // Preset highlight colors - mostly lighter/pastel versions for highlighting
    const highlightColors = [
        '#ffff00', // yellow
        '#ff9900', // orange
        '#00ff00', // green
        '#00ffff', // cyan
        '#4a86e8', // blue
        '#0000ff', // dark blue
        '#9900ff', // purple
        '#ff00ff', // magenta
        '#ff0000', // red
        '#f9cb9c', // light orange
        '#ffe599', // light yellow
        '#b6d7a8', // light green
        '#a2c4c9', // light teal
        '#a4c2f4', // light blue
        '#9fc5e8', // light sky blue
        '#b4a7d6', // light purple
        '#d5a6bd', // light pink
        '#ea9999', // light red
        '#ffffff', // white
        '#f3f3f3', // light gray
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (highlightPickerRef.current && !highlightPickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const applyHighlight = (color: string) => {
        editor.chain().focus().setHighlight({ color }).run();
        setIsOpen(false);
    };

    const removeHighlight = () => {
        editor.chain().focus().unsetHighlight().run();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={highlightPickerRef}>
            <FormatButton
                icon={<Highlighter className="w-4 h-4" />}
                title="Highlight Text"
                isActive={editor.isActive('highlight') || isOpen}
                onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-md shadow-lg border border-gray-200 p-2 w-64">
                    <div className="grid grid-cols-10 gap-1 mb-2">
                        {highlightColors.map((color) => (
                            <button
                                key={color}
                                onClick={() => applyHighlight(color)}
                                className="w-5 h-5 rounded-sm border border-gray-300 hover:scale-125 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                    <button
                        onClick={removeHighlight}
                        className="w-full text-xs px-2 py-1 text-gray-700 hover:bg-gray-100 rounded text-center"
                    >
                        Remove highlight
                    </button>
                </div>
            )}
        </div>
    );
};

export default HighlightPicker; 