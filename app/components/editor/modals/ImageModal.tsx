'use client';

import React, { useState } from 'react';
import Modal from '../Modal';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string, alt: string, title: string) => void;
}

function ImageModal({ isOpen, onClose, onSubmit }: ImageModalProps) {
    const { t } = useLanguage();
    const [url, setUrl] = useState('');
    const [alt, setAlt] = useState('');
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!url) {
            return;
        }

        onSubmit(url, alt, title);

        // Reset form
        setUrl('');
        setAlt('');
        setTitle('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('insertImage')}
        >
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('imageURL')}
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={t('imageUrlPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        autoFocus
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('altText')}
                    </label>
                    <input
                        type="text"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        placeholder={t('altTextPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t('altTextDescription')}
                    </p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('titleOptional')}
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('titlePlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t('titleDescription')}
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
                        disabled={!url}
                    >
                        {t('insertImageButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ImageModal; 