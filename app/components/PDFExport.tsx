'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
    const [settings, setSettings] = useState<PDFExportSettings>({
        format: 'a4',
        orientation: 'portrait',
        margin: 10,
        fileName: documentName || 'document',
        pageColor: '#ffffff',
        includeBackground: true
    });

    // Update fileName when documentName changes
    useEffect(() => {
        setSettings(prev => ({ ...prev, fileName: documentName }));
    }, [documentName]);

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
        onExport(settings);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">PDF Export Settings</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                File Name
                            </label>
                            <input
                                type="text"
                                name="fileName"
                                value={settings.fileName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Paper Size
                            </label>
                            <select
                                name="format"
                                value={settings.format}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                            >
                                <option value="a4">A4</option>
                                <option value="letter">US Letter</option>
                                <option value="legal">Legal</option>
                                <option value="a3">A3</option>
                                <option value="a5">A5</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Orientation
                            </label>
                            <select
                                name="orientation"
                                value={settings.orientation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                            >
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>

                        <div className="mt-6 mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Paper Size Preview
                            </label>
                            <div className="flex justify-center">
                                <div
                                    className="border-2 border-gray-300 rounded-md bg-white shadow-sm relative"
                                    style={{
                                        width: settings.orientation === 'portrait'
                                            ? `${getPaperDimensions(settings.format).width / 5}px`
                                            : `${getPaperDimensions(settings.format).height / 5}px`,
                                        height: settings.orientation === 'portrait'
                                            ? `${getPaperDimensions(settings.format).height / 5}px`
                                            : `${getPaperDimensions(settings.format).width / 5}px`,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            className="bg-gray-100 border border-dashed border-gray-400"
                                            style={{
                                                width: `calc(100% - ${settings.margin * 2 / 5}px)`,
                                                height: `calc(100% - ${settings.margin * 2 / 5}px)`,
                                                transition: 'all 0.3s ease',
                                                backgroundColor: settings.pageColor
                                            }}
                                        >
                                            <div className="flex h-full items-center justify-center text-xs text-gray-500">
                                                Content Area
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-center text-xs text-gray-500">
                                {settings.orientation === 'portrait'
                                    ? `${getPaperDimensions(settings.format).width}mm × ${getPaperDimensions(settings.format).height}mm`
                                    : `${getPaperDimensions(settings.format).height}mm × ${getPaperDimensions(settings.format).width}mm`}
                                {' '}- {settings.orientation}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Margin (mm)
                            </label>
                            <input
                                type="number"
                                name="margin"
                                min="0"
                                max="50"
                                value={settings.margin}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Page Color
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    name="pageColor"
                                    value={settings.pageColor}
                                    onChange={handleChange}
                                    className="p-0 w-10 h-10 border-0"
                                />
                                <input
                                    type="text"
                                    name="pageColor"
                                    value={settings.pageColor}
                                    onChange={handleChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="includeBackground"
                                name="includeBackground"
                                checked={settings.includeBackground}
                                onChange={handleChange}
                                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="includeBackground" className="ml-2 block text-sm text-gray-700">
                                Include Background Colors
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                        >
                            Export PDF
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// PDF export function
export function exportToPDF(settings: PDFExportSettings, documentContent: string) {
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
                h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #111827;
                }
                h2 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin-top: 1.75rem;
                    margin-bottom: 0.875rem;
                    color: #1F2937;
                }
                h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: #374151;
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
                p {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }
                ul {
                    margin-bottom: 1rem;
                    padding-left: 2rem;
                    list-style-type: disc;
                }
                ol {
                    margin-bottom: 1rem;
                    padding-left: 2rem;
                    list-style-type: decimal;
                }
                ul li, ol li {
                    margin-bottom: 0.5rem;
                    padding-left: 0.5rem;
                }
                ul ul, ol ul {
                    list-style-type: circle;
                }
                ul ol, ol ol {
                    list-style-type: lower-alpha;
                }
                mark, span[style*="background-color"] {
                    /* The background-color is already set inline via style attribute */
                    padding: 0 1px;
                    border-radius: 2px;
                    display: inline;
                }
                s, strike, del {
                    text-decoration: line-through;
                }
                blockquote {
                    border-left: 4px solid #E5E7EB;
                    padding-left: 1rem;
                    font-style: italic;
                    margin: 1rem 0;
                }
                pre {
                    background-color: #F3F4F6;
                    padding: 1rem;
                    border-radius: 0.375rem;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                }
                code {
                    font-family: monospace;
                    background-color: #F3F4F6;
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.25rem;
                    font-size: 0.875em;
                }
                a {
                    color: #8B5CF6;
                    text-decoration: underline;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    margin: 1rem 0;
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

            // Create a wrapper for proper page breaks
            const wrapper = document.createElement('div');
            wrapper.appendChild(container);
            document.body.appendChild(wrapper);

            // Configure html2pdf options
            const opt = {
                margin: settings.margin,
                filename: `${settings.fileName}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: settings.pageColor,
                    removeContainer: true,
                },
                jsPDF: {
                    unit: 'mm',
                    format: settings.format,
                    orientation: settings.orientation
                }
            };

            // Generate the PDF
            return html2pdf().from(wrapper).set(opt).save()
                .then(() => {
                    // Remove the temporary elements
                    document.body.removeChild(wrapper);
                    toast.success(`Document exported as PDF`);
                    return true;
                });
        })
        .catch(error => {
            console.error('Error exporting to PDF:', error);
            toast.error('Failed to export as PDF. Please try again.');
            return false;
        });
} 