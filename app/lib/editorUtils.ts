import { Editor as TiptapEditor } from '@tiptap/react';
import { DOMSerializer } from '@tiptap/pm/model';

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
    const { from, to } = selection;
    const slice = editor.state.doc.slice(from, to);
    const fragment = DOMSerializer
        .fromSchema(editor.state.schema)
        .serializeFragment(slice.content);
    
    const container = document.createElement('div');
    container.appendChild(fragment);
    return container.innerHTML;
};

/**
 * Checks if there is any text currently selected in the editor
 */
export const hasSelection = (editor: TiptapEditor): boolean => {
    return !editor.state.selection.empty;
}; 