import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Image } from '@tiptap/extension-image';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

// Create a lowlight instance with common languages
const lowlight = createLowlight(common);

// Create editor extensions
export const createEditorExtensions = () => [
    StarterKit.configure({
        codeBlock: false, // Disable the default code block
        history: {
            depth: 200, // Increase history depth for better undo/redo after AI changes
            newGroupDelay: 500, // Time in ms to wait before creating a new history group
        }
    }),
    Underline,
    Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
            class: 'cursor-pointer text-blue-500 hover:underline',
        },
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Subscript,
    Superscript,
    Image.configure({
        inline: true,
        allowBase64: true,
    }),
    CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
            class: 'rounded-md bg-gray-800 p-4 my-4',
        },
    }),
]; 