'use client';

import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface Document {
    id: string;
    name: string;
    content: string;
}

interface SidebarProps {
    documents: Document[];
    activeDocument: string;
    setActiveDocument: (id: string) => void;
    addNewDocument: () => void;
}

const Sidebar = ({
    documents,
    activeDocument,
    setActiveDocument,
    addNewDocument
}: SidebarProps) => {
    return (
        <div className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {documents.length > 0 ? (
                    <div className="space-y-1">
                        {documents.map((doc) => (
                            <button
                                key={doc.id}
                                onClick={() => setActiveDocument(doc.id)}
                                className={`w-full text-left px-4 py-2 flex items-center ${doc.id === activeDocument
                                    ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <FileText className={`w-4 h-4 mr-3 ${doc.id === activeDocument ? 'text-purple-600' : 'text-gray-400'
                                    }`} />
                                <span className="truncate">{doc.name}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="px-4 py-6 text-center">
                        <p className="text-gray-500 text-sm">No documents yet</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={addNewDocument}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Document</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 