import { useState } from 'react';
import { Editor as TiptapEditor } from '@tiptap/react';

export function useEditorModals(editor: TiptapEditor | null) {
    // Modal state
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
    const [customLanguage, setCustomLanguage] = useState("");

    // Link modal functions
    const handleLinkCommand = () => {
        if (!editor) return;
        setIsLinkModalOpen(true);
    };

    const handleLinkSubmit = (url: string) => {
        if (!editor) return;

        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        } else {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }

        setIsLinkModalOpen(false);
    };

    // Image modal functions
    const handleImageCommand = () => {
        if (!editor) return;
        setIsImageModalOpen(true);
    };

    const handleInsertImage = (src: string, alt: string) => {
        if (!editor) return;

        if (src) {
            editor.chain().focus().setImage({ src, alt }).run();
        }

        setIsImageModalOpen(false);
    };

    // Translation modal functions
    const handleTranslateCommand = () => {
        setIsTranslateModalOpen(true);
    };

    const closeTranslateModal = () => {
        setIsTranslateModalOpen(false);
    };

    return {
        // State
        isLinkModalOpen,
        isImageModalOpen,
        isTranslateModalOpen,
        customLanguage,

        // Setters
        setIsLinkModalOpen,
        setIsImageModalOpen,
        setIsTranslateModalOpen,
        setCustomLanguage,

        // Handlers
        handleLinkCommand,
        handleLinkSubmit,
        handleImageCommand,
        handleInsertImage,
        handleTranslateCommand,
        closeTranslateModal,
    };
} 