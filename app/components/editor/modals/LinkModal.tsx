'use client';

import React, { useState } from 'react';
import Modal from '../Modal';
import { useLanguage } from '../../../contexts/LanguageContext';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string, text?: string) => void;
    initialUrl?: string;
    hasSelection?: boolean;
}

function LinkModal({ isOpen, onClose, onSubmit, initialUrl = '', hasSelection = false }: LinkModalProps) {
    const { t } = useLanguage();
    const [url, setUrl] = useState(initialUrl);
    const [linkText, setLinkText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(url, hasSelection ? undefined : linkText);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('insertLink')}
        >
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('linkURL')}
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={t('urlPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        autoFocus
                    />
                </div>

                {!hasSelection && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('linkText')}
                        </label>
                        <input
                            type="text"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            placeholder={t('linkTextPlaceholder')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                )}

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
                        {initialUrl ? t('updateLink') : t('insertLinkButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default LinkModal; 