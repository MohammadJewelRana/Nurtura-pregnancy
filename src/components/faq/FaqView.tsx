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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {t.faq.title}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          {t.faq.subtitle}
        </p>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-navy-surface border border-navy-border shadow-soft">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t.faq.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald/60 transition"
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
                className="rounded-2xl bg-navy-surface border border-navy-border hover:border-emerald/40 shadow-soft overflow-hidden transition duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-emerald/15 text-emerald flex-shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      {question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-emerald' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-navy-border/60 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-navy-surface rounded-2xl border border-navy-border shadow-soft text-xs text-text-muted">
            {t.faq.noResults}
          </div>
        )}
      </div>

      {/* Medical Safety Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-state-warning/10 border border-state-warning/30 flex items-start space-x-3 text-xs text-text-secondary">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-state-warning mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold block text-text-primary">{t.common.disclaimerTitle}</strong>
          <p className="leading-relaxed text-text-secondary">{t.common.disclaimerText}</p>
        </div>
      </div>
    </div>
  );
}
