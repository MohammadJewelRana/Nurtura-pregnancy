'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full bg-rose-50/80 dark:bg-charcoal-800 border border-rose-200 dark:border-charcoal-700 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition-all ${
          language === 'en'
            ? 'bg-rose-500 text-white shadow-sm'
            : 'text-charcoal-600 dark:text-charcoal-300 hover:text-rose-600'
        }`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 rounded-full transition-all font-bangla ${
          language === 'bn'
            ? 'bg-rose-500 text-white shadow-sm'
            : 'text-charcoal-600 dark:text-charcoal-300 hover:text-rose-600'
        }`}
        aria-pressed={language === 'bn'}
      >
        বাংলা
      </button>
    </div>
  );
}
