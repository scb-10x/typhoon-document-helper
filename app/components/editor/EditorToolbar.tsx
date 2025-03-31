'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, ListOrdered,
    AlignLeft, AlignCenter, AlignRight, Code as CodeIcon, Quote,
    Minus, PanelLeftClose, RotateCcw, RotateCw, Eraser, Strikethrough, Image as ImageIcon,
    Subscript as SubscriptIcon, Superscript as SuperscriptIcon, CheckSquare,
    Table as TableIcon,
} from 'lucide-react';
import FormatButton from './FormatButton';
import HeadingSelector from './HeadingSelector'
import ColorPicker from './ColorPicker';
import HighlightPicker from './HighlightPicker';
import { useLanguage } from '../../contexts/LanguageContext';

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
    const { t } = useLanguage();
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
                    title={t('bold')}
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                />
                <FormatButton
                    icon={<Italic className="w-4 h-4" />}
                    title={t('italic')}
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                />
                <FormatButton
                    icon={<UnderlineIcon className="w-4 h-4" />}
                    title={t('underline')}
                    isActive={editor.isActive('underline')}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                />
                <FormatButton
                    icon={<Strikethrough className="w-4 h-4" />}
                    title={t('strikethrough')}
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
                    title={t('bulletList')}
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
                <FormatButton
                    icon={<ListOrdered className="w-4 h-4" />}
                    title={t('numberedList')}
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
                <FormatButton
                    icon={<CheckSquare className="w-4 h-4" />}
                    title={t('taskList')}
                    isActive={editor.isActive('taskList')}
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                />
                <FormatButton
                    icon={<Quote className="w-4 h-4" />}
                    title={t('blockquote')}
                    isActive={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                />
                <FormatButton
                    icon={<CodeIcon className="w-4 h-4" />}
                    title={t('codeBlock')}
                    isActive={editor.isActive('codeBlock')}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                />
            </div>

            {/* Text alignment options */}
            <div className="flex items-center mr-1.5">
                <FormatButton
                    icon={<AlignLeft className="w-4 h-4" />}
                    title={t('alignLeft')}
                    isActive={!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' })}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                />
                <FormatButton
                    icon={<AlignCenter className="w-4 h-4" />}
                    title={t('alignCenter')}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                />
                <FormatButton
                    icon={<AlignRight className="w-4 h-4" />}
                    title={t('alignRight')}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                />
            </div>

            {/* Other formatting options */}
            <div className="flex items-center mr-1.5">
                <FormatButton
                    icon={<Minus className="w-4 h-4" />}
                    title={t('horizontalRule')}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                />
                <FormatButton
                    icon={<ImageIcon className="w-4 h-4" />}
                    title={t('insertImage')}
                    onClick={handleImage}
                    disabled={isLoading}
                />
                <FormatButton
                    icon={<TableIcon className="w-4 h-4" />}
                    title={t('insertTable')}
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    disabled={isLoading}
                />
            </div>

            {/* History */}
            <div className="flex items-center mr-1.5">
                <FormatButton
                    icon={<RotateCcw className="w-4 h-4" />}
                    title={t('undo')}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                />
                <FormatButton
                    icon={<RotateCw className="w-4 h-4" />}
                    title={t('redo')}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                />
            </div>

            {/* Keyboard shortcuts button */}
            <div className="ml-auto flex items-center">
                <button
                    onClick={() => setShowShortcuts(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    title="View keyboard shortcuts"
                >
                    <PanelLeftClose className="w-3.5 h-3.5" />
                    <span>{t('shortcuts')}</span>
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
                            <h3 className="text-lg font-semibold text-gray-900">{t('keyboardShortcuts')}</h3>
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
                                <div className="font-medium">{t('textFormatting')}</div>
                                <div></div>
                                <div>{t('bold')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+B</div>
                                <div>{t('italic')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+I</div>
                                <div>{t('underline')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+U</div>
                                <div>{t('link')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+K</div>
                                <div>{t('strikethrough')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+X</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">{t('headings')}</div>
                                <div></div>
                                <div>{t('heading1')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+1</div>
                                <div>{t('heading2')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+2</div>
                                <div>{t('heading3')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+3</div>
                                <div>{t('paragraph')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+0</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">{t('lists')}</div>
                                <div></div>
                                <div>{t('bulletList')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+8</div>
                                <div>{t('numberedList')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+7</div>
                                <div>{t('taskList')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+9</div>
                                <div>{t('blockquote')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+B</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">{t('other')}</div>
                                <div></div>
                                <div>{t('selectAll')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+A</div>
                                <div>{t('copy')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+C</div>
                                <div>{t('paste')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+V</div>
                                <div>{t('cut')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+X</div>
                                <div>{t('find')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+F</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">{t('tables')}</div>
                                <div></div>
                                <div>{t('nextCell')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Tab</div>
                                <div>{t('previousCell')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Shift+Tab</div>
                                <div>{t('cellAbove')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Arrow Up</div>
                                <div>{t('cellBelow')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Arrow Down</div>
                                <div>{t('insertNewRow')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Enter (at end)</div>
                                <div>{t('selectTable')}</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Triple Click</div>
                            </div>
                        </div>
                        <div className="mt-5 text-right">
                            <button
                                onClick={() => setShowShortcuts(false)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors duration-200"
                            >
                                {t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorToolbar; 