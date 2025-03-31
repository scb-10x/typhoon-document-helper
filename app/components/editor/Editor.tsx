'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

// Import custom components
import EditorToolbar from './EditorToolbar';
import AIFooter from './AIFooter';
import DocumentStats from './DocumentStats';
import { ExportMenu } from './menus/ExportMenu';
import ComfortSettings from './ComfortSettings';
import DocumentSwitcher from './DocumentSwitcher';
import LinkModal from './modals/LinkModal';
import ImageModal from './modals/ImageModal';
import TranslateModal from './modals/TranslateModal';
import { TableMenu } from './menus/TableMenu';
import LanguageSwitcher from './LanguageSwitcher';

// Import extracted modules and hooks
import { createEditorExtensions } from '../../lib/editorConfig';
import { createSampleDocument } from '../../lib/editorConstants';
import { getEditorContent } from '../../lib/editorUtils';
import { useDocumentManager } from '../../hooks/useDocumentManager';
import { useEditorModals } from '../../hooks/useEditorModals';
import { useAIActions } from '../../hooks/useAIActions';
import { useLanguage } from '../../contexts/LanguageContext';

// Define types
export interface Document {
    id: string;
    name: string;
    content: string;
}

interface EditorProps {
    document: Document;
    documents: Document[];
    onUpdateDocument: (id: string, content: string) => void;
    onSwitchDocument: (id: string) => void;
    onAddDocument: (content?: string) => void;
    onDeleteDocument: (id: string) => void;
    onRenameDocument: (id: string, name: string) => void;
}

export default function Editor({
    document,
    documents = [],
    onUpdateDocument = () => { },
    onSwitchDocument = () => { },
    onAddDocument = () => { },
    onDeleteDocument = () => { },
    onRenameDocument = () => { },
}: EditorProps) {
    // Get translation function
    const { t } = useLanguage();

    // UI state
    const [isMounted, setIsMounted] = useState(false);

    // Editor appearance
    const [fontSize, setFontSize] = useState(16);
    const [lineHeight, setLineHeight] = useState(1.5);

    // Handle client-side mounting
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Create and configure the editor
    const editor = useEditor({
        extensions: createEditorExtensions(),
        content: document?.content || '',
        autofocus: 'end',
        editable: isMounted,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4',
                style: `font-size: ${fontSize}px; line-height: ${lineHeight};`,
            },
        },
        onUpdate: ({ editor }) => {
            if (documentManager.isUpdatingFromState.current || !document?.id) {
                documentManager.isUpdatingFromState.current = false;
                return;
            }

            const html = editor.getHTML();
            if (html !== documentManager.contentRef.current) {
                documentManager.contentRef.current = html;
                onUpdateDocument(document.id, html);
            }
        },
    }, [isMounted, fontSize, lineHeight]);

    // Update editor content when document changes
    useEffect(() => {
        if (editor && document) {
            // Only update content if document ID has changed to avoid cursor reset on typing
            if (documentManager.previousDocumentId.current !== document.id) {
                documentManager.isUpdatingFromState.current = true;
                editor.commands.setContent(document.content || '');
                documentManager.contentRef.current = document.content || '';
                documentManager.previousDocumentId.current = document.id;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, document]);

    // Update style when font size or line height changes
    useEffect(() => {
        if (editor) {
            // Apply style to the editor content directly
            const editorElement = editor.view.dom;

            // Set styles directly on the ProseMirror element
            editorElement.style.fontSize = `${fontSize}px`;
            editorElement.style.lineHeight = `${lineHeight}`;
        }
    }, [editor, fontSize, lineHeight]);

    // Initialize custom hooks
    const documentManager = useDocumentManager({
        editor,
        document,
        documents,
        onUpdateDocument,
    });

    const modals = useEditorModals(editor);
    const aiActions = useAIActions(editor);

    // Add editor focus styling
    useEffect(() => {
        if (!editor) return;

        const editorElement = editor.view.dom;

        // Add a class to help with styling when editor is focused
        const handleEditorFocus = () => editorElement.classList.add('editor-has-focus');
        const handleEditorBlur = () => editorElement.classList.remove('editor-has-focus');

        editorElement.addEventListener('focus', handleEditorFocus);
        editorElement.addEventListener('blur', handleEditorBlur);

        return () => {
            editorElement.removeEventListener('focus', handleEditorFocus);
            editorElement.removeEventListener('blur', handleEditorBlur);
        };
    }, [editor]);

    // Handle translation request
    const handleTranslateSubmit = (language: string) => {
        aiActions.handleTranslationRequest(language, modals.customLanguage);
    };

    // Check if there are no documents (first launch)
    const hasNoDocuments = documents.length === 0;

    // Custom styling variables for the container
    const dynamicStyles = {
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight.toString()
    };

    // Render header with document controls
    const renderHeader = () => (
        <div className="p-4 pb-1 flex flex-wrap items-center justify-between border-b">
            <div className="flex items-center flex-grow mr-2">
                <DocumentSwitcher
                    documents={documents}
                    activeDocument={document?.id || ''}
                    setActiveDocument={(id) => documentManager.switchDocument(id, onSwitchDocument)}
                    onRenameDocument={onRenameDocument}
                    onDeleteDocument={onDeleteDocument}
                />
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onAddDocument()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>{t('newDocument')}</span>
                </button>

                <ExportMenu
                    documentName={document?.name || t('untitledDocument')}
                    documentContent={getEditorContent(editor)}
                    isLoading={aiActions.isLoading}
                />

                <ComfortSettings
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    lineHeight={lineHeight}
                    setLineHeight={setLineHeight}
                    isLoading={aiActions.isLoading}
                />

                <LanguageSwitcher />
            </div>
        </div>
    );

    // Render modals
    const renderModals = () => (
        <>
            {modals.isLinkModalOpen && (
                <LinkModal
                    isOpen={modals.isLinkModalOpen}
                    onClose={() => modals.setIsLinkModalOpen(false)}
                    onSubmit={modals.handleLinkSubmit}
                />
            )}

            {modals.isImageModalOpen && (
                <ImageModal
                    isOpen={modals.isImageModalOpen}
                    onClose={() => modals.setIsImageModalOpen(false)}
                    onSubmit={modals.handleInsertImage}
                />
            )}

            {aiActions.isTranslateModalOpen && (
                <TranslateModal
                    isOpen={aiActions.isTranslateModalOpen}
                    onClose={() => aiActions.setIsTranslateModalOpen(false)}
                    onSubmit={handleTranslateSubmit}
                    customLanguage={modals.customLanguage}
                    setCustomLanguage={modals.setCustomLanguage}
                />
            )}

            {hasNoDocuments && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('welcome')}</h2>
                        <p className="text-gray-600 mb-6">{t('welcomeSubtitle')}</p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => onAddDocument()}
                                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                            >
                                {t('createNew')}
                            </button>
                            <button
                                onClick={() => aiActions.loadSampleDocument(createSampleDocument, onAddDocument)}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                {t('loadSample')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    // Render footer with stats and AI tools
    const renderFooter = () => (
        <div className="mt-auto">
            <div className="flex justify-between items-center border-t border-gray-200 px-4 py-2">
                {isMounted ? (
                    <DocumentStats editor={editor} />
                ) : (
                    <div className="text-gray-400 text-sm">Loading stats...</div>
                )}

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => aiActions.loadSampleDocument(createSampleDocument, onAddDocument)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        {t('loadSample')}
                    </button>
                </div>
            </div>

            {/* AI Assistant Interface - Always expanded */}
            {isMounted && (
                <AIFooter
                    editor={editor}
                    onAIAction={aiActions.handleAIAction}
                    isLoading={aiActions.isLoading}
                />
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Document Header */}
            {renderHeader()}

            {/* Toolbar */}
            {isMounted && (
                <EditorToolbar
                    editor={editor}
                    isLoading={aiActions.isLoading}
                    onLinkClick={modals.handleLinkCommand}
                    onImageClick={modals.handleImageCommand}
                />
            )}

            {/* Main editor area */}
            <div
                className="flex-grow overflow-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pb-32 pt-8 bg-white"
                style={{ minHeight: '200px' }}
            >
                <div
                    className="editor-container max-w-4xl mx-auto"
                    style={dynamicStyles}
                >
                    {isMounted ? (
                        editor ? (
                            <EditorContent editor={editor} className="min-h-[300px]" />
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                Loading editor...
                            </div>
                        )
                    ) : (
                        <div className="text-center py-6 text-gray-400">
                            Initializing editor...
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {renderFooter()}

            {/* Modals */}
            {renderModals()}

            {/* Table Menu */}
            {editor && <TableMenu editor={editor} />}
        </div>
    );
}