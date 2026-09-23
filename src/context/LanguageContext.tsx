'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types/pregnancy';
import { en } from '@/data/translations/en';
import { bn } from '@/data/translations/bn';
import { getSavedLanguage, saveLanguage } from '@/lib/storage/local-storage';
import { toBanglaDigits, formatFriendlyDate } from '@/lib/date/date-utils';

type TranslationType = typeof en;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationType;
  formatNumber: (num: number | string) => string;
  formatDate: (
    dateInput: string | Date | null | undefined,
    options?: { includeYear?: boolean; shortMonth?: boolean }
  ) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getSavedLanguage();
    setLangState(saved);
    setMounted(true);
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    saveLanguage(newLang);
  };

  const t = language === 'bn' ? (bn as TranslationType) : en;

  const formatNumber = (num: number | string): string => {
    if (language === 'bn') {
      return toBanglaDigits(num);
    }
    return String(num);
  };

  const formatDate = (
    dateInput: string | Date | null | undefined,
    options?: { includeYear?: boolean; shortMonth?: boolean }
  ): string => {
    return formatFriendlyDate(dateInput, language, options);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatNumber,
        formatDate,
      }}
    >
      <div className={language === 'bn' ? 'font-bangla' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
