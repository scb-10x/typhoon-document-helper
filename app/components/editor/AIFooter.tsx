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
import { useLanguage } from '../../contexts/LanguageContext';

interface AIFooterProps {
    editor: Editor | null;
    onAIAction: (action: string) => void;
    isLoading: boolean;
}

const AIFooter = ({ editor, onAIAction, isLoading }: AIFooterProps) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('improve');
    const [searchQuery, setSearchQuery] = useState('');

    if (!editor) {
        return null;
    }

    const allAIOptions = {
        improve: [
            {
                label: t('proofread'),
                value: "proofread",
                icon: <DocumentCheckIcon className="w-4 h-4" />,
                description: t('proofreadDesc')
            },
            {
                label: t('makeProfessional'),
                value: "professional",
                icon: <AcademicCapIcon className="w-4 h-4" />,
                description: t('makeProfessionalDesc')
            },
            {
                label: t('makeCasual'),
                value: "casual",
                icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
                description: t('makeCasualDesc')
            },
            {
                label: t('improveClarity'),
                value: "clarity",
                icon: <LightBulbIcon className="w-4 h-4" />,
                description: t('improveClarityDesc')
            },
            {
                label: t('fixWordiness'),
                value: "concise",
                icon: <ArrowsPointingOutIcon className="w-4 h-4 rotate-45" />,
                description: t('fixWordinessDesc')
            }
        ],
        transform: [
            {
                label: t('extend'),
                value: "extend",
                icon: <ArrowPathIcon className="w-4 h-4" />,
                description: t('extendDesc')
            },
            {
                label: t('summarize'),
                value: "summarize",
                icon: <DocumentTextIcon className="w-4 h-4" />,
                description: t('summarizeDesc')
            },
            {
                label: t('translate'),
                value: "translate",
                icon: <LanguageIcon className="w-4 h-4" />,
                description: t('translateDesc')
            },
            {
                label: t('explainLikeIm5'),
                value: "eli5",
                icon: <BeakerIcon className="w-4 h-4" />,
                description: t('explainLikeIm5Desc')
            },
            {
                label: t('makePersuasive'),
                value: "persuade",
                icon: <MegaphoneIcon className="w-4 h-4" />,
                description: t('makePersuasiveDesc')
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
        <div className="flex flex-col w-full bg-white border-t border-gray-200 overflow-hidden">
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
                        {t('improve')}
                    </button>
                    <button
                        className={`px-3 py-1 text-xs font-medium ${activeTab === 'transform'
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('transform')}
                    >
                        {t('transform')}
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
                        placeholder={t('searchAIActions')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-sm border border-gray-200 rounded-md py-1 px-2 w-44 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                </div>
            </div>
            {/* AI Disclaimer */}
            <div className="px-2 py-1 text-[10px] text-gray-500 italic">
                Disclaimer: The responses generated by this Artificial Intelligence (AI) system are autonomously constructed and do not necessarily reflect the views or positions of the developing organizations, their affiliates, or any of their employees. These AI-generated responses do not represent those of the organizations. The organizations do not endorse, support, sanction, encourage, verify, or agree with the comments, opinions, or statements generated by this AI. The information produced by this AI is not intended to malign any religion, ethnic group, club, organization, company, individual, anyone, or anything. It is not the intent of the organizations to malign any group or individual. The AI operates based on its programming and training data and its responses should not be interpreted as the explicit intent or opinion of the organizations.
            </div>
        </div>
    );
};

export default AIFooter; 