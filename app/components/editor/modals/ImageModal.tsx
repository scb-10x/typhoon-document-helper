'use client';

import React, { useState } from 'react';
import Modal from '../Modal';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string, alt: string, title: string) => void;
}

function ImageModal({ isOpen, onClose, onSubmit }: ImageModalProps) {
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
            title="Insert Image"
        >
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        autoFocus
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alt Text
                    </label>
                    <input
                        type="text"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        placeholder="Image description for accessibility"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Describes the image for screen readers and SEO
                    </p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title (optional)
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Tooltip when hovering over the image"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        disabled={!url}
                    >
                        Insert Image
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ImageModal; 