'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, ListOrdered,
    AlignLeft, AlignCenter, AlignRight, Code as CodeIcon, Quote,
    Minus, PanelLeftClose, RotateCcw, RotateCw, Eraser, Strikethrough, Image as ImageIcon,
    Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
} from 'lucide-react';
import FormatButton from './FormatButton';
import HeadingSelector from './HeadingSelector'
import ColorPicker from './ColorPicker';
import HighlightPicker from './HighlightPicker';

interface EditorToolbarProps {
    editor: Editor | null;
    isLoading?: boolean;
    onLinkClick?: () => void;
    onImageClick?: () => void;
}

const EditorToolbar = ({
    editor,
    isLoading,
    onLinkClick,
    onImageClick,
}: EditorToolbarProps) => {
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Add early return if editor is not defined yet
    if (!editor) {
        return (
            <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap items-center top-0 z-10 overflow-y-visible shadow-sm editor-toolbar relative">
                <div className="ml-2 text-gray-400 text-sm">Loading editor...</div>
            </div>
        );
    }

    const handleImage = () => {
        if (onImageClick) {
            onImageClick();
        }
    };

    const handleLink = () => {
        if (onLinkClick) {
            onLinkClick();
        }
    };

    const clearFormatting = () => {
        editor.chain().focus()
            .unsetBold()
            .unsetItalic()
            .unsetStrike()
            .unsetUnderline()
            .unsetHighlight()
            .unsetColor()
            .unsetSubscript()
            .unsetSuperscript()
            .run();
    };

    return (
        <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap items-center top-0 z-10 overflow-y-visible shadow-sm editor-toolbar relative">
            {/* Modern heading selector */}
            <HeadingSelector editor={editor} />

            {/* Text formatting options */}
            <div className="flex items-center mr-1.5">
                <FormatButton
                    icon={<Bold className="w-4 h-4" />}
                    title="Bold (Ctrl+B)"
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                />
                <FormatButton
                    icon={<Italic className="w-4 h-4" />}
                    title="Italic (Ctrl+I)"
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                />
                <FormatButton
                    icon={<UnderlineIcon className="w-4 h-4" />}
                    title="Underline (Ctrl+U)"
                    isActive={editor.isActive('underline')}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                />
                <FormatButton
                    icon={<Strikethrough className="w-4 h-4" />}
                    title="Strikethrough"
                    isActive={editor.isActive('strike')}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                />
                <FormatButton
                    icon={<SubscriptIcon className="w-4 h-4" />}
                    title="Subscript"
                    isActive={editor.isActive('subscript')}
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                />
                <FormatButton
                    icon={<SuperscriptIcon className="w-4 h-4" />}
                    title="Superscript"
                    isActive={editor.isActive('superscript')}
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                />
                <HighlightPicker editor={editor} />
                <ColorPicker editor={editor} />
                <FormatButton
                    icon={<Eraser className="w-4 h-4" />}
                    title="Clear Formatting"
                    onClick={clearFormatting}
                />
                <FormatButton
                    icon={<LinkIcon className="w-4 h-4" />}
                    title="Link (Ctrl+K)"
                    isActive={editor.isActive('link')}
                    onClick={handleLink}
                />
            </div>

            {/* List formatting options */}
            <div className="flex items-center mr-1.5">
                <FormatButton
                    icon={<List className="w-4 h-4" />}
                    title="Bullet List (Ctrl+Shift+8)"
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
                <FormatButton
                    icon={<ListOrdered className="w-4 h-4" />}
                    title="Numbered List (Ctrl+Shift+7)"
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
                <FormatButton
                    icon={<Quote className="w-4 h-4" />}
                    title="Blockquote (Ctrl+Shift+B)"
                    isActive={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                />
                <FormatButton
                    icon={<CodeIcon className="w-4 h-4" />}
                    title="Code Block (Ctrl+Alt+C)"
                    isActive={editor.isActive('codeBlock')}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                />
            </div>

            {/* Text alignment options */}
            <div className="flex items-center mr-1.5">
                <FormatButton
                    icon={<AlignLeft className="w-4 h-4" />}
                    title="Align Left"
                    isActive={!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' })}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                />
                <FormatButton
                    icon={<AlignCenter className="w-4 h-4" />}
                    title="Align Center"
                    isActive={editor.isActive({ textAlign: 'center' })}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                />
                <FormatButton
                    icon={<AlignRight className="w-4 h-4" />}
                    title="Align Right"
                    isActive={editor.isActive({ textAlign: 'right' })}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                />
            </div>

            {/* Other formatting options */}
            <div className="flex items-center mr-1.5">
                <FormatButton
                    icon={<Minus className="w-4 h-4" />}
                    title="Horizontal Rule"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                />
                <FormatButton
                    icon={<ImageIcon className="w-4 h-4" />}
                    title="Insert Image"
                    onClick={handleImage}
                    disabled={isLoading}
                />
            </div>

            {/* History */}
            <div className="flex items-center mr-1.5">
                <FormatButton
                    icon={<RotateCcw className="w-4 h-4" />}
                    title="Undo (Ctrl+Z)"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                />
                <FormatButton
                    icon={<RotateCw className="w-4 h-4" />}
                    title="Redo (Ctrl+Y)"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                />
            </div>

            {/* Keyboard shortcuts button */}
            <div className="ml-auto flex items-center">
                <button
                    onClick={() => setShowShortcuts(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150"
                    title="View keyboard shortcuts"
                >
                    <PanelLeftClose className="w-3.5 h-3.5" />
                    <span>Shortcuts</span>
                </button>
            </div>

            {/* Loading indicator bar */}
            {isLoading && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 z-50">
                    <div className="h-full w-1/3 bg-white opacity-30 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                </div>
            )}

            {/* Shortcuts modal */}
            {showShortcuts && (
                <div
                    className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[10000] backdrop-blur-sm transition-opacity duration-300"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowShortcuts(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h3>
                            <button
                                onClick={() => setShowShortcuts(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4 text-sm text-gray-700 max-h-[60vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="font-medium">Text Formatting</div>
                                <div></div>
                                <div>Bold</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+B</div>
                                <div>Italic</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+I</div>
                                <div>Underline</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+U</div>
                                <div>Link</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+K</div>
                                <div>Strikethrough</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+X</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Headings</div>
                                <div></div>
                                <div>Heading 1</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+1</div>
                                <div>Heading 2</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+2</div>
                                <div>Heading 3</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+3</div>
                                <div>Paragraph</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+0</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Lists</div>
                                <div></div>
                                <div>Bullet List</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+8</div>
                                <div>Numbered List</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+7</div>
                                <div>Decrease Indent</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Shift+Tab</div>
                                <div>Increase Indent</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Tab</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Text Alignment</div>
                                <div></div>
                                <div>Align Left</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+L</div>
                                <div>Align Center</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+E</div>
                                <div>Align Right</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+R</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Blocks</div>
                                <div></div>
                                <div>Blockquote</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+B</div>
                                <div>Code Block</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+C</div>
                                <div>Horizontal Rule</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+Minus</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">History</div>
                                <div></div>
                                <div>Undo</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Z</div>
                                <div>Redo</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Y</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Other</div>
                                <div></div>
                                <div>Select All</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+A</div>
                                <div>Copy</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+C</div>
                                <div>Paste</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+V</div>
                                <div>Cut</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+X</div>
                                <div>Find</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+F</div>
                            </div>
                        </div>
                        <div className="mt-5 text-right">
                            <button
                                onClick={() => setShowShortcuts(false)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorToolbar; 