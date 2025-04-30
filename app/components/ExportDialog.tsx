import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useExport } from '../hooks/useExport';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2 } from 'lucide-react';

interface ExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    content: string;
    documentTitle?: string;
}

export const ExportDialog = ({
    open,
    onOpenChange,
    content,
    documentTitle = 'Document',
}: ExportDialogProps) => {
    const [fileName, setFileName] = useState(documentTitle);
    const [selectedFormat, setSelectedFormat] = useState<'txt' | 'html' | 'markdown'>('txt');
    const { exportDocument, isExporting, error } = useExport();

    const handleExport = async () => {
        await exportDocument(selectedFormat, {
            content,
            fileName,
            title: documentTitle,
        });

        if (!error) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Document</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fileName" className="text-right">
                            File Name
                        </Label>
                        <Input
                            id="fileName"
                            value={fileName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFileName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>

                    <Tabs
                        defaultValue="txt"
                        value={selectedFormat}
                        onValueChange={(value) => setSelectedFormat(value as 'txt' | 'html' | 'markdown')}
                        className="w-full"
                        id="export-format-tabs"
                    >
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="txt" id="export-format-txt">Text</TabsTrigger>
                            <TabsTrigger value="html" id="export-format-html">HTML</TabsTrigger>
                            <TabsTrigger value="markdown" id="export-format-markdown">Markdown</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {error && (
                        <div className="text-sm text-destructive mt-2">{error}</div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} id="export-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={isExporting} id="export-confirm-button">
                        {isExporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            'Export'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 