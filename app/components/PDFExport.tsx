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
import { TranslationFunction } from '../lib/translations';

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
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
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
                                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
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
                                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
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
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
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
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
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
export async function exportToPDF(
    settings: PDFExportSettings,
    documentContent: string,
    t: TranslationFunction
) {
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
                /* Base styles */
                :root {
                    --primary: 139, 92, 246;
                    --success: 34, 197, 94;
                    --error: 239, 68, 68;
                    --warning: 234, 179, 8;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #ffffff;
                    margin: 0;
                    padding: 0;
                }

                /* Typography */
                h1, h2, h3, h4, h5, h6 {
                    font-weight: 600;
                    line-height: 1.2;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    color: #111827;
                }

                h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }

                h2 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin-top: 1.75rem;
                    margin-bottom: 0.875rem;
                }

                h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }

                h4 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.625rem;
                }

                h5 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-top: 1.125rem;
                    margin-bottom: 0.5rem;
                }

                h6 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }

                /* Paragraphs and spacing */
                p {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                    color: #374151;
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
                    color: #374151;
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
                    color: #374151;
                }

                li.task-item > input[type="checkbox"] {
                    margin: 0.3rem 0.5rem 0 0;
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid #9CA3AF;
                    border-radius: 0.25rem;
                    appearance: none;
                    -webkit-appearance: none;
                }

                li.task-item > input[type="checkbox"]:checked {
                    background-color: #8B5CF6;
                    border-color: #8B5CF6;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E");
                    background-size: 100% 100%;
                    background-position: center;
                    background-repeat: no-repeat;
                }

                /* Blockquotes */
                blockquote {
                    margin: 1.5rem 0;
                    padding: 1rem 1.5rem;
                    border-left: 4px solid #E5E7EB;
                    background-color: #F9FAFB;
                    color: #4B5563;
                    font-style: italic;
                }

                blockquote p {
                    margin: 0;
                }

                /* Code blocks */
                pre {
                    margin: 1.5rem 0;
                    padding: 1rem;
                    background-color: #1F2937;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                }

                code {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    font-size: 0.875rem;
                    line-height: 1.5;
                }

                pre code {
                    color: #E5E7EB;
                    background-color: transparent;
                    padding: 0;
                }

                /* Tables */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                }

                th, td {
                    padding: 0.75rem;
                    border: 1px solid #E5E7EB;
                    text-align: left;
                }

                th {
                    background-color: #F3F4F6;
                    font-weight: 600;
                    color: #111827;
                }

                tr:nth-child(even) {
                    background-color: #F9FAFB;
                }

                /* Links */
                a {
                    color: #8B5CF6;
                    text-decoration: none;
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.2s;
                }

                a:hover {
                    border-bottom-color: #8B5CF6;
                }

                /* Horizontal rules */
                hr {
                    margin: 2rem 0;
                    border: 0;
                    border-top: 1px solid #E5E7EB;
                }

                /* Images */
                img {
                    max-width: 100%;
                    height: auto;
                    margin: 1.5rem 0;
                    border-radius: 0.5rem;
                }

                figure {
                    margin: 1.5rem 0;
                }

                figcaption {
                    text-align: center;
                    color: #6B7280;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                }

                /* Text formatting */
                strong {
                    font-weight: 600;
                    color: #111827;
                }

                em {
                    font-style: italic;
                }

                del {
                    text-decoration: line-through;
                    color: #6B7280;
                }

                mark {
                    background-color: #FEF3C7;
                    color: #92400E;
                    padding: 0.2em 0;
                }

                /* Subscript and superscript */
                sub, sup {
                    font-size: 0.75em;
                    line-height: 0;
                    position: relative;
                    vertical-align: baseline;
                }

                sup {
                    top: -0.5em;
                }

                sub {
                    bottom: -0.25em;
                }

                /* Print-specific styles */
                @media print {
                    body {
                        background-color: ${settings.pageColor};
                        color: #333333;
                    }

                    a {
                        text-decoration: underline;
                    }

                    img {
                        max-height: 100vh;
                        page-break-inside: avoid;
                    }

                    table {
                        page-break-inside: avoid;
                    }

                    pre {
                        page-break-inside: avoid;
                    }

                    blockquote {
                        page-break-inside: avoid;
                    }
                }
            `;

            // Add the style element to the container
            container.appendChild(styleElement);

            // Get paper dimensions
            const dimensions = getPaperDimensions(settings.format);
            const width = settings.orientation === 'landscape' ? dimensions.height : dimensions.width;
            const height = settings.orientation === 'landscape' ? dimensions.width : dimensions.height;

            // Configure html2pdf options
            const opt = {
                margin: settings.margin,
                filename: `${settings.fileName}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    scrollY: 0,
                    windowWidth: width * 3.78, // Convert mm to pixels (1mm ≈ 3.78px)
                    windowHeight: height * 3.78,
                    backgroundColor: settings.pageColor
                },
                jsPDF: {
                    unit: 'mm',
                    format: [width, height],
                    orientation: settings.orientation,
                    compress: true
                }
            };

            // Generate PDF
            return html2pdf().from(container).set(opt).save()
                .then(() => {
                    toast.success(t('pdfCreatedSuccess'), { id: 'pdf-export' });
                })
                .catch((error: Error) => {
                    console.error('PDF generation error:', error);
                    toast.error(t('pdfExportError'), { id: 'pdf-export' });
                });
        })
        .catch((error) => {
            console.error('Error loading html2pdf:', error);
            toast.error(t('pdfExportError'), { id: 'pdf-export' });
        });
} 