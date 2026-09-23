'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Ruler, Weight, Baby, Sparkles } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-2xl bg-navy-surface border border-navy-border shadow-premium p-6 sm:p-7 space-y-4">
      {/* Eyebrow & Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald block mb-0.5">
            {t.dashboard.babyThisWeekHeading}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            {t.common.week} {formatNumber(currentWeekNum)}
          </h3>
        </div>

        <Link
          href="/baby"
          className="text-xs font-semibold text-emerald hover:text-emerald-accent inline-flex items-center space-x-1.5 transition group"
        >
          <span>{t.dashboard.exploreWeek.replace('{week}', formatNumber(currentWeekNum))}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Fruit Comparison & Measurements Panel */}
      <div className="p-4 rounded-xl bg-navy-elevated border border-navy-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-navy-surface flex items-center justify-center text-xl shadow-subtle border border-navy-border">
            🌱
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold block">
              {language === 'bn' ? 'তুলনামূলক আকার' : 'Size Comparison'}
            </span>
            <span className="text-sm sm:text-base font-bold text-text-primary">
              {fruitName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-secondary pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-navy-border sm:pl-4">
          <div className="flex items-center space-x-1.5">
            <Ruler className="w-3.5 h-3.5 text-emerald" />
            <span>~{formatNumber(weekData.approxLengthCm)} cm</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Weight className="w-3.5 h-3.5 text-emerald-accent" />
            <span>~{formatNumber(weekData.approxWeightGrams)} g</span>
          </div>
        </div>
      </div>

      {/* Development Summary */}
      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2">
        {devText}
      </p>
    </div>
  );
}
