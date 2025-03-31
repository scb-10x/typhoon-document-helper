'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
    XMarkIcon,
    DocumentTextIcon,
    CheckIcon,
    DocumentIcon,
    ArrowsPointingOutIcon,
    SwatchIcon,
    RectangleGroupIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../contexts/LanguageContext';

// Define the types
export interface PDFExportSettings {
    format: string;
    orientation: string;
    margin: number;
    fileName: string;
    pageColor: string;
    includeBackground: boolean;
}

interface PDFSettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (settings: PDFExportSettings) => void;
    documentName: string;
}

// First define a helper function at the top level of the file, before the PDFSettingsDialog function
const getPaperDimensions = (format: string): { width: number; height: number } => {
    // Dimensions in mm
    const dimensions: Record<string, { width: number; height: number }> = {
        'a4': { width: 210, height: 297 },
        'letter': { width: 216, height: 279 },
        'legal': { width: 216, height: 356 },
        'a3': { width: 297, height: 420 },
        'a5': { width: 148, height: 210 },
    };

    return dimensions[format] || dimensions.a4;
};

// PDF settings dialog component
export function PDFSettingsDialog({ isOpen, onClose, onExport, documentName }: PDFSettingsDialogProps) {
    const { t } = useLanguage();
    const [settings, setSettings] = useState<PDFExportSettings>({
        format: 'a4',
        orientation: 'portrait',
        margin: 10,
        fileName: documentName || 'document',
        pageColor: '#ffffff',
        includeBackground: true
    });
    const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

    // Update fileName when documentName changes
    useEffect(() => {
        setSettings(prev => ({ ...prev, fileName: documentName }));
    }, [documentName]);

    // Add state for loading indicator
    const [isExporting, setIsExporting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setSettings({ ...settings, [name]: target.checked });
        } else {
            setSettings({ ...settings, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsExporting(true);
        // We'll update the exportToPDF function to handle the loading state
        onExport(settings);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10000] backdrop-blur-sm transition-opacity duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-xl shadow-2xl p-0 max-w-md w-full transition-all duration-300 transform scale-100 animate-fadeIn overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{t('pdfExportSettings')}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isExporting}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`px-4 py-3 text-sm font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'basic'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                                }`}
                        >
                            <DocumentIcon className="w-4 h-4" />
                            Basic
                        </button>
                        <button
                            onClick={() => setActiveTab('advanced')}
                            className={`px-4 py-3 text-sm font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'advanced'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                                }`}
                        >
                            <Cog6ToothIcon className="w-4 h-4" />
                            Advanced
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                        {activeTab === 'basic' ? (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                                        <DocumentIcon className="h-4 w-4 text-gray-500" />
                                        {t('fileName')}
                                    </label>
                                    <input
                                        type="text"
                                        name="fileName"
                                        value={settings.fileName}
                                        onChange={handleChange}
                                        disabled={isExporting}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                                        placeholder={t('fileNamePlaceholder')}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                                            <RectangleGroupIcon className="h-4 w-4 text-gray-500" />
                                            {t('paperSize')}
                                        </label>
                                        <select
                                            name="format"
                                            value={settings.format}
                                            onChange={handleChange}
                                            disabled={isExporting}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                                        >
                                            <option value="a4">A4</option>
                                            <option value="letter">US Letter</option>
                                            <option value="legal">Legal</option>
                                            <option value="a3">A3</option>
                                            <option value="a5">A5</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                                            <ArrowsPointingOutIcon className="h-4 w-4 text-gray-500" />
                                            {t('orientation')}
                                        </label>
                                        <select
                                            name="orientation"
                                            value={settings.orientation}
                                            onChange={handleChange}
                                            disabled={isExporting}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                                        >
                                            <option value="portrait">{t('portrait')}</option>
                                            <option value="landscape">{t('landscape')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                                        <DocumentIcon className="h-4 w-4 text-gray-500" />
                                        {t('paperSize')} {t('preview')}
                                    </h4>
                                    <div className="bg-gray-50 p-6 rounded-lg flex justify-center border border-gray-200">
                                        <div
                                            className="border-2 border-purple-300 rounded shadow-sm bg-white relative transition-all duration-300 flex items-center justify-center"
                                            style={{
                                                width: settings.orientation === 'portrait'
                                                    ? `${getPaperDimensions(settings.format).width / 3}px`
                                                    : `${getPaperDimensions(settings.format).height / 3}px`,
                                                height: settings.orientation === 'portrait'
                                                    ? `${getPaperDimensions(settings.format).height / 3}px`
                                                    : `${getPaperDimensions(settings.format).width / 3}px`,
                                                backgroundColor: settings.pageColor
                                            }}
                                        >
                                            <div
                                                className="absolute border-2 border-dashed border-purple-400 transition-all duration-300 flex items-center justify-center"
                                                style={{
                                                    width: `calc(100% - ${settings.margin * 2 / 3}px)`,
                                                    height: `calc(100% - ${settings.margin * 2 / 3}px)`,
                                                }}
                                            >
                                                <div className="text-xs text-gray-500 text-center">
                                                    {t('contentArea')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-center text-xs text-gray-500">
                                        {settings.orientation === 'portrait'
                                            ? `${getPaperDimensions(settings.format).width}mm × ${getPaperDimensions(settings.format).height}mm`
                                            : `${getPaperDimensions(settings.format).height}mm × ${getPaperDimensions(settings.format).width}mm`}
                                        {' '}- {settings.orientation === 'portrait' ? t('portrait') : t('landscape')}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                                        <SwatchIcon className="h-4 w-4 text-gray-500" />
                                        {t('pageColor')}
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="color"
                                            name="pageColor"
                                            value={settings.pageColor}
                                            onChange={handleChange}
                                            disabled={isExporting}
                                            className="w-10 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-all duration-200 disabled:opacity-50"
                                        />
                                        <input
                                            type="text"
                                            name="pageColor"
                                            value={settings.pageColor}
                                            onChange={handleChange}
                                            disabled={isExporting}
                                            className="flex-1 ml-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                            <ArrowsPointingOutIcon className="h-4 w-4 text-gray-500" />
                                            {t('margin')}
                                        </label>
                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                                            {settings.margin} mm
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        name="margin"
                                        min="0"
                                        max="50"
                                        value={settings.margin}
                                        onChange={handleChange}
                                        disabled={isExporting}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0mm</span>
                                        <span>25mm</span>
                                        <span>50mm</span>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="includeBackground"
                                        name="includeBackground"
                                        checked={settings.includeBackground}
                                        onChange={handleChange}
                                        disabled={isExporting}
                                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-all duration-200 disabled:opacity-50"
                                    />
                                    <label htmlFor="includeBackground" className="ml-2 block text-sm text-gray-700">
                                        {t('includeBackgroundColors')}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isExporting}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isExporting}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <>
                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    {t('generatingPDF')}
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4" />
                                    {t('exportPDFButton')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// PDF export function
export function exportToPDF(settings: PDFExportSettings, documentContent: string) {
    const { t } = useLanguage();

    // Show a toast notification when starting the export
    toast.loading(t('creatingPDF'), { id: 'pdf-export' });

    // Import html2pdf dynamically to avoid SSR issues
    return import('html2pdf.js')
        .then((html2pdfModule) => {
            const html2pdf = html2pdfModule.default;

            // First prepare the HTML content with proper styling
            // Remove unnecessary attributes but keep all styling
            const cleanedHTML = documentContent
                .replace(/ contenteditable="[^"]*"/g, '') // Remove contenteditable
                .replace(/ data-[^=]*="[^"]*"/g, ''); // Remove data-* attributes

            // Create a container for the PDF content with custom styles
            const container = document.createElement('div');
            container.innerHTML = cleanedHTML;

            // Apply custom styling based on settings
            container.style.padding = `${settings.margin}mm`;
            container.style.backgroundColor = settings.pageColor;
            container.style.color = '#333333';

            // Add custom styling for headings to ensure they transfer properly
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                /* Base text styles */
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                }

                /* Headings */
                h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #111827;
                    line-height: 1.2;
                }
                h2 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin-top: 1.75rem;
                    margin-bottom: 0.875rem;
                    color: #1F2937;
                    line-height: 1.3;
                }
                h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: #374151;
                    line-height: 1.4;
                }
                h4 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.625rem;
                    color: #4B5563;
                }
                h5 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-top: 1.125rem;
                    margin-bottom: 0.5rem;
                    color: #6B7280;
                }
                h6 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    color: #6B7280;
                }

                /* Paragraphs and spacing */
                p {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }

                /* Lists */
                ul, ol {
                    margin: 1rem 0;
                    padding-left: 2rem;
                }

                ul {
                    list-style-type: disc;
                }

                ol {
                    list-style-type: decimal;
                }

                ul li, ol li {
                    margin-bottom: 0.5rem;
                    padding-left: 0.5rem;
                }

                ul ul, ol ul {
                    list-style-type: circle;
                    margin: 0.5rem 0;
                }

                ul ol, ol ol {
                    list-style-type: lower-alpha;
                    margin: 0.5rem 0;
                }

                /* Task Lists */
                ul.task-list {
                    list-style-type: none;
                    padding-left: 0.5rem;
                }

                li.task-item {
                    display: flex !important;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                    padding-left: 0;
                }

                li.task-item > input[type="checkbox"] {
                    margin: 0.3rem 0.5rem 0 0;
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid #9CA3AF;
                    border-radius: 0.25rem;
                    appearance: none;
                    -webkit-appearance: none;
                    position: relative;
                    cursor: pointer;
                }

                li.task-item > input[type="checkbox"]:checked {
                    background-color: #8B5CF6;
                    border-color: #8B5CF6;
                }

                li.task-item > input[type="checkbox"]:checked::after {
                    content: '';
                    position: absolute;
                    left: 4px;
                    top: 1px;
                    width: 4px;
                    height: 8px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                /* Text formatting */
                mark, span[style*="background-color"] {
                    padding: 0 2px;
                    border-radius: 2px;
                }

                s, strike, del {
                    text-decoration: line-through;
                    color: #6B7280;
                }

                /* Blockquotes */
                blockquote {
                    border-left: 4px solid #E5E7EB;
                    padding: 0.5rem 0 0.5rem 1rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: #4B5563;
                    background-color: #F9FAFB;
                }

                /* Code blocks */
                pre {
                    background-color: #F3F4F6;
                    padding: 1rem;
                    border-radius: 0.375rem;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    font-size: 0.875em;
                    line-height: 1.5;
                }

                code {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    background-color: #F3F4F6;
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.25rem;
                    font-size: 0.875em;
                    color: #DC2626;
                }

                /* Links */
                a {
                    color: #8B5CF6;
                    text-decoration: underline;
                    text-decoration-thickness: 0.1em;
                    text-underline-offset: 0.15em;
                }

                /* Images */
                img {
                    max-width: 100%;
                    height: auto;
                    margin: 1.5rem auto;
                    display: block;
                    border-radius: 0.375rem;
                }

                figure {
                    margin: 2rem 0;
                    text-align: center;
                }

                figcaption {
                    margin-top: 0.5rem;
                    font-size: 0.875rem;
                    color: #6B7280;
                    font-style: italic;
                }

                /* Tables */
                table {
                    width: 100%;
                    margin: 1.5rem 0;
                    border-collapse: collapse;
                    border: 2px solid #E5E7EB;
                    break-inside: avoid;
                }

                th {
                    background-color: #F9FAFB;
                    font-weight: 600;
                    text-align: left;
                    padding: 0.75rem;
                    border: 1px solid #D1D5DB;
                    border-bottom: 2px solid #9CA3AF;
                    color: #374151;
                }

                td {
                    padding: 0.75rem;
                    border: 1px solid #D1D5DB;
                    vertical-align: top;
                }

                tr:nth-child(even) {
                    background-color: #F9FAFB;
                }

                /* Subscript and Superscript */
                sub {
                    vertical-align: sub;
                    font-size: 0.75em;
                }

                sup {
                    vertical-align: super;
                    font-size: 0.75em;
                }

                /* Horizontal Rule */
                hr {
                    border: 0;
                    height: 2px;
                    background-color: #E5E7EB;
                    margin: 2rem 0;
                }
            `;
            container.prepend(styleElement);

            // Check for existing heading styles and enhance them if needed
            const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                // Preserve any inline styles that might be applied
                const existingStyle = heading.getAttribute('style') || '';
                heading.setAttribute('style', `font-weight: bold; ${existingStyle}`);
            });

            // Fix for strikethrough and highlight elements
            const strikethroughElements = container.querySelectorAll('s');
            strikethroughElements.forEach(element => {
                element.style.textDecoration = 'line-through';
            });

            // Ensure highlight styles are preserved
            const highlightedElements = container.querySelectorAll('[data-type="highlight"]');
            highlightedElements.forEach(element => {
                const style = element.getAttribute('style') || '';
                if (!style.includes('background-color')) {
                    // Assign a default highlight color if none is specified
                    element.setAttribute('style', `${style}; background-color: #FFFF00;`);
                }

                // Make sure display is inline to prevent line breaks
                if (!style.includes('display:')) {
                    element.setAttribute('style', `${style}; display: inline;`);
                }
            });

            // Fix for list items to ensure they render properly
            const listItems = container.querySelectorAll('li');
            listItems.forEach(item => {
                const existingStyle = item.getAttribute('style') || '';
                item.setAttribute('style', `display: list-item; ${existingStyle}`);
            });

            // Fix task lists and checkboxes
            const taskItems = container.querySelectorAll('.task-item');
            taskItems.forEach(item => {
                // Add proper styling
                const itemStyle = item.getAttribute('style') || '';
                item.setAttribute('style', `display: flex; align-items: flex-start; ${itemStyle}`);

                // Process checkbox
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    // Make sure it's not just a placeholder
                    if (checkbox.parentElement) {
                        // Add some spacing after the checkbox
                        const checkStyle = checkbox.getAttribute('style') || '';
                        checkbox.setAttribute('style', `margin-right: 8px; margin-top: 4px; ${checkStyle}`);
                    }
                }
            });

            // Fix table styling for PDF output
            const tables = container.querySelectorAll('table');
            tables.forEach(table => {
                // Ensure tables have proper styling
                const existingStyle = table.getAttribute('style') || '';
                table.setAttribute('style', `border-collapse: collapse; width: 100%; margin: 1rem 0; border: 2px solid #e5e7eb; ${existingStyle}`);

                // Add page-break-inside: avoid to prevent tables from breaking across pages
                if (!existingStyle.includes('page-break-inside') && !existingStyle.includes('break-inside')) {
                    table.style.pageBreakInside = 'avoid';
                    table.style.breakInside = 'avoid';
                }

                // Ensure all cells have borders
                const cells = table.querySelectorAll('th, td');
                cells.forEach(cell => {
                    const cellStyle = cell.getAttribute('style') || '';
                    cell.setAttribute('style', `border: 1px solid #d1d5db; padding: 8px; word-wrap: break-word; ${cellStyle}`);
                });

                // Style header cells
                const headerCells = table.querySelectorAll('th');
                headerCells.forEach(cell => {
                    const cellStyle = cell.getAttribute('style') || '';
                    cell.setAttribute('style', `background-color: #f9fafb; font-weight: 600; border-bottom: 2px solid #9ca3af; ${cellStyle}`);
                });
            });

            // Process images to ensure they load properly
            const images = container.querySelectorAll('img');
            images.forEach(img => {
                // Add crossOrigin attribute to help with CORS issues
                img.crossOrigin = 'anonymous';

                // Ensure images have max-width for better PDF layout
                const existingStyle = img.getAttribute('style') || '';
                img.setAttribute('style', `max-width: 100%; height: auto; display: block; margin: 1rem auto; ${existingStyle}`);

                // If an image has a figure or figcaption parent, center and style it
                const figure = img.closest('figure');
                if (figure) {
                    figure.style.textAlign = 'center';
                    figure.style.margin = '1.5rem 0';

                    // Style figcaption if present
                    const figcaption = figure.querySelector('figcaption');
                    if (figcaption) {
                        figcaption.style.textAlign = 'center';
                        figcaption.style.fontSize = '0.875rem';
                        figcaption.style.fontStyle = 'italic';
                        figcaption.style.color = '#4B5563';
                        figcaption.style.marginTop = '0.5rem';
                    }
                }

                // If an image doesn't have alt text, add an empty one for accessibility
                if (!img.hasAttribute('alt')) {
                    img.setAttribute('alt', '');
                }

                // Add title as tooltip if available
                if (img.hasAttribute('alt') && !img.hasAttribute('title')) {
                    img.setAttribute('title', img.getAttribute('alt') || '');
                }

                // Add border to images that don't have transparent backgrounds
                if (img.src.match(/\.(jpg|jpeg|png)$/i) && !img.src.match(/transparent/i)) {
                    if (!existingStyle.includes('border')) {
                        img.style.border = '1px solid #e5e7eb';
                        img.style.borderRadius = '4px';
                    }
                }
            });

            // Process subscript and superscript elements
            const subElements = container.querySelectorAll('sub');
            subElements.forEach(element => {
                const style = element.getAttribute('style') || '';
                element.setAttribute('style', `vertical-align: sub; font-size: 0.75em; ${style}`);
            });

            const supElements = container.querySelectorAll('sup');
            supElements.forEach(element => {
                const style = element.getAttribute('style') || '';
                element.setAttribute('style', `vertical-align: super; font-size: 0.75em; ${style}`);
            });

            // Create a wrapper for proper page breaks
            const wrapper = document.createElement('div');
            wrapper.appendChild(container);
            document.body.appendChild(wrapper);

            // Configure html2pdf options
            const opt = {
                margin: settings.margin,
                filename: `${settings.fileName}.pdf`,
                image: {
                    type: 'jpeg',
                    quality: 0.98
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: settings.pageColor,
                    removeContainer: true,
                    logging: false,
                    letterRendering: true, // Improve text rendering
                    scrollY: 0, // Prevent scroll issues
                },
                jsPDF: {
                    unit: 'mm',
                    format: settings.format,
                    orientation: settings.orientation,
                    compress: true,
                    precision: 16
                }
            };

            // Generate the PDF
            return html2pdf().from(wrapper).set(opt).save()
                .then(() => {
                    // Remove the temporary elements
                    document.body.removeChild(wrapper);
                    toast.success(t('pdfCreatedSuccess'), { id: 'pdf-export' });
                    return true;
                });
        })
        .catch(error => {
            console.error('Error exporting to PDF:', error);
            toast.error(t('pdfExportError'), { id: 'pdf-export' });
            return false;
        });
} 