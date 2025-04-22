import { useState } from 'react';

type ExportFormat = 'txt' | 'html' | 'markdown' | 'docx';

interface ExportOptions {
    content: string;
    fileName?: string;
    title?: string;
}

export const useExport = () => {
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const exportDocument = async (format: ExportFormat, options: ExportOptions) => {
        if (!options.content) {
            setError('No content provided');
            return;
        }

        setIsExporting(true);
        setError(null);

        try {
            const response = await fetch(`/api/export/${format}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: options.content,
                    fileName: options.fileName || 'document',
                    title: options.title || 'Exported Document',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to export ${format}`);
            }

            // Create a blob from the response
            const blob = await response.blob();

            // Create a download link and trigger it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${options.fileName || 'document'}.${format === 'markdown' ? 'md' : format}`;
            document.body.appendChild(a);
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(`Error exporting to ${format}:`, err);
            setError(err instanceof Error ? err.message : 'Failed to export document');
        } finally {
            setIsExporting(false);
        }
    };

    return {
        exportDocument,
        isExporting,
        error,
    };
}; 