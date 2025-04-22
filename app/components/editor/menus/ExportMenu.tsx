'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowDownTrayIcon,
    DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { saveAs } from 'file-saver';
import { PDFSettingsDialog, exportToPDF, type PDFExportSettings } from '../../PDFExport';
import { useExport } from '../../../hooks/useExport';
import { useLanguage } from '../../../contexts/LanguageContext';

// Helper function to convert HTML to plain text
const htmlToText = (html: string): string => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || '';
};

interface ExportMenuProps {
    documentName: string;
    documentContent: string;
    isLoading: boolean;
}

export const ExportMenu = ({ documentName, documentContent, isLoading }: ExportMenuProps) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { exportDocument, isExporting } = useExport();

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

    // Loading state combines both isLoading from props and isExporting from the hook
    const isLoadingExport = isLoading || isExporting;

    const exportAsHTML = () => {
        // Add basic HTML structure
        const fullHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${documentName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
        p { margin-bottom: 1em; }
        img { max-width: 100%; height: auto; }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            color: #666;
            margin-left: 0;
            margin-right: 0;
        }
        pre {
            background-color: #f5f5f5;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            background-color: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
${documentContent}
</body>
</html>`;

        // Create blob and save file
        const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
        saveAs(blob, `${documentName || 'document'}.html`);
        setIsOpen(false);
    };

    const exportAsMarkdown = async () => {
        // Use the API-based markdown export
        await exportDocument('markdown', {
            content: documentContent,
            fileName: documentName || 'document',
            title: documentName
        });
        setIsOpen(false);
    };

    const exportAsTXT = () => {
        const text = htmlToText(documentContent);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${documentName || 'document'}.txt`);
        setIsOpen(false);
    };

    const exportAsDOCX = async () => {
        await exportDocument('docx', {
            content: documentContent,
            fileName: documentName || 'document',
            title: documentName
        });
        setIsOpen(false);
    };

    const handleExportPDF = () => {
        setIsPDFDialogOpen(true);
        setIsOpen(false);
    };

    const handlePDFExport = (settings: PDFExportSettings) => {
        exportToPDF(settings, documentContent, t);
        setIsPDFDialogOpen(false);
    };

    return (
        <>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isLoadingExport}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>{t('export')}</span>
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                            onClick={exportAsHTML}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-gray-500" />
                            {t('exportHTML')}
                        </button>
                        <button
                            onClick={exportAsMarkdown}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-gray-500" />
                            {t('exportMarkdown')}
                        </button>
                        <button
                            onClick={exportAsTXT}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-gray-500" />
                            {t('exportTXT')}
                        </button>
                        <button
                            onClick={exportAsDOCX}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-gray-500" />
                            {t('exportDOCX')}
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-gray-500" />
                            {t('exportPDF')}
                        </button>
                    </div>
                )}
            </div>

            {isPDFDialogOpen && (
                <PDFSettingsDialog
                    isOpen={isPDFDialogOpen}
                    onClose={() => setIsPDFDialogOpen(false)}
                    onExport={handlePDFExport}
                    documentName={documentName}
                />
            )}
        </>
    );
}; 