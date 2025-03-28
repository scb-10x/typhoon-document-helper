'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { PDFSettingsDialog, exportToPDF, type PDFExportSettings } from './PDFExport';
import {
    Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, ListOrdered,
    AlignLeft, AlignCenter, AlignRight, Code, Quote, Highlighter,
    Minus, PanelLeftClose, RotateCcw, RotateCw, Eye as EyeIcon,
    FileText, AlignJustify as AlignJustifyIcon, Maximize2, Minimize2,
    BookOpen, Palette, Eraser, Strikethrough, BrainCircuit, Image, Focus,
    Plus, Briefcase, MessageSquare, ChevronDown
} from 'lucide-react';
import {
    DocumentDuplicateIcon, PencilIcon, CheckIcon, ChevronDownIcon,
    DocumentCheckIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, LightBulbIcon,
    ArrowsPointingOutIcon, ArrowsPointingInIcon, ArrowPathIcon, DocumentTextIcon,
    ListBulletIcon as ListIcon, LanguageIcon, PaintBrushIcon, ArrowDownTrayIcon,
    DocumentArrowDownIcon, CodeBracketIcon as CodeIcon,
    BeakerIcon, MegaphoneIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { DOMSerializer } from '@tiptap/pm/model';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

  
const ActionButton = ({ icon, label, onClick, disabled = false }: ActionButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
    >
        {icon}
        <span>{label}</span>
    </button>
);

interface FormatButtonProps {
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const FormatButton = ({ icon, title, isActive = false, onClick, disabled = false }: FormatButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-8 h-8 flex items-center justify-center rounded transition-all duration-200 relative ${isActive
            ? 'bg-purple-100 text-purple-600 shadow-sm'
            : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={title}
    >
        {icon}
        {isActive && (
            <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></span>
        )}
    </button>
);

interface MenuBarProps {
    editor: any;
    onAIAction: (action: string) => void;
    isLoading: boolean;
    smartComposeEnabled?: boolean;
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

const EditorToolbar = ({ editor }: { editor: any }) => {
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showUnsplashModal, setShowUnsplashModal] = useState(false);

    if (!editor) {
        return null;
    }

    const handleInsertImage = (imageUrl: string, altText: string) => {
        editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run();
    };

    const clearFormatting = () => {
        editor.chain().focus()
            .unsetBold()
            .unsetItalic()
            .unsetStrike()
            .unsetUnderline()
            .unsetHighlight()
            .unsetColor()
            .run();
    };

    return (
        <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap items-center sticky top-0 z-10 overflow-y-visible shadow-sm editor-toolbar">
            {/* Modern heading selector - NEW */}
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
                    onClick={() => {
                        const previousUrl = editor.getAttributes('link').href;
                        const url = window.prompt('URL', previousUrl);

                        if (url === null) {
                            return;
                        }

                        if (url === '') {
                            editor.chain().focus().extendMarkRange('link').unsetLink().run();
                            return;
                        }

                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    }}
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
                    icon={<Code className="w-4 h-4" />}
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
                    icon={<Image className="w-4 h-4" />}
                    title="Insert Image"
                    onClick={() => {
                        const url = window.prompt('Enter image URL:');
                        if (url) {
                            const alt = window.prompt('Enter alt text (for accessibility):', '');
                            handleInsertImage(url, alt || '');
                        }
                    }}
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

            {/* Shortcuts modal */}
            {showShortcuts && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
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
                        <div className="space-y-3 text-sm text-gray-700">
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
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Lists</div>
                                <div></div>
                                <div>Bullet List</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+8</div>
                                <div>Numbered List</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+7</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Other</div>
                                <div></div>
                                <div>Blockquote</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+B</div>
                                <div>Code Block</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+C</div>
                                <div>Undo</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Z</div>
                                <div>Redo</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Y</div>
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

interface AIMenuProps {
    title: string;
    icon: React.ReactNode;
    options: { label: string; value: string; icon?: React.ReactNode; description?: string }[];
    onAction: (action: string) => void;
    disabled?: boolean;
}

const AIMenu = ({ title, icon, options, onAction, disabled = false }: AIMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
                {icon}
                <span>{title}</span>
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-stripe-md border border-gray-200 z-50 py-1.5">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onAction(option.value);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-start gap-2 px-3 py-2.5 text-sm text-left text-gray-700 hover:bg-purple-50 transition-colors duration-150"
                        >
                            <div className="mt-0.5 flex-shrink-0">
                                {option.icon || icon}
                            </div>
                            <div>
                                <div className="font-medium">{option.label}</div>
                                {option.description && (
                                    <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Consolidated AI Footer for all AI features
const AIFooter = ({ editor, onAIAction, isLoading, smartComposeEnabled, isExpanded, setIsExpanded }: MenuBarProps) => {
    const [activeTab, setActiveTab] = useState('improve');
    const [searchQuery, setSearchQuery] = useState('');

    if (!editor) {
        return null;
    }

    const allAIOptions = {
        improve: [
            {
                label: "Proofread",
                value: "proofread",
                icon: <DocumentCheckIcon className="w-4 h-4" />,
                description: "Fix spelling, grammar, and punctuation"
            },
            {
                label: "Make professional",
                value: "professional",
                icon: <AcademicCapIcon className="w-4 h-4" />,
                description: "Formal tone for business documents"
            },
            {
                label: "Make casual",
                value: "casual",
                icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
                description: "Conversational, friendly tone"
            },
            {
                label: "Improve clarity",
                value: "clarity",
                icon: <LightBulbIcon className="w-4 h-4" />,
                description: "Make text clearer and easier to understand"
            },
            {
                label: "Fix wordiness",
                value: "concise",
                icon: <ArrowsPointingOutIcon className="w-4 h-4 rotate-45" />,
                description: "Make text more concise without losing meaning"
            }
        ],
        transform: [
            {
                label: "Extend",
                value: "extend",
                icon: <ArrowPathIcon className="w-4 h-4" />,
                description: "Elaborate and expand on selected text"
            },
            {
                label: "Summarize",
                value: "summarize",
                icon: <DocumentTextIcon className="w-4 h-4" />,
                description: "Create a brief summary of key points"
            },
            {
                label: "Bulletize",
                value: "bulletize",
                icon: <ListIcon className="w-4 h-4" />,
                description: "Convert text into a bulleted list"
            },
            {
                label: "Generate action items",
                value: "action-items",
                icon: <CheckIcon className="w-4 h-4" />,
                description: "Create a list of actionable tasks"
            }
        ],
        creative: [
            {
                label: "Generate ideas",
                value: "ideas",
                icon: <LightBulbIcon className="w-4 h-4" />,
                description: "Brainstorm related concepts and thoughts"
            },
            {
                label: "Make creative",
                value: "creative",
                icon: <BeakerIcon className="w-4 h-4" />,
                description: "Add creative flair and originality"
            },
            {
                label: "Marketing copy",
                value: "marketing",
                icon: <MegaphoneIcon className="w-4 h-4" />,
                description: "Persuasive copy to engage readers"
            },
            {
                label: "Storytelling",
                value: "storytelling",
                icon: <PaintBrushIcon className="w-4 h-4" />,
                description: "Narrative style with engaging elements"
            }
        ],
        translate: [
            {
                label: "Spanish",
                value: "translate-es",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to Spanish"
            },
            {
                label: "French",
                value: "translate-fr",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to French"
            },
            {
                label: "German",
                value: "translate-de",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to German"
            },
            {
                label: "Chinese",
                value: "translate-zh",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to Chinese"
            },
            {
                label: "Japanese",
                value: "translate-ja",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to Japanese"
            },
            {
                label: "Russian",
                value: "translate-ru",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to Russian"
            },
            {
                label: "Arabic",
                value: "translate-ar",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to Arabic"
            },
            {
                label: "Portuguese",
                value: "translate-pt",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to Portuguese"
            },
            {
                label: "Italian",
                value: "translate-it",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate selected text to Italian"
            }
        ],
        quick: [
            {
                label: "Make shorter",
                value: "shorten",
                icon: <ArrowsPointingInIcon className="w-4 h-4" />,
                description: "Condense text without losing meaning"
            },
            {
                label: "Make longer",
                value: "lengthen",
                icon: <ArrowsPointingOutIcon className="w-4 h-4" />,
                description: "Expand and elaborate on text"
            },
            {
                label: "Professional tone",
                value: "professional",
                icon: <AcademicCapIcon className="w-4 h-4" />,
                description: "Formal language for business documents"
            },
            {
                label: "Casual tone",
                value: "casual",
                icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
                description: "Conversational, friendly tone"
            }
        ]
    };

    const tabOptions = [
        { id: 'improve', label: 'Improve', icon: <DocumentCheckIcon className="w-4 h-4" /> },
        { id: 'transform', label: 'Transform', icon: <ArrowsPointingOutIcon className="w-4 h-4" /> },
        { id: 'creative', label: 'Creative', icon: <PaintBrushIcon className="w-4 h-4" /> },
        { id: 'translate', label: 'Translate', icon: <LanguageIcon className="w-4 h-4" /> },
        { id: 'quick', label: 'Quick Actions', icon: <LightBulbIcon className="w-4 h-4" /> }
    ];

    // Get the options based on the active tab
    const options = allAIOptions[activeTab as keyof typeof allAIOptions] || [];

    // Filter options based on search query
    const filteredOptions = searchQuery
        ? options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (option.description && option.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : options;

    return (
        <div className="ai-feature-bar bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-6xl mx-auto">
                <div className={`flex items-center p-2 ${isExpanded ? 'border-b border-gray-100' : ''}`}>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
                    >
                        <BrainCircuit className="w-4 h-4 text-purple-600" />
                        AI Assistant
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
                    </button>

                {isExpanded && (
                    <>
                        <div className="ml-4 relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search AI features..."
                                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <button
                            className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${smartComposeEnabled
                                ? 'bg-green-600 text-white shadow-md border border-green-400 font-medium ring-2 ring-green-200'
                                : 'hover:bg-gray-100 border border-transparent'
                                }`}
                            onClick={() => onAIAction('smart-compose')}
                            disabled={isLoading}
                            title="Toggle AI writing suggestions"
                        >
                            <div className="flex items-center gap-2">
                                <PencilIcon className={`w-4 h-4 ${smartComposeEnabled ? 'animate-pulse' : ''}`} />
                                <span>Smart Compose</span>
                                {smartComposeEnabled && (
                                    <span className="flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-green-400 shadow-sm"></span>
                                        <span className="text-xs">ON</span>
                                    </span>
                                )}
                            </div>
                        </button>
                    </>
                )}
            </div>

            {isExpanded && (
                    <div className="p-2">
                    {/* Tab buttons */}
                    <div className="flex overflow-x-auto mb-2 pb-1 scrollbar-hide">
                        {tabOptions.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 mx-1 rounded-md text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Selected tab content */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        {filteredOptions.length === 0 && searchQuery && (
                            <div className="col-span-full p-4 text-center text-gray-500">
                                <p>No AI features match &quot;{searchQuery}&quot;</p>
                            </div>
                        )}

                        {filteredOptions.map((option, index) => (
                            <button
                                key={`${option.value}-${index}`}
                                disabled={isLoading}
                                className={`text-left px-3 py-2 rounded-md transition hover:bg-gray-50 border border-transparent hover:border-gray-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                onClick={() => onAIAction(option.value)}
                            >
                                <div className="flex items-center gap-2">
                                    {option.icon}
                                    <div>
                                        <div className="font-medium text-sm">{option.label}</div>
                                        {option.description && (
                                            <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer tip */}
                    <div className="text-xs text-center text-gray-500 mt-2 pb-1">
                        <span>Tip: Select text first for more precise AI actions</span>
                    </div>
                </div>
            )}
        </div>
    </div>);
}

interface FloatingActionBarProps {
    onFormat: (format: string) => void;
    isLoading: boolean;
}

const FloatingActionBar = ({ onFormat, isLoading }: FloatingActionBarProps) => {
    const [showFormatOptions, setShowFormatOptions] = useState(false);
    const formatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formatRef.current && !formatRef.current.contains(event.target as Node)) {
                setShowFormatOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatOptions = [
        { label: 'Make it shorter', value: 'shorten', icon: <Minus className="w-4 h-4" /> },
        { label: 'Make it longer', value: 'lengthen', icon: <Plus className="w-4 h-4" /> },
        { label: 'More professional', value: 'professional', icon: <Briefcase className="w-4 h-4" /> },
        { label: 'More casual', value: 'casual', icon: <MessageSquare className="w-4 h-4" /> },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50" ref={formatRef}>
            <div className="flex items-center justify-center">
                <div className={`bg-white rounded-full shadow-lg border border-gray-200 p-1.5 flex items-center gap-2 transition-all duration-300 ${showFormatOptions ? 'px-3' : ''}`}>
                    <button
                        onClick={() => setShowFormatOptions(!showFormatOptions)}
                        disabled={isLoading}
                        className={`p-2 rounded-full transition-all duration-200 relative flex items-center justify-center ${isLoading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : showFormatOptions
                                ? 'bg-purple-100 text-purple-700 shadow-sm'
                                : 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700'
                            }`}
                        title="AI formatting options"
                    >
                        {isLoading ? (
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        ) : (
                            <BrainCircuit className="w-5 h-5" />
                        )}
                    </button>

                    {showFormatOptions && (
                        <div className="flex items-center gap-2 animate-slideUp">
                            {formatOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onFormat(option.value);
                                        setShowFormatOptions(false);
                                    }}
                                    disabled={isLoading}
                                    className="flex items-center gap-1.5 bg-white text-gray-700 px-3 py-1.5 text-sm font-medium rounded-full hover:bg-purple-50 hover:text-purple-700 border border-gray-100 shadow-sm transition-all duration-150 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={option.label}
                                >
                                    <span className="text-gray-500 group-hover:text-purple-600 transition-colors">
                                        {option.icon}
                                    </span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface Document {
    id: number;
    name: string;
    content: string;
}

// Function to convert HTML to Markdown
const htmlToMarkdown = (html: string): string => {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Track if we have any colored text or highlights to warn about
    let hasColorsOrHighlights = false;

    // Function to process a node and its children
    const processNode = (node: Node, depth: number = 0): string => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        // Handle special tags
        switch (tagName) {
            case 'h1': return `# ${processChildNodes(element)}\n\n`;
            case 'h2': return `## ${processChildNodes(element)}\n\n`;
            case 'h3': return `### ${processChildNodes(element)}\n\n`;
            case 'h4': return `#### ${processChildNodes(element)}\n\n`;
            case 'h5': return `##### ${processChildNodes(element)}\n\n`;
            case 'h6': return `###### ${processChildNodes(element)}\n\n`;
            case 'p': return `${processChildNodes(element)}\n\n`;
            case 'strong':
            case 'b': return `**${processChildNodes(element)}**`;
            case 'em':
            case 'i': return `*${processChildNodes(element)}*`;
            case 'u': return `<u>${processChildNodes(element)}</u>`;
            case 's':
            case 'strike':
            case 'del': return `~~${processChildNodes(element)}~~`;
            case 'code': return element.parentElement?.tagName.toLowerCase() === 'pre'
                ? processChildNodes(element)
                : `\`${processChildNodes(element)}\``;
            case 'pre': return `\`\`\`\n${processChildNodes(element)}\n\`\`\`\n\n`;
            case 'a': return `[${processChildNodes(element)}](${element.getAttribute('href') || '#'})`;
            case 'img': {
                const src = element.getAttribute('src') || '';
                const alt = element.getAttribute('alt') || '';
                return `![${alt}](${src})`;
            }
            case 'figure': {
                // For figures with images and captions
                const img = element.querySelector('img');
                const figcaption = element.querySelector('figcaption');

                if (img) {
                    const src = img.getAttribute('src') || '';
                    const alt = img.getAttribute('alt') || '';
                    const caption = figcaption ? figcaption.textContent : '';

                    return caption
                        ? `![${alt}](${src})\n*${caption}*\n\n`
                        : `![${alt}](${src})\n\n`;
                }
                return processChildNodes(element);
            }
            case 'blockquote': return `> ${processChildNodes(element).replace(/\n/g, '\n> ')}\n\n`;
            case 'br': return '\n';
            case 'hr': return '---\n\n';
            case 'ul': return `${processListItems(element, '- ')}\n`;
            case 'ol': return `${processListItems(element, (i: number) => `${i + 1}. `)}\n`;
            case 'li': return processChildNodes(element);
            default: return processChildNodes(element);
        }
    };

    // Process list items with proper indentation and markers
    const processListItems = (listElement: HTMLElement, marker: string | ((index: number) => string)): string => {
        let result = '';
        const items = listElement.querySelectorAll('li');
        items.forEach((item, index) => {
            let depth = 0;
            let parent = item.parentElement;
            while (parent && parent !== listElement) {
                if (parent.tagName.toLowerCase() === 'ul' || parent.tagName.toLowerCase() === 'ol') {
                    depth++;
                }
                parent = parent.parentElement;
            }

            const indent = '  '.repeat(depth);
            const markerText = typeof marker === 'function' ? marker(index) : marker;
            result += `${indent}${markerText} ${processChildNodes(item)}\n`;
        });
        return result;
    };

    // Process all child nodes of an element
    const processChildNodes = (element: HTMLElement): string => {
        return Array.from(element.childNodes)
            .map(node => processNode(node))
            .join('');
    };

    // Process the entire HTML content
    let markdown = '';
    Array.from(tempDiv.childNodes).forEach(node => {
        markdown += processNode(node);
    });

    // Final cleanup
    markdown = markdown
        .replace(/\n\n\n+/g, '\n\n') // Remove extra line breaks
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');

    // Add a note about color formatting if necessary
    if (hasColorsOrHighlights) {
        markdown = `> **Note:** This document contains colored text or highlights that cannot be fully represented in Markdown. For best results with colors, use the HTML export option.\n\n${markdown}`;
    }

    return markdown;
};

interface ExportMenuProps {
    documentName: string;
    documentContent: string;
    isLoading: boolean;
}

const ExportMenu = ({ documentName, documentContent, isLoading }: ExportMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [showPDFSettings, setShowPDFSettings] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const exportAsHTML = () => {
        try {
            // Keep span tags with style attributes for colors and highlights,
            // but remove other unnecessary attributes
            const cleanedHTML = documentContent
                .replace(/ class="[^"]*"/g, '') // Remove class attributes
                .replace(/ contenteditable="[^"]*"/g, '') // Remove contenteditable
                .replace(/ data-[^=]*="[^"]*"/g, ''); // Remove data-* attributes

            // Add DOCTYPE, charset and basic styling to ensure proper rendering
            const fullHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${documentName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #374151;
            padding: 1rem;
            max-width: 800px;
            margin: 0 auto;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        p {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
        }
        /* Preserve highlighted text styles */
        span[style*="background-color"] {
            padding: 2px 0;
            border-radius: 2px;
            display: inline;
        }
        /* Ensure strikethrough is visible */
        s, del, strike {
            text-decoration: line-through;
        }
        /* List styling */
        ul {
            list-style-type: disc;
            margin-left: 1.5em;
            margin-bottom: 1em;
        }
        ol {
            list-style-type: decimal;
            margin-left: 1.5em;
            margin-bottom: 1em;
        }
        li {
            margin-bottom: 0.5em;
            display: list-item;
        }
        ul ul {
            list-style-type: circle;
        }
        ol ol {
            list-style-type: lower-alpha;
        }
        blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            font-style: italic;
            margin-left: 0;
        }
        pre {
            background-color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.375rem;
            overflow-x: auto;
        }
        code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 0.9em;
        }
        /* Image styling */
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em auto;
            border-radius: 4px;
        }
        figure {
            margin: 1em 0;
            text-align: center;
        }
        figcaption {
            font-size: 0.9em;
            color: #6b7280;
            margin-top: 0.5em;
        }
    </style>
</head>
<body>
    ${cleanedHTML}
</body>
</html>`;

            const element = document.createElement('a');
            const file = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(file);

            element.href = url;
            element.download = `${documentName}.html`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            // Clean up URL object to avoid memory leaks
            setTimeout(() => URL.revokeObjectURL(url), 100);

            toast.success(`Document exported as HTML`);
        } catch (error) {
            console.error('Error exporting to HTML:', error);
            toast.error('Failed to export as HTML. Please try again.');
        }

        setIsOpen(false);
    };

    const exportAsMarkdown = () => {
        try {
            const markdown = htmlToMarkdown(documentContent);
            const element = document.createElement('a');
            const file = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(file);

            element.href = url;
            element.download = `${documentName}.md`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            // Clean up URL object to avoid memory leaks
            setTimeout(() => URL.revokeObjectURL(url), 100);

            // Check if the document has images, colors, or highlighting
            const hasImages = documentContent.includes('<img');
            const hasFormatting = documentContent.includes('style="color:') || documentContent.includes('style="background-color:');

            if (hasImages && hasFormatting) {
                toast.success(`Document exported as Markdown. Images are included as links, and some formatting like colors may be lost. Use HTML or PDF for full formatting.`, { duration: 6000 });
            } else if (hasImages) {
                toast.success(`Document exported as Markdown. Images are included as Markdown image links.`, { duration: 5000 });
            } else if (hasFormatting) {
                toast.success(`Document exported as Markdown, but some formatting like colors and highlights may be lost. Use HTML export to preserve all formatting.`, { duration: 5000 });
            } else {
                toast.success(`Document exported as Markdown`);
            }
        } catch (error) {
            console.error('Error exporting to Markdown:', error);
            toast.error('Failed to export as Markdown. Please try again.');
        }

        setIsOpen(false);
    };

    const exportAsTXT = () => {
        try {
            // Create a temporary div to extract text
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = documentContent;

            // Get plain text content
            const textContent = tempDiv.innerText || tempDiv.textContent || '';

            // Create download link
            const element = document.createElement('a');
            const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(file);

            element.href = url;
            element.download = `${documentName}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            // Clean up URL object to avoid memory leaks
            setTimeout(() => URL.revokeObjectURL(url), 100);

            toast.success(`Document exported as plain text`);
        } catch (error) {
            console.error('Error exporting to TXT:', error);
            toast.error('Failed to export as plain text. Please try again.');
        }

        setIsOpen(false);
    };

    const exportAsPDF = (settings: PDFExportSettings) => {
        exportToPDF(settings, documentContent)
            .then(() => {
                setShowPDFSettings(false);
                setIsOpen(false);
            });
    };

    const exportOptions = [
        {
            label: 'Export as PDF',
            value: 'pdf',
            action: () => setShowPDFSettings(true),
            icon: <FileText className="w-4 h-4" />,
            description: 'Best for printing and offline sharing'
        },
        {
            label: 'Export as Markdown',
            value: 'markdown',
            action: exportAsMarkdown,
            icon: <DocumentArrowDownIcon className="w-4 h-4" />,
            description: 'Best for technical documentation and GitHub'
        },
        {
            label: 'Export as HTML',
            value: 'html',
            action: exportAsHTML,
            icon: <CodeIcon className="w-4 h-4" />,
            description: 'Best for web publishing and blogs'
        },
        {
            label: 'Export as Text',
            value: 'txt',
            action: exportAsTXT,
            icon: <FileText className="w-4 h-4" />,
            description: 'Best for simple, formatting-free text'
        }
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={`p-1.5 rounded-full transition-all duration-200 ${isLoading
                    ? 'bg-purple-50 text-purple-400 cursor-not-allowed'
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100'
                    }`}
                title={isLoading ? "Export in progress..." : "Export document"}
            >
                {isLoading ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : (
                    <ArrowDownTrayIcon className="w-5 h-5" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1.5 animate-fadeIn">
                    {exportOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={option.action}
                            className="w-full flex items-start gap-2 px-3 py-2.5 text-sm text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150 group"
                        >
                            <div className="mt-0.5 flex-shrink-0 text-gray-500 group-hover:text-purple-600 transition-colors duration-150">
                                {option.icon}
                            </div>
                            <div>
                                <div className="font-medium">{option.label}</div>
                                {option.description && (
                                    <div className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-600 transition-colors duration-150">
                                        {option.description}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* PDF Settings Dialog */}
            <PDFSettingsDialog
                isOpen={showPDFSettings}
                onClose={() => setShowPDFSettings(false)}
                onExport={exportAsPDF}
                documentName={documentName}
            />
        </div>
    );
};

interface ComfortSettingsProps {
    fontSize: number;
    setFontSize: (size: number) => void;
    lineHeight: number;
    setLineHeight: (height: number) => void;
    readingMode: boolean;
    setReadingMode: (mode: boolean) => void;
    isLoading: boolean;
}

const ComfortSettings = ({
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    readingMode,
    setReadingMode,
    isLoading
}: Omit<ComfortSettingsProps, 'darkMode' | 'setDarkMode' | 'focusMode' | 'setFocusMode'>) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={`p-1.5 rounded-full transition-all duration-200 ${isOpen
                    ? 'bg-purple-100 text-purple-600'
                    : isLoading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100'
                    }`}
                title="Eye comfort settings"
            >
                <EyeIcon className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-5 animate-fadeIn">
                    <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                        <EyeIcon className="w-4 h-4 text-purple-600" />
                        Eye Comfort Settings
                    </h3>

                    <div className="space-y-5">
                        {/* Font Size */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-medium text-gray-700">Font Size</label>
                                <span className="text-xs bg-purple-50 text-purple-700 font-medium px-2 py-0.5 rounded-full">{fontSize}px</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                                    className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 p-1 rounded transition-colors"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                                <input
                                    type="range"
                                    min="12"
                                    max="24"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <button
                                    onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                                    className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 p-1 rounded transition-colors"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Line Height */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-medium text-gray-700">Line Spacing</label>
                                <span className="text-xs bg-purple-50 text-purple-700 font-medium px-2 py-0.5 rounded-full">{lineHeight.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))}
                                    className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 p-1 rounded transition-colors"
                                >
                                    <AlignJustifyIcon className="w-4 h-4 transform rotate-90 scale-75" />
                                </button>
                                <input
                                    type="range"
                                    min="1.2"
                                    max="2.0"
                                    step="0.1"
                                    value={lineHeight}
                                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <button
                                    onClick={() => setLineHeight(Math.min(2.0, lineHeight + 0.1))}
                                    className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 p-1 rounded transition-colors"
                                >
                                    <AlignJustifyIcon className="w-4 h-4 transform rotate-90" />
                                </button>
                            </div>
                        </div>

                        {/* Special Modes */}
                        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setReadingMode(!readingMode)}
                                className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${readingMode
                                    ? 'border-purple-300 bg-purple-50 text-purple-700 shadow-sm'
                                    : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>{readingMode ? "Exit Reading Mode" : "Reading Mode"}</span>
                                {readingMode && (
                                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Modern heading selector component
const HeadingSelector = ({ editor }: { editor: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const headingOptions = [
        { label: 'Paragraph', value: 'paragraph' },
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
    ];

    const getCurrentHeading = () => {
        if (!editor) return headingOptions[0];

        if (editor.isActive('heading', { level: 1 })) return headingOptions[1];
        if (editor.isActive('heading', { level: 2 })) return headingOptions[2];
        if (editor.isActive('heading', { level: 3 })) return headingOptions[3];

        return headingOptions[0];
    };

    const handleHeadingChange = (value: string) => {
        if (!editor) return;

        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else if (value === 'h1') {
            editor.chain().focus().setHeading({ level: 1 }).run();
        } else if (value === 'h2') {
            editor.chain().focus().setHeading({ level: 2 }).run();
        } else if (value === 'h3') {
            editor.chain().focus().setHeading({ level: 3 }).run();
        }

        setIsOpen(false);
    };

    const currentHeading = getCurrentHeading();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm font-medium hover:bg-gray-100 text-gray-700 transition-colors"
            >
                <span>{currentHeading.label}</span>
                <ChevronDownIcon className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-30 py-1 editor-toolbar-dropdown">
                    {headingOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleHeadingChange(option.value)}
                            className={`w-full text-left px-3 py-2 ${option.value === currentHeading.value ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {option.value === 'paragraph' ? (
                                <span className="text-sm">Paragraph</span>
                            ) : option.value === 'h1' ? (
                                <span className="text-xl font-bold">Heading 1</span>
                            ) : option.value === 'h2' ? (
                                <span className="text-lg font-semibold">Heading 2</span>
                            ) : (
                                <span className="text-base font-medium">Heading 3</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Selection Context Menu component for AI actions on selected text
const SelectionContextMenu = ({ editor, onAIAction, position, onClose }: {
    editor: any;
    onAIAction: (action: string) => void;
    position: { x: number, y: number };
    onClose: () => void;
}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({ x: position.x, y: position.y });

    // Adjust position if menu would go off-screen
    useEffect(() => {
        if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let newX = position.x;
            let newY = position.y;

            // Check right edge
            if (position.x + menuRect.width > viewportWidth) {
                newX = viewportWidth - menuRect.width - 10;
            }

            // Check bottom edge
            if (position.y + menuRect.height > viewportHeight) {
                newY = viewportHeight - menuRect.height - 10;
            }

            // Update position if needed
            if (newX !== position.x || newY !== position.y) {
                setMenuPosition({ x: newX, y: newY });
            }
        }
    }, [position]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Add both event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    // Common AI actions categorized
    const menuItems = [
        {
            category: 'Improve',
            items: [
                { label: 'Proofread', action: 'proofread', icon: <DocumentCheckIcon className="w-4 h-4 text-purple-600" /> },
                { label: 'Make professional', action: 'professional', icon: <AcademicCapIcon className="w-4 h-4 text-purple-600" /> },
                { label: 'Improve clarity', action: 'clarity', icon: <LightBulbIcon className="w-4 h-4 text-purple-600" /> }
            ]
        },
        {
            category: 'Transform',
            items: [
                { label: 'Summarize', action: 'summarize', icon: <DocumentTextIcon className="w-4 h-4 text-purple-600" /> },
                { label: 'Extend', action: 'extend', icon: <ArrowPathIcon className="w-4 h-4 text-purple-600" /> },
                { label: 'Bulletize', action: 'bulletize', icon: <ListIcon className="w-4 h-4 text-purple-600" /> }
            ]
        },
        {
            category: 'Translate',
            items: [
                { label: 'Translate to Spanish', action: 'translate-es', icon: <LanguageIcon className="w-4 h-4 text-purple-600" /> },
                { label: 'Translate to French', action: 'translate-fr', icon: <LanguageIcon className="w-4 h-4 text-purple-600" /> },
                { label: 'Translate to German', action: 'translate-de', icon: <LanguageIcon className="w-4 h-4 text-purple-600" /> }
            ]
        }
    ];

    const handleAction = (action: string) => {
        onAIAction(action);
        onClose();
    };

    return (
        <div
            className="ai-context-menu"
            style={{
                top: menuPosition.y,
                left: menuPosition.x
            }}
            ref={menuRef}
        >
            {menuItems.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                    {categoryIndex > 0 && <div className="ai-context-menu-category">{category.category}</div>}
                    {!categoryIndex && <div className="ai-context-menu-category">AI Actions</div>}
                    {category.items.map((item, itemIndex) => (
                        <div
                            key={itemIndex}
                            className="ai-context-menu-item"
                            onClick={() => handleAction(item.action)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

// Fix the setColor function in the ColorPicker component
const ColorPicker = ({ editor }: { editor: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const colorRef = useRef<HTMLDivElement>(null);

    // Text colors
    const colors = [
        { name: 'Default', value: '#000000' },
        { name: 'Gray', value: '#6B7280' },
        { name: 'Red', value: '#EF4444' },
        { name: 'Yellow', value: '#F59E0B' },
        { name: 'Green', value: '#10B981' },
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Pink', value: '#EC4899' },
    ];

    const handleClickOutside = (event: MouseEvent) => {
        if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const setColor = (color: string) => {
        try {
            // First, try to extend the selection if needed (helps with single click and cursor position)
            editor.chain().focus().extendMarkRange('textStyle').run();
            // Then set the color
            editor.chain().focus().setColor(color).run();
            setIsOpen(false);
        } catch (error) {
            console.error("Error setting text color:", error);
        }
    };

    // Clear the text color
    const removeColor = () => {
        editor.chain().focus().extendMarkRange('textStyle').unsetColor().run();
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={colorRef}>
            <FormatButton
                icon={<Palette className="w-4 h-4" />}
                title="Text Color"
                isActive={editor.isActive('textStyle')}
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <div className="absolute z-10 top-full mt-1 left-0 bg-white border border-gray-200 shadow-lg rounded-md p-2 w-48">
                    <div className="grid grid-cols-4 gap-1">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                                onClick={() => setColor(color.value)}
                            >
                                {editor.isActive('textStyle', { color: color.value }) && (
                                    <span className={`text-xs ${color.value === '#000000' ? 'text-white' : ''}`}>✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <button
                            className="w-full text-left text-sm py-1 px-2 hover:bg-gray-100 rounded"
                            onClick={removeColor}
                        >
                            Remove color
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Fix the HighlightPicker component to properly apply highlight colors
const HighlightPicker = ({ editor }: { editor: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const highlightRef = useRef<HTMLDivElement>(null);

    // Highlight colors
    const highlightColors = [
        { name: 'Yellow', value: '#FFFF00' },
        { name: 'Green', value: '#CCFF90' },
        { name: 'Pink', value: '#F8BBD0' },
        { name: 'Blue', value: '#90CAF9' },
        { name: 'Orange', value: '#FFCC80' },
        { name: 'Purple', value: '#D1C4E9' },
    ];

    const handleClickOutside = (event: MouseEvent) => {
        if (highlightRef.current && !highlightRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const applyHighlight = (color: string) => {
        try {
            // First extend the mark range if needed to ensure the whole selection is covered
            editor.chain().focus().extendMarkRange('highlight').run();

            // Then apply the highlight color - use setHighlight instead of toggleHighlight to ensure it's applied
            editor.chain().focus().setHighlight({ color }).run();
            setIsOpen(false);
        } catch (error) {
            console.error("Error applying highlight:", error);
        }
    };

    const removeHighlight = () => {
        editor.chain().focus().extendMarkRange('highlight').unsetHighlight().run();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={highlightRef}>
            <FormatButton
                icon={<Highlighter className="w-4 h-4" />}
                title="Highlight"
                isActive={editor.isActive('highlight')}
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <div className="absolute z-10 top-full mt-1 left-0 bg-white border border-gray-200 shadow-lg rounded-md p-2 w-48">
                    <div className="grid grid-cols-3 gap-1">
                        {highlightColors.map((color) => (
                            <button
                                key={color.value}
                                className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                                onClick={() => applyHighlight(color.value)}
                            >
                                {editor.isActive('highlight', { color: color.value }) && (
                                    <span className="text-gray-800 text-xs">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <button
                            className="w-full text-left text-sm py-1 px-2 hover:bg-gray-100 rounded"
                            onClick={removeHighlight}
                        >
                            Remove highlight
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Editor() {
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([
        { id: 1, name: 'Getting Started', content: `<h1>Sample Document</h1>
            <p>This is a sample document showing different formatting options available in the editor.</p>
            
            <h2>Text Formatting</h2>
            <p>You can make text <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>. You can also use <code>inline code</code> for technical terms.</p>
            
            <h2>Lists</h2>
            <p>Here's an unordered list:</p>
            <ul>
                <li>Item two</li>
                <li>Item three with <strong>formatting</strong></li>
            </ul>
            
            <p>And here's an ordered list:</p>
            <ol>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
            </ol>
            
            <h2>Links and Quotes</h2>
            <p>You can add <a href="https://example.com">links to websites</a> easily.</p>
            
            <blockquote>
                <p>This is a blockquote that can be used for quotes or important notes.</p>
            </blockquote>
            
            <h2>Code Blocks</h2>
            <pre><code>// This is a code block
function example() {
  console.log("Hello, world!");
}
            </code></pre>
            
            <h2>Export Features</h2>
            <p>Try exporting this document to different formats using the export button in the toolbar:</p>
            <ul>
                <li>PDF - for sharing documents that shouldn't be edited</li>
                <li>Word - for further editing in Microsoft Word</li>
                <li>Markdown - for technical documentation and GitHub</li>
                <li>HTML - for web publishing and blogs</li>
                <li>Text - for simple, formatting-free text</li>
            </ul>` },
        { id: 2, name: 'Meeting Notes', content: '<h2>Project Kickoff Meeting</h2><p>Date: January 15, 2023</p><p>Attendees:</p><ul><li>John Smith (Project Manager)</li><li>Jane Doe (Designer)</li><li>Bob Johnson (Developer)</li></ul><p>Key discussion points:</p><ol><li>Project timeline review</li><li>Resource allocation</li><li>Initial design concepts</li></ol>' },
        { id: 3, name: 'Ideas', content: '<h2>Product Feature Ideas</h2><p>Here are some ideas for our upcoming product release:</p><ul><li>Integration with third-party services</li><li>Improved user onboarding flow</li><li>Advanced analytics dashboard</li></ul><blockquote>Remember to prioritize features based on user feedback and strategic goals.</blockquote>' }
    ]);
    const [activeDocument, setActiveDocument] = useState(1);
    const [documentName, setDocumentName] = useState('Getting Started');
    const [isEditing, setIsEditing] = useState(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 } });
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [smartComposeEnabled, setSmartComposeEnabled] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const previousTextRef = useRef('');
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [readingMode, setReadingMode] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    
    // Reference to track if we should update document on activeDocument change
    const shouldUpdateDocumentRef = useRef(true);
    // Reference to track current document content
    const documentContentRef = useRef<{ id: number, content: string } | null>(null);
    // Reference for auto-save debounce
    const smartComposeDebounceRef = useRef<NodeJS.Timeout | null>(null);
    // Reference for title input
    const titleRef = useRef<HTMLInputElement>(null);
    
    // AI Assistant bar expanded state and ref
    const aiFooterRef = useRef<HTMLDivElement>(null);
    const [isAIBarExpanded, setIsAIBarExpanded] = useState(true);
    
    // Get the content of the active document
    const activeDocumentContent = documents.find(doc => doc.id === activeDocument)?.content || '';
    
    // Initialize the editor with basic extensions
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: 'editor-paragraph',
                    },
                },
            }),
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            // Add Highlight extension with colors support
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: 'highlighted-text',
                },
            }),
            TextStyle,
            Color,
        ],
        content: activeDocumentContent,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            // Debounce content changes - don't save immediately on every keystroke
            if (smartComposeDebounceRef.current) {
                clearTimeout(smartComposeDebounceRef.current);
            }

            smartComposeDebounceRef.current = setTimeout(() => {
                // Track content changes for auto-save functionality
                handleContentChange();
            }, 1000); // 1 second debounce
        },
        editorProps: {
            // Override default handling of spaces and line breaks
            handleDOMEvents: {
                keydown: (view, event) => {
                    // Handle Tab key to prevent focus switching
                    if (event.key === 'Tab') {
                        // Check if editor is focused before handling tab
                        const isEditorFocused = document.activeElement === view.dom ||
                            view.dom.contains(document.activeElement);

                        // Allow default tab behavior if editor is not focused
                        if (!isEditorFocused) {
                            return false;
                        }

                        // If smart compose has a suggestion, don't handle the tab here
                        // It will be handled by the smart compose handler
                        if (suggestion && smartComposeEnabled) {
                            return false; // Let the other handler take care of it
                        }

                        // Prevent default tab behavior (focus switching)
                        event.preventDefault();

                        const { state } = view;
                        const { selection } = state;

                        // Check if we're in a list - if so, handle indentation differently
                        if (editor && (editor.isActive('bulletList') || editor.isActive('orderedList'))) {
                            if (event.shiftKey) {
                                // Shift+Tab lifts the list item (outdent)
                                editor.chain().focus().liftListItem('listItem').run();
                            } else {
                                // Tab sinks the list item (indent)
                                editor.chain().focus().sinkListItem('listItem').run();
                            }
                            return true;
                        } else {
                            // For regular text, insert spaces for indentation
                            if (event.shiftKey) {
                                // Shift+Tab for outdent - Currently just inserts spaces
                                return view.dispatch(view.state.tr.insertText('    '));
                            } else {
                                // Regular tab for indent - using 4 spaces for consistent formatting
                                return view.dispatch(view.state.tr.insertText('    '));
                            }
                        }
                    }

                    // Handle multiple spaces correctly
                    if (event.key === ' ' && event.repeat) {
                        const { state, dispatch } = view;
                        dispatch(state.tr.insertText(' '));
                        return true;
                    }

                    // Ensure enter key creates proper paragraphs with consistent spacing
                    if (event.key === 'Enter') {
                        // Let the editor handle it normally, but we'll ensure proper spacing via CSS
                        const { state } = view;
                        const { selection } = state;

                        // If Shift+Enter is pressed, insert a line break instead of a new paragraph
                        if (event.shiftKey) {
                            const { $from, $to } = selection;
                            view.dispatch(
                                state.tr.replaceSelectionWith(
                                    state.schema.nodes.hardBreak.create()
                                )
                            );
                            return true;
                        }
                    }

                    // Hide context menu on Escape
                    if (event.key === 'Escape' && contextMenu.visible) {
                        setContextMenu(prev => ({ ...prev, visible: false }));
                        return true;
                    }

                    return false;
                },
                // Add context menu event handler
                contextmenu: (view, event) => {
                    // Prevent default browser context menu
                    event.preventDefault();

                    // Get current selection
                    const { state } = view;
                    const { from, to } = state.selection;
                    const isTextSelected = from !== to;

                    // Only show the menu if text is selected
                    if (isTextSelected) {
                        // Calculate accurate position for the context menu
                        // Sometimes clientX/Y can be inconsistent
                        let x = event.clientX;
                        let y = event.clientY;

                        // If coordinates are not available or invalid, try to get from selection
                        if (!x || !y || x < 0 || y < 0) {
                            try {
                                const domSelection = window.getSelection();
                                if (domSelection && domSelection.rangeCount > 0) {
                                    const range = domSelection.getRangeAt(0);
                                    const rect = range.getBoundingClientRect();
                                    x = rect.right;
                                    y = rect.bottom;
                                }
                            } catch (e) {
                                console.error('Failed to get selection position:', e);
                            }
                        }

                        setContextMenu({
                            visible: true,
                            position: { x, y }
                        });
                    } else {
                        // Hide context menu if no text is selected
                        setContextMenu(prev => ({ ...prev, visible: false }));
                    }

                    return true;
                }
            },
            // Improved paste handling for spaces and newlines
            handlePaste: (view, event, slice) => {
                if (event.clipboardData && event.clipboardData.getData('text')) {
                    // Get the plain text from clipboard
                    const text = event.clipboardData.getData('text');

                    // Create a new transaction
                    const { state } = view;
                    const { tr } = state;

                    // Process the text to preserve spaces and line breaks
                    const processedText = text
                        // Convert regular spaces to non-breaking spaces when there are multiple in a row
                        .replace(/  +/g, (match) => {
                            return ' ' + '\u00A0'.repeat(match.length - 1);
                        })
                        // Replace single newlines with <br> for proper line breaks
                        .replace(/\n/g, '\n');

                    // Insert the processed text
                    view.dispatch(tr.insertText(processedText));

                    return true;
                }
                return false;
            },
            // Custom attributes for the editor DOM element
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
                spellcheck: 'true',
            },
        },
    });

    useEffect(() => {
        if (editor) {
            editor.setOptions({
                editorProps: {
                    handleKeyDown: (view, event) => {
                        // Accept suggestion with Tab key - this needs to take precedence over tab indent
                        if (event.key === 'Tab' && suggestion && smartComposeEnabled) {
                            event.preventDefault();
                            editor.commands.insertContent(suggestion);
                            setSuggestion('');
                            return true;
                        }
                        // Clear suggestion with Escape key
                        if (event.key === 'Escape' && suggestion) {
                            event.preventDefault();
                            setSuggestion('');
                            return true;
                        }
                        // Let other key events pass through
                        return false;
                    }
                }
            });
        }
    }, [editor, suggestion, smartComposeEnabled]);

    // When smart compose is toggled, update the extension configuration
    useEffect(() => {
        if (editor) {
            // Recreate the editor with updated configuration instead of modifying existing extension
            if (!smartComposeEnabled) {
                setSuggestion('');
            }

            // Store the smartComposeEnabled state in editor storage for other components to access
            if (!editor.storage.smartCompose) {
                editor.storage.smartCompose = {};
            }
            editor.storage.smartCompose.enabled = smartComposeEnabled;

            // Force a state update to refresh decorations
            editor.view.updateState(editor.view.state);
        }
    }, [smartComposeEnabled, editor]);

    // Track editor focus state for proper tab key behavior
    useEffect(() => {
        if (editor) {
            const editorElement = editor.view.dom;

            // Add a class to help with styling when editor is focused
            const handleEditorFocus = () => {
                editorElement.classList.add('editor-has-focus');
            };

            const handleEditorBlur = () => {
                editorElement.classList.remove('editor-has-focus');
            };

            // Add the event listeners
            editorElement.addEventListener('focus', handleEditorFocus);
            editorElement.addEventListener('blur', handleEditorBlur);

            // Clean up
            return () => {
                editorElement.removeEventListener('focus', handleEditorFocus);
                editorElement.removeEventListener('blur', handleEditorBlur);
            };
        }
    }, [editor]);

    useEffect(() => {
        if (isEditing && titleRef.current) {
            titleRef.current.focus();
        }
    }, [isEditing]);

    const handleAIAction = async (action: string) => {
        if (!editor) return;

        // Get selected text or all content if nothing is selected
        const { from, to } = editor.state.selection;
        const isTextSelected = from !== to;
        // Get plain text selection
        const selectedText = isTextSelected ? editor.state.doc.textBetween(from, to, ' ') : '';
        // Get HTML content properly
        let htmlContent = '';
        if (isTextSelected) {
            const slice = editor.state.doc.slice(from, to);
            const fragment = DOMSerializer
              .fromSchema(editor.state.schema)
              .serializeFragment(slice.content);
          
            const container = document.createElement('div');
            container.appendChild(fragment);
            htmlContent = container.innerHTML;
        } else {
            htmlContent = editor.getHTML();
        }
        
        const plainContent = selectedText || editor.getText();

        if (!plainContent.trim() && action !== 'brainstorm') {
            toast.error('Please select text or write something first');
            return;
        }

        setIsLoading(true);

        try {
            // Special handling for UI state only
            if (action === 'smart-compose') {
                setSmartComposeEnabled(!smartComposeEnabled);
                toast.success(smartComposeEnabled
                    ? 'Smart Compose disabled'
                    : 'Smart Compose enabled');
                setIsLoading(false);
                return;
            }

            // For custom language translations
            let customLanguage = null;
            let actionLabel = action;
            
            // Handle custom language translations
            if (action === 'translate-other') {
                customLanguage = window.prompt('Enter the language to translate to:');
                if (!customLanguage) {
                    setIsLoading(false);
                    return;
                }
                actionLabel = `translate-${customLanguage}`;
            }
            
            // Determine insertion behavior
            const shouldReplaceSelection = action !== 'brainstorm';
            const shouldInsertBelow = action === 'brainstorm';

            // Call the backend API with the action and content
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: htmlContent,
                    plainText: plainContent,
                    action: action,
                    customLanguage: customLanguage,
                    preserveFormatting: true
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process AI request');
            }

            let aiResponse = data.response

            if (!aiResponse) {
                throw new Error('Invalid response from AI service');
            }

            // Clean up any markdown or code formatting the AI might have added
            aiResponse = aiResponse
                .replace(/```html/g, '')
                .replace(/```/g, '')
                .replace(/^<t>|<\/t>$/g, '') // Remove any <t> tags that might be added
                .trim();

            // Ensure the response is valid HTML
            if (!aiResponse.startsWith('<')) {
                aiResponse = `<p>${aiResponse}</p>`;
            }

            // Update AI History
            const historyItem = {
                id: Date.now(),
                action: actionLabel,
                input: plainContent,
                output: aiResponse,
                timestamp: Date.now()
            };

            // Apply the changes
            if (shouldReplaceSelection && isTextSelected) {
                editor.chain().focus().deleteSelection().insertContent(aiResponse).run();
            } else if (shouldInsertBelow) {
                editor.chain().focus().insertContent('\n\n' + aiResponse).run();
            } else {
                editor.commands.setContent(aiResponse);
            }

            // Update document content in state
            preserveCursorPosition(() => {
                const updatedDocuments = documents.map(doc =>
                    doc.id === activeDocument
                        ? { ...doc, content: editor.getHTML() }
                        : doc
                );
                setDocuments(updatedDocuments);
            });

            toast.success(`AI action completed!`);
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.message || 'An error occurred while processing your request.');
        } finally {
            setIsLoading(false);
        }
    };

    const addNewDocument = () => {
        const newId = Math.max(...documents.map(doc => doc.id), 0) + 1;
        const newDocument = { id: newId, name: `Untitled Document ${newId}`, content: '' };
        setDocuments([...documents, newDocument]);
        setActiveDocument(newId);
    };

    const saveDocumentName = () => {
        setIsEditing(false);
        const updatedDocuments = documents.map(doc =>
            doc.id === activeDocument
                ? { ...doc, name: documentName }
                : doc
        );
        setDocuments(updatedDocuments);
    };

    // Helper function to preserve cursor position
    const preserveCursorPosition = (callback: () => void) => {
        if (editor) {
            // Save current selection
            const { from, to } = editor.state.selection;

            // Perform the operation that might lose cursor position
            callback();

            // Restore selection
            setTimeout(() => {
                editor.commands.setTextSelection({ from, to });
            }, 10);
        } else {
            callback();
        }
    };

    const handleContentChange = () => {
        if (editor) {
            // Store current document content for reference
            documentContentRef.current = {
                id: activeDocument,
                content: editor.getHTML()
            };

            preserveCursorPosition(() => {
                const updatedDocuments = documents.map(doc =>
                    doc.id === activeDocument
                        ? { ...doc, content: editor.getHTML() }
                        : doc
                );
                setDocuments(updatedDocuments);
            });
        }
    };

    const downloadDocument = () => {
        if (!editor) return;

        const currentDoc = documents.find(doc => doc.id === activeDocument);
        if (!currentDoc) return;

        const fileName = `${currentDoc.name}.html`;
        const content = currentDoc.content;

        // Add DOCTYPE and charset to ensure proper rendering
        const fullHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${currentDoc.name}</title>
</head>
<body>
    ${content}
</body>
</html>`;

        const element = document.createElement('a');
        const file = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(file);

        element.href = url;
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        // Clean up URL object to avoid memory leaks
        setTimeout(() => URL.revokeObjectURL(url), 100);

        toast.success(`Document "${fileName}" downloaded!`);
    };

    useEffect(() => {
        if (editor) {
            // Set up long press for mobile devices
            let longPressTimer: NodeJS.Timeout | null = null;
            let longPressPosition = { x: 0, y: 0 };

            const handleTouchStart = (event: TouchEvent) => {
                const target = event.target as Element;
                // Check if we're inside the editor content
                if (target && target.closest('.ProseMirror')) {
                    // Save position for potential context menu
                    longPressPosition = {
                        x: event.touches[0].clientX,
                        y: event.touches[0].clientY
                    };

                    // Start timer for long press (550ms)
                    longPressTimer = setTimeout(() => {
                        // Check if there's selected text
                        const selection = window.getSelection();
                        if (selection && selection.toString().trim().length > 0) {
                            // Show context menu at touch position
                            setContextMenu({
                                visible: true,
                                position: longPressPosition
                            });

                            // Prevent default behaviors
                            event.preventDefault();
                        }
                    }, 550);
                }
            };

            const handleTouchEnd = () => {
                // Clear the timer if touch ends before long press
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            };

            // Add touch event listeners
            document.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
            document.addEventListener('touchcancel', handleTouchEnd);

            return () => {
                // Clean up touch event listeners
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchend', handleTouchEnd);
                document.removeEventListener('touchcancel', handleTouchEnd);

                // Clear any pending timer
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                }
            };
        }
    }, [editor]);

    return (
        <div className={`w-full max-w-6xl mx-auto bg-white rounded-xl shadow-stripe-lg overflow-hidden flex flex-col border border-gray-200 ${readingMode ? 'reading-mode' : ''}`}>
            {readingMode && (
                <button
                    className="exit-reading-mode"
                    onClick={() => setReadingMode(false)}
                >
                    Exit Reading Mode
                </button>
            )}

            <div className="flex items-center p-3 bg-white border-b border-gray-200 editor-header">
                {/* Original header content */}
                <div className="flex-1 flex">
                    {isEditing ? (
                        <div className="flex items-center">
                            <input
                                ref={titleRef}
                                type="text"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 text-gray-900 w-64"
                                onBlur={saveDocumentName}
                                onKeyDown={(e) => e.key === 'Enter' && saveDocumentName()}
                            />
                            <button
                                onClick={saveDocumentName}
                                className="ml-2 p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                            >
                                <CheckIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <h2 className="text-base font-medium text-gray-900 flex items-center">
                                <span className="mr-2">{documentName}</span>
                                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Doc</span>
                            </h2>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="ml-2 p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={addNewDocument}
                        className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                        title="New document"
                    >
                        <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                    <ExportMenu
                        documentName={documentName}
                        documentContent={editor?.getHTML() || ''}
                        isLoading={isLoading}
                    />
                    <ComfortSettings
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        lineHeight={lineHeight}
                        setLineHeight={setLineHeight}
                        readingMode={readingMode}
                        setReadingMode={setReadingMode}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <EditorToolbar editor={editor} />

            <div className="flex-1 overflow-auto relative editor-content-container">
                <EditorContent
                    editor={editor}
                    className={`h-full ${smartComposeEnabled ? 'smart-compose-active' : ''}`}
                />
            </div>

            <div ref={aiFooterRef}>
                <AIFooter 
                    editor={editor} 
                    onAIAction={handleAIAction} 
                    isLoading={isLoading} 
                    smartComposeEnabled={smartComposeEnabled} 
                    isExpanded={isAIBarExpanded}
                    setIsExpanded={setIsAIBarExpanded}
                />
            </div>

            {/* Selection Context Menu - Shown when right-clicking on selected text */}
            {contextMenu.visible && (
                <SelectionContextMenu
                    editor={editor}
                    onAIAction={handleAIAction}
                    position={contextMenu.position}
                    onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
                />
            )}

            {/* Keyboard shortcuts modal */}
            {showShortcuts && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
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
                        <div className="space-y-3 text-sm text-gray-700">
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
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Lists</div>
                                <div></div>
                                <div>Bullet List</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+8</div>
                                <div>Numbered List</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+7</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                <div className="font-medium">Other</div>
                                <div></div>
                                <div>Blockquote</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Shift+B</div>
                                <div>Code Block</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Alt+C</div>
                                <div>Undo</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Z</div>
                                <div>Redo</div>
                                <div className="font-mono bg-gray-100 px-1.5 rounded">Ctrl+Y</div>
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

            <style jsx global>{`
                /* Layout fixes for toolbar and headers */
                .editor-header {
                    position: sticky;
                    top: 0;
                    z-index: 20;
                    background-color: white;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                }
                
                .editor-toolbar {
                    position: sticky;
                    top: 48px; /* Height of the header */
                    z-index: 15;
                    background-color: white;
                    width: 100%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
                
                /* AI feature bar styles */
                .ai-feature-bar {
                    width: 100%;
                    transition: all 0.3s ease;
                    z-index: 20;
                    border-top: 1px solid #e5e7eb;
                    background-color: #fcfcfd;
                }
                
                /* Editor content container that adjusts based on AI bar */
                .editor-content-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: auto;
                }
                
                /* Automatic padding for editor content based on AI bar visibility */
                .editor-content-container .ProseMirror {
                    padding-bottom: 1rem;
                }
                
                /* Toolbar dropdown positioning fixes */
                .editor-toolbar-dropdown {
                    z-index: 50 !important;
                }
                
                /* Ensure color pickers and dropdown menus appear above other content */
                .format-dropdown {
                    z-index: 50 !important;
                }
                
                /* Ensure content is properly scrollable */
                .ProseMirror {
                    padding-top: 16px; /* Add space at the top for better visual separation from toolbar */
                    padding-left: 16px;
                    padding-right: 16px;
                    padding-bottom: 16px;
                    flex: 1;
                    min-height: 200px;
                    overflow-wrap: break-word;
                }
                
                /* Original styles below */
                .smart-compose-suggestion {
                    color: #9CA3AF;
                    opacity: 0.75;
                }
                
                /* Custom CSS for smart compose mode */
                .smart-compose-active .ProseMirror-focused {
                    background-color: rgba(124, 58, 237, 0.05);
                    transition: background-color 0.2s ease;
                    border-left: 3px solid #7c3aed;
                    border-radius: 4px;
                }
                
                /* Remaining original styles... */
                .smart-compose-active::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 8px;
                    height: 8px;
                    margin: 8px;
                    background-color: #7c3aed;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 6px rgba(124, 58, 237, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
                    }
                }
                
                /* Highlighted text style - base class */
                .highlighted-text {
                    padding: 2px 0;
                    border-radius: 2px;
                }
                
                /* Default highlight is yellow if no color specified */
                .highlighted-text:not([style]) {
                    background-color: #ffff00 !important;
                }
                
                /* We don't need the data-color selectors since we're using inline styles directly */
                /* This ensures the actual background color matches what was selected */
                
                /* Eye comfort styles */
                .ProseMirror {
                    font-size: ${fontSize}px !important;
                    line-height: ${lineHeight} !important;
                    transition: font-size 0.2s ease, line-height 0.2s ease;
                    color: #374151;
                    white-space: pre-wrap !important; /* Preserve whitespace and line breaks */
                    word-wrap: break-word;
                    word-break: normal;
                    outline: none !important;
                    position: relative; /* Needed for positioning the pulse indicator */
                }
                
                /* Fix whitespace issues */
                .ProseMirror p {
                    margin-top: 1em;
                    margin-bottom: 1em;
                    white-space: pre-wrap !important;
                }
                
                /* Force new lines to be properly displayed */
                .ProseMirror br {
                    display: block;
                    content: "";
                    margin-top: 0.5em;
                }

                /* Selection highlight style */
                .ProseMirror ::selection {
                    background: rgba(124, 58, 237, 0.3);
                    color: inherit;
                }
                
                /* Additional styles for color picker dropdowns */
                .format-dropdown {
                    border-radius: 0.375rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                
                /* Context menu styling */
                .ai-context-menu {
                    position: fixed;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    padding: 8px;
                    z-index: 9999;
                    width: 220px;
                    animation: fadeIn 0.15s ease;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    max-height: 70vh;
                    overflow-y: auto;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .ai-context-menu-category {
                    font-size: 11px;
                    text-transform: uppercase;
                    color: #6b7280;
                    font-weight: 600;
                    padding: 6px 8px;
                    background-color: rgba(249, 250, 251, 0.8);
                    position: sticky;
                    top: 0;
                }
                
                .ai-context-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 13px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                
                .ai-context-menu-item:hover {
                    background-color: #f3f4f6;
                    transform: translateX(2px);
                }
                
                .ai-context-menu-item:active {
                    background-color: #e5e7eb;
                }
                
                .ai-context-menu-item svg {
                    width: 16px;
                    height: 16px;
                    flex-shrink: 0;
                }

                /* AI feature bar styles */
                .ai-feature-bar {
                    transition: all 0.3s ease;
                    z-index: 50;
                }

                /* Add smooth animation for expanding/collapsing */
                .ai-feature-bar > div:last-child {
                    transition: all 0.3s ease;
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Ensure the editor container has proper positioning for the AI bar */
                .ProseMirror {
                    position: relative;
                    padding-bottom: 80px !important; /* Space for the AI bar */
                }

                /* Reading Mode Styles */
                .reading-mode .ProseMirror {
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 2rem 3rem !important;
                    background-color: #FFFDF7;
                    color: #3B3B3B;
                    font-family: 'Georgia', serif;
                }

                .reading-mode .ProseMirror p {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    margin-bottom: 1.2rem;
                }

                .reading-mode .ProseMirror h1,
                .reading-mode .ProseMirror h2,
                .reading-mode .ProseMirror h3 {
                    font-family: 'Georgia', serif;
                    margin-top: 1.8rem;
                    margin-bottom: 1rem;
                }

                .reading-mode .border-b.border-gray-200 {
                    display: none;
                }

                .reading-mode .ai-feature-bar {
                    opacity: 0.6;
                    transform: translate(-50%, 20px);
                    transition: all 0.3s ease;
                }
                
                .reading-mode .ai-feature-bar:hover {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }

                /* Hide toolbar in Reading Mode */
                .reading-mode .border-b {
                    height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                /* Make toolbar reappear on hover in reading mode */
                .reading-mode:hover .border-b {
                    height: auto;
                    opacity: 0.7;
                }
                
                /* Additional UI adjustments for reading mode */
                .reading-mode .EditorContent {
                    background-color: #FFFDF7;
                }

                /* Exit reading mode button */
                .reading-mode .exit-reading-mode {
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    z-index: 100;
                    background-color: rgba(124, 58, 237, 0.8);
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                }

                .reading-mode .exit-reading-mode:hover {
                    background-color: rgb(124, 58, 237);
                    transform: translateY(-1px);
                }
                
                /* Style for when editor has focus */
                .editor-has-focus {
                    /* Subtle indicator that editor has focus */
                    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
                }
            `}</style>
        </div>
    );
} 