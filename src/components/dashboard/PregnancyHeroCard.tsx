'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-plum-800 via-plum-700 to-dustyRose-600 text-white p-6 sm:p-8 shadow-hero border border-plum-600/30">
      {/* Subtle warm glow circles in background */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-dustyRose-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-champagne-400/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4 sm:space-y-5">
        {/* Trimester Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-dustyRose-100 border border-white/15">
            <Sparkles className="w-3 h-3 text-champagne-300" />
            <span>{trimesterLabel}</span>
          </span>

          <span className="text-[11px] sm:text-xs font-medium text-white/80">
            {formatNumber(progressPercent)}% {language === 'bn' ? 'সম্পন্ন' : 'completed'}
          </span>
        </div>

        {/* Large Gestational Week & Day Display */}
        <div>
          <p className="text-xs sm:text-sm text-dustyRose-200/90 font-medium tracking-wide mb-1">
            {t.dashboard.currentStage}
          </p>
          <div className="flex items-baseline space-x-2 sm:space-x-3">
            <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
              {formatNumber(currentWeek)}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-dustyRose-100 opacity-95">
              {t.common.weeks}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-champagne-200 ml-1">
              {formatNumber(currentDay)}
            </span>
            <span className="text-lg sm:text-xl font-semibold text-dustyRose-100 opacity-90">
              {t.common.days}
            </span>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="pt-1">
          <div className="w-full h-2 sm:h-2.5 rounded-full bg-black/25 overflow-hidden p-0.5 border border-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-champagne-300 via-dustyRose-200 to-white"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[11px] text-dustyRose-200/80 mt-2 text-right">
            {language === 'bn'
              ? `মোট ৪০ সপ্তাহের যাত্রার ${formatNumber(progressPercent)}%`
              : `${formatNumber(progressPercent)}% of pregnancy journey`}
          </p>
        </div>
      </div>
    </div>
  );
}
