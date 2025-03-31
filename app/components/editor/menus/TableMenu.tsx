'use client';

import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import {
    ChevronDown,
    RowsIcon,
    Columns,
    Trash2,
    Grid2X2,
    AlignLeft,
    Rows3,
    RowsIcon as RowIcon,
    ColumnsIcon,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TableMenuProps {
    editor: Editor;
}

export const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isTableSelected, setIsTableSelected] = useState(false);

    useEffect(() => {
        const handleUpdate = () => {
            setIsTableSelected(editor.isActive('table'));
        };

        editor.on('selectionUpdate', handleUpdate);
        editor.on('update', handleUpdate);

        return () => {
            editor.off('selectionUpdate', handleUpdate);
            editor.off('update', handleUpdate);
        };
    }, [editor]);

    if (!isTableSelected) return null;

    const menuItems = [
        {
            icon: <Rows3 size={14} />,
            label: t('insertRowAbove'),
            action: () => editor.chain().focus().addRowBefore().run(),
        },
        {
            icon: <RowIcon size={14} />,
            label: t('insertRowBelow'),
            action: () => editor.chain().focus().addRowAfter().run(),
        },
        {
            icon: <ColumnsIcon size={14} />,
            label: t('insertColLeft'),
            action: () => editor.chain().focus().addColumnBefore().run(),
        },
        {
            icon: <Columns size={14} />,
            label: t('insertColRight'),
            action: () => editor.chain().focus().addColumnAfter().run(),
        },
        {
            icon: <Trash2 size={14} />,
            label: t('deleteRow'),
            action: () => editor.chain().focus().deleteRow().run(),
        },
        {
            icon: <Trash2 size={14} />,
            label: t('deleteCol'),
            action: () => editor.chain().focus().deleteColumn().run(),
        },
        {
            icon: <Trash2 size={14} />,
            label: t('deleteTable'),
            action: () => editor.chain().focus().deleteTable().run(),
        },
        {
            icon: <Grid2X2 size={14} />,
            label: t('mergeCells'),
            action: () => editor.chain().focus().mergeCells().run(),
            isDisabled: () => !editor.can().mergeCells(),
        },
        {
            icon: <Grid2X2 size={14} />,
            label: t('splitCell'),
            action: () => editor.chain().focus().splitCell().run(),
            isDisabled: () => !editor.can().splitCell(),
        },
    ];

    return (
        <div className="fixed bottom-16 right-4 z-40">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    <Grid2X2 size={16} />
                    <span>{t('table')}</span>
                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.action();
                                    setIsOpen(false);
                                }}
                                disabled={item.isDisabled ? item.isDisabled() : false}
                                className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-purple-50 ${item.isDisabled && item.isDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <span className="text-gray-500">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}; 