'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, Edit2, Trash2, Check, X } from 'lucide-react';

interface Document {
    id: string;
    name: string;
    content: string;
}

interface DocumentSwitcherProps {
    documents: Document[];
    activeDocument: string;
    setActiveDocument: (id: string) => void;
    onRenameDocument: (id: string, name: string) => void;
    onDeleteDocument: (id: string) => void;
}

const DocumentSwitcher = ({
    documents,
    activeDocument,
    setActiveDocument,
    onRenameDocument,
    onDeleteDocument
}: DocumentSwitcherProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setEditingId(null);
                setConfirmingDeleteId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Focus input when editing starts
    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    const handleDocumentChange = (id: string) => {
        setActiveDocument(id);
        setIsOpen(false);
    };

    const startRenaming = (event: React.MouseEvent, id: string, currentName: string) => {
        event.stopPropagation();
        setEditingId(id);
        setEditName(currentName);
    };

    const handleRename = (event: React.FormEvent) => {
        event.preventDefault();
        if (editingId && editName.trim()) {
            onRenameDocument(editingId, editName.trim());
            setEditingId(null);
        }
    };

    const cancelRename = () => {
        setEditingId(null);
    };

    const confirmDelete = (event: React.MouseEvent, id: string) => {
        event.stopPropagation();
        setConfirmingDeleteId(id);
    };

    const handleDelete = (event: React.MouseEvent, id: string) => {
        event.stopPropagation();
        onDeleteDocument(id);
        setConfirmingDeleteId(null);
    };

    const cancelDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        setConfirmingDeleteId(null);
    };

    const currentDocument = documents.find(doc => doc.id === activeDocument) || { name: 'Select a document' };

    return (
        <div ref={menuRef} className="relative flex-grow max-w-xs">
            <button
                className="flex items-center w-full justify-between space-x-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center flex-grow overflow-hidden">
                    <FileText size={16} className="flex-shrink-0 mr-2" />
                    <span className="truncate">{currentDocument.name}</span>
                </div>
                <ChevronDown size={16} className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-1 rounded-md border border-gray-300 bg-white shadow-lg z-20 max-h-[60vh] overflow-y-auto">
                    <ul className="py-1">
                        {documents.map((doc) => (
                            <li
                                key={doc.id}
                                className={`px-3 py-2 text-sm hover:bg-gray-100 ${doc.id === activeDocument ? 'bg-blue-50' : ''}`}
                            >
                                {editingId === doc.id ? (
                                    <form onSubmit={handleRename} className="flex items-center">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="submit"
                                            className="ml-1 p-1 text-green-600 hover:text-green-800"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-1 p-1 text-gray-600 hover:text-gray-800"
                                            onClick={cancelRename}
                                        >
                                            <X size={16} />
                                        </button>
                                    </form>
                                ) : confirmingDeleteId === doc.id ? (
                                    <div className="flex items-center justify-between">
                                        <span className="text-red-600">Delete &quot;{doc.name}&quot;?</span>
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={(e) => handleDelete(e, doc.id)}
                                                className="p-1 text-red-600 hover:text-red-800"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={cancelDelete}
                                                className="p-1 text-gray-600 hover:text-gray-800"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => handleDocumentChange(doc.id)}
                                    >
                                        <span className={`truncate mr-2 ${doc.id === activeDocument ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                            {doc.name}
                                        </span>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                                            <button
                                                onClick={(e) => startRenaming(e, doc.id, doc.name)}
                                                className="p-1 text-gray-500 hover:text-gray-700"
                                                title="Rename"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => confirmDelete(e, doc.id)}
                                                className="p-1 text-gray-500 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DocumentSwitcher; 