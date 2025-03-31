import { useState } from 'react';
import { Editor as TiptapEditor } from '@tiptap/react';
import toast from 'react-hot-toast';
import { aiTextService } from '../lib/aiServices';
import { hasSelection, getSelectedText } from '../lib/editorUtils';
import { useLanguage } from '../contexts/LanguageContext';

export function useAIActions(editor: TiptapEditor | null) {
    const [isLoading, setIsLoading] = useState(false);

    // Expose state to handle translate modal
    const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);

    const { t } = useLanguage();

    // Handle general AI actions like proofread, professional, etc.
    const handleAIAction = async (action: string) => {
        if (!editor) return;

        // For translation, open the translation modal
        if (action === 'translate') {
            setIsTranslateModalOpen(true);
            return;
        }

        // Get selected text or whole document
        const isTextSelected = hasSelection(editor);
        const text = getSelectedText(editor);

        // Don't process if no text or too short
        if (!text || text.trim().length < 2) {
            toast.error(t('selectTextOrContent'));
            return;
        }

        // Set loading state
        setIsLoading(true);

        try {
            // Process text with AI using the unified service
            const result = await aiTextService(editor.getHTML(), action, {
                plainText: isTextSelected ? text : editor.getHTML(),
                preserveFormatting: true
            });

            try {
                if (isTextSelected) {
                    // Use insertContent for selections to properly handle HTML content
                    editor.chain()
                        .focus()
                        .deleteSelection()
                        .insertContent(result)
                        .run();
                } else {
                    // For replacing the entire document, use setContent to properly handle HTML
                    editor.commands.setContent(result);
                }
            } catch (error) {
                console.error('Error inserting content:', error);
                // Fallback to HTML content insertion
                if (isTextSelected) {
                    // For selected text, parse as HTML to preserve formatting
                    editor.chain()
                        .focus()
                        .deleteSelection()
                        .insertContent(result)
                        .run();
                } else {
                    // For full document, set content as HTML
                    editor.commands.setContent(result);
                }
            }

            toast.success(t('actionApplied', { action }));
        } catch (error) {
            console.error('Error processing AI action:', error);
            toast.error(t('requestFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle translation
    const handleTranslationRequest = async (language: string, customLanguage?: string) => {
        if (!editor) return;

        // Set loading state
        setIsLoading(true);

        try {
            // Get content to translate
            const isTextSelected = hasSelection(editor);
            const { selection } = editor.state;

            // Get the full HTML content
            const htmlContent = editor.getHTML();

            // Get plain text (either selected portion or full document)
            const textContent = isTextSelected
                ? editor.state.doc.textBetween(selection.from, selection.to, ' ')
                : editor.state.doc.textContent;

            // Translate the content using the unified service
            // Use customLanguage if provided, otherwise use language
            const translatedContent = await aiTextService(
                htmlContent,
                'translate',
                {
                    plainText: isTextSelected ? textContent : htmlContent,
                    customLanguage: customLanguage || language || 'english',
                    preserveFormatting: true
                }
            );

            try {
                if (isTextSelected) {
                    // Use insertContent for selections to properly handle HTML content
                    editor.chain()
                        .focus()
                        .deleteSelection()
                        .insertContent(translatedContent)
                        .run();
                } else {
                    // For replacing the entire document, use setContent to properly handle HTML
                    editor.commands.setContent(translatedContent);
                }
            } catch (error) {
                console.error('Error inserting content:', error);
                // Fallback to HTML content insertion
                if (isTextSelected) {
                    // For selected text, parse as HTML to preserve formatting
                    editor.chain()
                        .focus()
                        .deleteSelection()
                        .insertContent(translatedContent)
                        .run();
                } else {
                    // For full document, set content as HTML
                    editor.commands.setContent(translatedContent);
                }
            }

            toast.success(t('translatedTo', { language }));
        } catch (error) {
            console.error('Translation error:', error);
            toast.error(t('translationFailed'));
        } finally {
            setIsLoading(false);
            setIsTranslateModalOpen(false);  // Close modal when done
        }
    };

    // Load sample document
    const loadSampleDocument = (createSampleDocument: () => string, onAddDocument: (content?: string) => void) => {
        if (!editor) return;

        // Get sample content
        const sampleContent = createSampleDocument();

        // Create a new document with sample content
        onAddDocument(sampleContent);

        toast.success(t('sampleLoaded'));
    };

    return {
        isLoading,
        isTranslateModalOpen,
        setIsTranslateModalOpen,
        handleAIAction,
        handleTranslationRequest,
        loadSampleDocument,
    };
} 