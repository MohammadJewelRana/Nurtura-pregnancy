'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, HeartHandshake, Baby as BabyIcon, Ruler, Weight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { getWeekData } from '@/data/pregnancy-weeks/weeks-data';

export function BabyDevelopmentPreviewCard() {
  const { t, language, formatNumber } = useLanguage();
  const { calculation } = usePregnancy();

  if (!calculation.isValid) return null;

  const weekData = getWeekData(calculation.currentWeek || 1);
  const fruitName = language === 'bn' ? weekData.fruitComparisonBn : weekData.fruitComparisonEn;
  const devText = language === 'bn' ? weekData.babyDevelopmentBn : weekData.babyDevelopmentEn;
  const motherText = language === 'bn' ? weekData.motherChangesBn : weekData.motherChangesEn;
  const wellnessText = language === 'bn' ? weekData.wellnessTipBn : weekData.wellnessTipEn;

  return (
    <div className="rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 pb-4 border-b border-rose-50 dark:border-charcoal-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500">
            <BabyIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-charcoal-900 dark:text-white">
              {t.dashboard.babySizeTitle}
            </h2>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
              {t.common.week} {formatNumber(calculation.currentWeek)}
            </p>
          </div>
        </div>

        <Link
          href="/baby"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full transition"
        >
          <span>{t.dashboard.viewAllWeeks}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Fruit Size Highlight Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cream-100 via-rose-50 to-cream-100 dark:from-charcoal-800/80 dark:via-charcoal-800 dark:to-charcoal-800/80 border border-cream-200 dark:border-charcoal-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-charcoal-700 flex items-center justify-center text-2xl shadow-sm">
              🥑
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold block">
                {language === 'bn' ? 'তুলনামূলক আকার' : 'Size Comparison'}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-charcoal-900 dark:text-white">
                {fruitName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs border-t sm:border-t-0 sm:border-l border-rose-200/50 dark:border-charcoal-700 pt-3 sm:pt-0 sm:pl-4">
            <div className="flex items-center space-x-1.5">
              <Ruler className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-charcoal-400 block text-[10px]">{t.dashboard.approxLength}</span>
                <span className="font-bold text-charcoal-800 dark:text-charcoal-100">
                  ~{formatNumber(weekData.approxLengthCm)} cm
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <Weight className="w-4 h-4 text-sage-600 dark:text-sage-400" />
              <div>
                <span className="text-charcoal-400 block text-[10px]">{t.dashboard.approxWeight}</span>
                <span className="font-bold text-charcoal-800 dark:text-charcoal-100">
                  ~{formatNumber(weekData.approxWeightGrams)} g
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-charcoal-800/40 border border-rose-100/60 dark:border-charcoal-800">
            <h4 className="font-bold text-charcoal-900 dark:text-white flex items-center space-x-1.5 mb-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.dashboard.babyDevelopmentTitle}</span>
            </h4>
            <p className="text-charcoal-600 dark:text-charcoal-300 leading-relaxed line-clamp-3">
              {devText}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sage-50/40 dark:bg-charcoal-800/40 border border-sage-100/60 dark:border-charcoal-800">
            <h4 className="font-bold text-charcoal-900 dark:text-white flex items-center space-x-1.5 mb-1.5 text-xs">
              <HeartHandshake className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
              <span>{t.dashboard.motherChangesTitle}</span>
            </h4>
            <p className="text-charcoal-600 dark:text-charcoal-300 leading-relaxed line-clamp-3">
              {motherText}
            </p>
          </div>
        </div>

        {/* Daily Wellness Tip */}
        <div className="p-3.5 rounded-2xl bg-lavender-50/70 dark:bg-charcoal-800/60 border border-lavender-200/50 dark:border-charcoal-700 text-xs text-charcoal-700 dark:text-charcoal-300 flex items-start space-x-2.5">
          <span className="text-base">🌸</span>
          <div>
            <strong className="font-semibold block text-lavender-700 dark:text-lavender-300 mb-0.5">
              {t.dashboard.wellnessTipTitle}:
            </strong>
            <p className="italic text-charcoal-600 dark:text-charcoal-300">{wellnessText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
