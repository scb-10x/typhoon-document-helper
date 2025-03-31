'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DocumentStatsProps {
    editor: Editor | null;
}

const DocumentStats: React.FC<DocumentStatsProps> = ({ editor }) => {
    const { t } = useLanguage();

    if (!editor) {
        return null;
    }

    const text = editor.getText();
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s+/g, '').length;

    return (
        <div className="document-stats text-xs text-gray-500 flex gap-2">
            <div>
                <span className="count">{wordCount}</span> {t('words')}
            </div>
            <div>
                <span className="count">{charCount}</span> {t('characters')}
            </div>
            <div>
                <span className="count">{charCountNoSpaces}</span> {t('charactersNoSpaces')}
            </div>
        </div>
    );
};

export default DocumentStats; 