'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full bg-ivory-200/80 dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-700 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-plum-700 text-white shadow-subtle'
            : 'text-charcoal-600 dark:text-charcoal-300 hover:text-plum-800 dark:hover:text-plum-200'
        }`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 font-bangla ${
          language === 'bn'
            ? 'bg-plum-700 text-white shadow-subtle'
            : 'text-charcoal-600 dark:text-charcoal-300 hover:text-plum-800 dark:hover:text-plum-200'
        }`}
        aria-pressed={language === 'bn'}
      >
        বাংলা
      </button>
    </div>
  );
}
