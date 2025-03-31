'use client';

import React, { useState } from 'react';
import { LanguageIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TranslateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (language: string) => void;
    customLanguage: string;
    setCustomLanguage: (lang: string) => void;
}

function TranslateModal({
    isOpen,
    onClose,
    onSubmit,
    customLanguage,
    setCustomLanguage
}: TranslateModalProps) {
    const { t } = useLanguage();
    const [selected, setSelected] = useState('english');

    // Common languages to translate to
    const languages = [
        { id: 'thai', name: t('thai') },
        { id: 'english', name: t('english') },
        { id: 'spanish', name: t('spanish') },
        { id: 'french', name: t('french') },
        { id: 'german', name: t('german') },
        { id: 'chinese', name: t('chinese') },
        { id: 'japanese', name: t('japanese') },
        { id: 'russian', name: t('russian') },
        { id: 'arabic', name: t('arabic') },
        { id: 'portuguese', name: t('portuguese') },
        { id: 'italian', name: t('italian') },
        { id: 'hindi', name: t('hindi') },
        { id: 'korean', name: t('korean') },
        { id: 'dutch', name: t('dutch') },
        { id: 'custom', name: t('otherLanguageOption') },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selected === 'custom') {
            if (customLanguage.trim()) {
                onSubmit(customLanguage);
            }
        } else {
            onSubmit(selected);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('translateText')}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('selectTargetLanguage')}
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                        {languages.slice(0, languages.length - 1).map((language) => (
                            <div key={language.id} className="flex items-center">
                                <input
                                    type="radio"
                                    id={language.id}
                                    name="language"
                                    value={language.id}
                                    checked={selected === language.id}
                                    onChange={() => setSelected(language.id)}
                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor={language.id} className="ml-2 text-sm text-gray-700">
                                    {language.name}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex items-center">
                        <input
                            type="radio"
                            id="custom"
                            name="language"
                            value="custom"
                            checked={selected === 'custom'}
                            onChange={() => setSelected('custom')}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="custom" className="ml-2 text-sm text-gray-700">
                            {t('otherLanguage')}
                        </label>
                        <input
                            type="text"
                            value={customLanguage}
                            onChange={(e) => setCustomLanguage(e.target.value)}
                            placeholder={t('specifyLanguage')}
                            className="ml-2 text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            onClick={() => setSelected('custom')}
                        />
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md flex items-start">
                    <LanguageIcon className="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                        {t('translateTip')}
                    </p>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                        {t('translateButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default TranslateModal; 