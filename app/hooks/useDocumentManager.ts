import { useRef, useEffect, useCallback } from 'react';
import { Editor as TiptapEditor } from '@tiptap/react';
import { Document } from '../components/editor/Editor';
import { getEditorContent } from '../lib/editorUtils';

interface UseDocumentManagerProps {
    editor: TiptapEditor | null;
    document: Document | undefined;
    documents: Document[];
    onUpdateDocument: (id: string, content: string) => void;
}

export function useDocumentManager({
    editor,
    document,
    documents,
    onUpdateDocument,
}: UseDocumentManagerProps) {
    // Document state refs
    const contentRef = useRef<string>(document?.content || '');
    const isUpdatingFromState = useRef<boolean>(false);
    const previousDocumentId = useRef<string | null>(document?.id || null);

    // Save document content to the parent component and localStorage
    const saveDocument = useCallback((id: string, newContent: string) => {
        if (!id) return;

        onUpdateDocument(id, newContent);

        // Update localStorage if available
        if (typeof window !== 'undefined') {
            const updatedDocs = documents.map(doc => {
                if (doc.id === id) {
                    return { ...doc, content: newContent };
                }
                return doc;
            });
            localStorage.setItem('typhoon-docs', JSON.stringify(updatedDocs));
        }
    }, [onUpdateDocument, documents]);

    // Update document content when document changes
    useEffect(() => {
        if (!editor || !document?.id) return;

        // Update the ref with current content
        contentRef.current = editor.getHTML();

        // Setup debounced save function
        let saveTimeout: NodeJS.Timeout;
        const debouncedSave = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => saveContent(), 500);
        };

        // Function to save content
        const saveContent = () => {
            if (!editor || editor.isDestroyed || isUpdatingFromState.current || !document?.id) return;

            const currentContent = editor.getHTML();

            // Only update if content changed since last save
            if (currentContent === contentRef.current) return;

            // Update tracked content and save
            contentRef.current = currentContent;
            saveDocument(document.id, currentContent);
        };

        // Listen for editor updates
        editor.on('update', debouncedSave);

        // Set up auto-save interval
        const autoSaveInterval = setInterval(saveContent, 5000);

        // Handle document content updates when document changes
        const doc = documents.find(d => d?.id === document.id);
        if (doc) {
            isUpdatingFromState.current = true;

            // Only update editor if content has changed
            if (editor.getHTML() !== doc.content) {
                contentRef.current = doc.content;
                editor.commands.setContent(doc.content);
            }

            // Update previous document ID
            previousDocumentId.current = document.id;

            // Reset the flag after a short delay
            setTimeout(() => {
                isUpdatingFromState.current = false;
            }, 10);
        }

        return () => {
            clearTimeout(saveTimeout);
            clearInterval(autoSaveInterval);
            editor.off('update', debouncedSave);
            saveContent(); // Save one last time on unmount
        };
    }, [editor, document?.id, documents, onUpdateDocument, saveDocument]);

    // Save document name
    const saveDocumentName = useCallback(() => {
        if (!document?.id) return;
        onUpdateDocument(document.id, document.name);
    }, [document, onUpdateDocument]);

    // Switch to another document
    const switchDocument = useCallback((id: string, onSwitchDocument: (id: string) => void) => {
        // Don't do anything if we're already viewing this document or document is undefined
        if (!document?.id || id === document.id) return;

        // First save current document content if editor is ready
        if (editor && document.id) {
            const html = getEditorContent(editor);

            // Only update if content has actually changed
            const currentDoc = documents.find(doc => doc.id === document.id);
            if (currentDoc && currentDoc.content !== html) {
                saveDocument(document.id, html);
            }
        }

        // Then switch to the selected document
        onSwitchDocument(id);

        // Update previous document ID reference
        previousDocumentId.current = id;
    }, [document, editor, documents, saveDocument]);

    return {
        contentRef,
        isUpdatingFromState,
        previousDocumentId,
        saveDocument,
        saveDocumentName,
        switchDocument,
    };
} 