'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Wand2, Highlighter, Pencil, Book, MessageSquarePlus, Languages } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    isVisible: boolean;
    onClose: () => void;
    onAction: (action: string) => void;
}

type MenuPosition = {
    x: number;
    y: number;
    position?: 'top' | 'bottom';
}

type AIAction = {
    id: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, isVisible, onClose, onAction }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x, y, position: 'bottom' });

    // Quick AI actions to show in the context menu
    const actions: AIAction[] = [
        { id: 'proofread', label: 'Proofread', icon: <Pencil size={14} />, description: 'Fix grammar and spelling' },
        { id: 'summarize', label: 'Summarize', icon: <MessageSquarePlus size={14} />, description: 'Create a brief summary' },
        { id: 'extend', label: 'Extend', icon: <Sparkles size={14} />, description: 'Expand with more details' },
        { id: 'professional', label: 'Make Professional', icon: <Book size={14} />, description: 'Use formal language' },
        { id: 'clarity', label: 'Improve Clarity', icon: <Highlighter size={14} />, description: 'Make it clearer' },
        { id: 'translate', label: 'Translate', icon: <Languages size={14} />, description: 'Translate to another language' },
    ];

    // Update menuPosition when x or y props change
    useEffect(() => {
        setMenuPosition({ x, y });
    }, [x, y]);

    // Adjust position to ensure menu stays inside viewport
    useEffect(() => {
        if (isVisible && menuRef.current) {
            const menu = menuRef.current;
            const rect = menu.getBoundingClientRect();
            const PADDING = 10; // padding from viewport edges

            // Check viewport constraints and calculate optimal position
            let adjustedX = x;
            let adjustedY = y;
            let placement: 'top' | 'bottom' = 'bottom'; // default position (menu below cursor)

            // Check if menu extends beyond right edge
            if (x + rect.width > window.innerWidth - PADDING) {
                adjustedX = window.innerWidth - rect.width - PADDING;
            }

            // Check if menu extends beyond left edge
            if (adjustedX < PADDING) {
                adjustedX = PADDING;
            }

            // Determine vertical position - try below cursor first
            if (y + rect.height > window.innerHeight - PADDING) {
                // Not enough space below, try positioning above cursor
                adjustedY = y - rect.height - PADDING;
                placement = 'top';

                // If still not enough space, position at bottom of viewport
                if (adjustedY < PADDING) {
                    adjustedY = window.innerHeight - rect.height - PADDING;
                    placement = 'bottom';
                }
            } else {
                // Enough space below cursor, add small offset for better UX
                adjustedY = y + 8;
            }

            // Update position if needed
            if (adjustedX !== menuPosition.x || adjustedY !== menuPosition.y) {
                setMenuPosition({
                    x: adjustedX,
                    y: adjustedY,
                    position: placement
                });
            }
        }
    }, [isVisible, x, y, menuPosition]);

    // Handle clicking outside to close the menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);

    // Handle keyboard events (like pressing Escape)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, onClose]);

    // Calculate pointer position (relative to the original cursor position)
    const pointerOffset = React.useMemo(() => {
        // Calculate distance from original cursor position to menu position
        const distanceX = menuPosition.x - x;

        // Determine if pointer should be at top or bottom of menu
        const isTopPointer = (menuPosition.position === 'bottom');

        // Calculate horizontal pointer position - should point to cursor x position
        const menuWidth = menuRef.current?.offsetWidth || 224;
        const cursorRelativeX = x - menuPosition.x; // cursor position relative to menu left edge

        // Constrain pointer within menu bounds (with margins)
        const pointerLeft = Math.max(10, Math.min(menuWidth - 10, cursorRelativeX));

        return {
            left: `${pointerLeft}px`,
            position: isTopPointer ? 'top' : 'bottom'
        };
    }, [menuPosition, x, menuRef]);

    if (!isVisible) return null;

    return (
        <div
            ref={menuRef}
            className="absolute z-50 bg-white shadow-lg rounded-lg border border-gray-200 py-2 w-56 animate-popIn"
            style={{
                left: menuPosition.x,
                top: menuPosition.y,
                transformOrigin: pointerOffset.position === 'top' ? 'top left' : 'bottom left',
            }}
        >
            {/* Pointer triangle that indicates menu is connected to cursor */}
            {pointerOffset.position === 'top' && (
                <div
                    className="absolute w-3 h-3 bg-white border-t border-l border-gray-200 transform -translate-x-1.5 -translate-y-1.5 rotate-45"
                    style={{ top: '0', left: pointerOffset.left }}
                />
            )}

            {pointerOffset.position === 'bottom' && (
                <div
                    className="absolute w-3 h-3 bg-white border-r border-b border-gray-200 transform -translate-x-1.5 translate-y-1.5 rotate-45"
                    style={{ bottom: '0', left: pointerOffset.left }}
                />
            )}

            <div className="px-3 py-1.5 border-b border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase">AI Actions</div>
            </div>

            <div className="mt-1">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => onAction(action.id)}
                        className="w-full px-3 py-1.5 text-left hover:bg-purple-50 flex items-center gap-2 transition-colors text-sm"
                    >
                        <span className="text-purple-600">{action.icon}</span>
                        <div>
                            <div className="font-medium text-gray-700">{action.label}</div>
                            {action.description && (
                                <div className="text-xs text-gray-500">{action.description}</div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ContextMenu; 