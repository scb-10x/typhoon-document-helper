'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 text-sm" id="language-switcher">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md transition-colors ${currentLanguage === 'en'
            ? 'bg-indigo-100 text-indigo-700 font-medium'
            : 'text-gray-600 hover:text-indigo-600'
          }`}
        id="language-switch-en"
      >
        EN
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => setLanguage('th')}
        className={`px-2 py-1 rounded-md transition-colors ${currentLanguage === 'th'
            ? 'bg-indigo-100 text-indigo-700 font-medium'
            : 'text-gray-600 hover:text-indigo-600'
          }`}
        id="language-switch-th"
      >
        TH
      </button>
    </div>
  );
}; 