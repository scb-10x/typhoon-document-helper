import { Editor as TiptapEditor } from '@tiptap/react';

/**
 * Gets the current HTML content from the editor
 */
export const getEditorContent = (editor: TiptapEditor | null): string => {
    return editor ? editor.getHTML() : '';
};

/**
 * Gets the selected text from the editor, or the entire document text if nothing is selected
 */
export const getSelectedText = (editor: TiptapEditor): string => {
    const { selection } = editor.state;
    return selection.empty
        ? editor.state.doc.textContent
        : editor.state.doc.textBetween(selection.from, selection.to, ' ');
};

/**
 * Checks if there is any text currently selected in the editor
 */
export const hasSelection = (editor: TiptapEditor): boolean => {
    return !editor.state.selection.empty;
}; 