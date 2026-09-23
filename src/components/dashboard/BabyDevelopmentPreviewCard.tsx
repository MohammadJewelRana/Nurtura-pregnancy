'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Ruler, Weight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { getWeekData } from '@/data/pregnancy-weeks/weeks-data';

export function BabyDevelopmentPreviewCard() {
  const { t, language, formatNumber } = useLanguage();
  const { calculation } = usePregnancy();

  if (!calculation.isValid) return null;

  const currentWeekNum = calculation.currentWeek || 1;
  const weekData = getWeekData(currentWeekNum);
  const fruitName = language === 'bn' ? weekData.fruitComparisonBn : weekData.fruitComparisonEn;
  const devText = language === 'bn' ? weekData.babyDevelopmentBn : weekData.babyDevelopmentEn;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#1E1722] border border-[#EFE8DE] dark:border-[#332537] shadow-subtle p-6 sm:p-7 space-y-4">
      {/* Eyebrow & Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-plum-700 dark:text-dustyRose-400 block mb-0.5">
            {t.dashboard.babyThisWeekHeading}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-plum-950 dark:text-white">
            {t.common.week} {formatNumber(currentWeekNum)}
          </h3>
        </div>

        <Link
          href="/baby"
          className="text-xs font-semibold text-plum-700 dark:text-dustyRose-300 hover:text-plum-900 dark:hover:text-dustyRose-200 inline-flex items-center space-x-1 transition group"
        >
          <span>{t.dashboard.exploreWeek.replace('{week}', formatNumber(currentWeekNum))}</span>
        </Link>
      </div>

      {/* Fruit Comparison & Measurements Pill */}
      <div className="p-4 rounded-2xl bg-ivory-100/90 dark:bg-charcoal-900/60 border border-ivory-300 dark:border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-charcoal-800 flex items-center justify-center text-xl shadow-subtle border border-[#EFE8DE] dark:border-charcoal-700">
            🌱
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-bold block">
              {language === 'bn' ? 'তুলনামূলক আকার' : 'Size Comparison'}
            </span>
            <span className="text-sm sm:text-base font-bold text-plum-950 dark:text-white">
              {fruitName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-charcoal-600 dark:text-charcoal-300 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-ivory-300 dark:border-charcoal-700 sm:pl-4">
          <div className="flex items-center space-x-1.5">
            <Ruler className="w-3.5 h-3.5 text-dustyRose-500" />
            <span>~{formatNumber(weekData.approxLengthCm)} cm</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Weight className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
            <span>~{formatNumber(weekData.approxWeightGrams)} g</span>
          </div>
        </div>
      </div>

      {/* Development Summary (concise line-clamp-2) */}
      <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed line-clamp-2">
        {devText}
      </p>
    </div>
  );
}
