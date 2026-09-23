'use client';

import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { FAQ_DATA } from '@/data/pregnancy-faq/faq-data';

export function FaqView() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const qEn = faq.questionEn.toLowerCase();
    const qBn = faq.questionBn.toLowerCase();
    const aEn = faq.answerEn.toLowerCase();
    const aBn = faq.answerBn.toLowerCase();
    return qEn.includes(q) || qBn.includes(q) || aEn.includes(q) || aBn.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 dark:text-white">
          {t.faq.title}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
          {t.faq.subtitle}
        </p>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t.faq.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-xs sm:text-sm text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
      </div>

      {/* Accordion FAQ list */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const question = language === 'bn' ? faq.questionBn : faq.questionEn;
            const answer = language === 'bn' ? faq.answerBn : faq.answerEn;

            return (
              <div
                key={faq.id}
                className="rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex-shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-charcoal-900 dark:text-white">
                      {question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-charcoal-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-rose-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-rose-50 dark:border-charcoal-800 text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-white dark:bg-charcoal-900 rounded-3xl border border-rose-100 dark:border-charcoal-800 shadow-soft text-xs text-charcoal-400">
            {t.faq.noResults}
          </div>
        )}
      </div>

      {/* Medical Safety Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold block">{t.common.disclaimerTitle}</strong>
          <p className="leading-relaxed">{t.common.disclaimerText}</p>
        </div>
      </div>
    </div>
  );
}
