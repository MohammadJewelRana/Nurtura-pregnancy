'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full bg-navy-surface border border-navy-border text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-emerald text-navy-bg font-bold shadow-subtle'
            : 'text-text-muted hover:text-text-primary'
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
            ? 'bg-emerald text-navy-bg font-bold shadow-subtle'
            : 'text-text-muted hover:text-text-primary'
        }`}
        aria-pressed={language === 'bn'}
      >
        বাংলা
      </button>
    </div>
  );
}
