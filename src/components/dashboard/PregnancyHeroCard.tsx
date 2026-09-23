'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';

export function PregnancyHeroCard() {
  const { t, formatNumber, language } = useLanguage();
  const { calculation } = usePregnancy();

  if (!calculation.isValid) return null;

  const { currentWeek, currentDay, progressPercent, trimester } = calculation;

  const trimesterLabel =
    trimester === 1
      ? t.common.firstTrimester
      : trimester === 2
      ? t.common.secondTrimester
      : t.common.thirdTrimester;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-surface border border-navy-border p-6 sm:p-8 shadow-premium text-text-primary">
      {/* Subtle emerald glow in background corner */}
      <div className="absolute -top-14 -left-14 w-48 h-48 rounded-full bg-emerald/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Trimester Badge and Completion Status */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-navy-elevated border border-navy-border text-[11px] font-semibold uppercase tracking-wider text-emerald">
            <Sparkles className="w-3.5 h-3.5 text-emerald-accent" />
            <span>{trimesterLabel}</span>
          </span>

          <span className="text-xs font-medium text-text-secondary">
            {formatNumber(progressPercent)}% {language === 'bn' ? 'সম্পন্ন' : 'completed'}
          </span>
        </div>

        {/* Large Gestational Week & Day Display (Dominant Visual Focus) */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            {t.dashboard.currentStage}
          </p>
          <div className="flex items-baseline space-x-2 sm:space-x-3">
            <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-primary leading-none">
              {formatNumber(currentWeek)}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-secondary">
              {t.common.weeks}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald ml-1">
              {formatNumber(currentDay)}
            </span>
            <span className="text-lg sm:text-xl font-semibold text-text-secondary">
              {t.common.days}
            </span>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="pt-2">
          <div className="w-full h-2 rounded-full bg-navy-elevated overflow-hidden border border-navy-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-teal via-emerald to-emerald-accent shadow-[0_0_12px_rgba(0,201,154,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[11px] text-text-muted mt-2 text-right">
            {language === 'bn'
              ? `মোট ৪০ সপ্তাহের যাত্রার ${formatNumber(progressPercent)}%`
              : `${formatNumber(progressPercent)}% of 40-week journey`}
          </p>
        </div>
      </div>
    </div>
  );
}
