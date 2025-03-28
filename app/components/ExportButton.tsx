import { useState } from 'react';
import { Button } from './ui/button';
import { ExportDialog } from './ExportDialog';
import { FileDown } from 'lucide-react';

interface ExportButtonProps {
    content: string;
    documentTitle?: string;
}

export const ExportButton = ({ content, documentTitle }: ExportButtonProps) => {
    const [showExportDialog, setShowExportDialog] = useState(false);

    return (
        <>
            <Button
                onClick={() => setShowExportDialog(true)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
            >
                <FileDown className="h-4 w-4" />
                Export
            </Button>

            <ExportDialog
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
                content={content}
                documentTitle={documentTitle}
            />
        </>
    );
}; 