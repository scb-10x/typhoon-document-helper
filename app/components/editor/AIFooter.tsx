'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
    BrainCircuit,
} from 'lucide-react';
import {
    DocumentCheckIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, LightBulbIcon,
    ArrowsPointingOutIcon, ArrowPathIcon, DocumentTextIcon, LanguageIcon, BeakerIcon, MegaphoneIcon
} from '@heroicons/react/24/outline';

interface AIFooterProps {
    editor: Editor | null;
    onAIAction: (action: string) => void;
    isLoading: boolean;
}

const AIFooter = ({ editor, onAIAction, isLoading }: AIFooterProps) => {
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
                description: "Create a shorter version of the text"
            },
            {
                label: "Translate",
                value: "translate",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: "Translate text to another language"
            },
            {
                label: "Explain like I'm 5",
                value: "eli5",
                icon: <BeakerIcon className="w-4 h-4" />,
                description: "Explain complex concepts in simple terms"
            },
            {
                label: "Make persuasive",
                value: "persuade",
                icon: <MegaphoneIcon className="w-4 h-4" />,
                description: "Make text more convincing"
            }
        ]
    };

    const getCurrentAIOptions = () => {
        if (searchQuery.trim() !== '') {
            const flattenedOptions = [
                ...allAIOptions.improve,
                ...allAIOptions.transform
            ];

            return flattenedOptions.filter(option =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (option.description && option.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return activeTab === 'improve' ? allAIOptions.improve : allAIOptions.transform;
    };

    return (
        <div className="flex w-full bg-white border-t border-gray-200 overflow-hidden">
            <div className="flex-1 flex items-center px-2 py-1 flex-wrap gap-1">
                {/* AI icon */}
                <div className="flex items-center mr-1">
                    <span className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md">
                        <BrainCircuit className="w-3.5 h-3.5 text-white" />
                    </span>
                </div>

                {/* Tab buttons */}
                <div className="flex border border-gray-200 rounded-md overflow-hidden">
                    <button
                        className={`px-3 py-1 text-xs font-medium ${activeTab === 'improve'
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('improve')}
                    >
                        Improve
                    </button>
                    <button
                        className={`px-3 py-1 text-xs font-medium ${activeTab === 'transform'
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('transform')}
                    >
                        Transform
                    </button>
                </div>

                {/* Menus */}
                <div className="flex flex-wrap gap-1 ml-1">
                    {getCurrentAIOptions().map(option => (
                        <button
                            key={option.value}
                            onClick={() => onAIAction(option.value)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-purple-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="flex-shrink-0">{option.icon}</span>
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>

                {/* Search box */}
                <div className="ml-auto relative">
                    <input
                        type="text"
                        placeholder="Search AI actions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-sm border border-gray-200 rounded-md py-1 px-2 w-44 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default AIFooter; 