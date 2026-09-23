'use client';

import React, { useState } from 'react';
import { Calendar, Info, ChevronDown, CheckCircle2, HeartHandshake } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';

export function DueDateCountdownCard() {
  const { t, formatNumber, formatDate, language } = useLanguage();
  const { calculation } = usePregnancy();
  const [showComparison, setShowComparison] = useState(false);

  if (!calculation.isValid || !calculation.primaryEdd) return null;

  const {
    primaryEdd,
    doctorEdd,
    calculatedEdd,
    datesDiffer,
    dateDifferenceDays,
    isUsingDoctorEdd,
    hasLmp,
    hasDoctorEdd,
    daysRemaining,
    isOverdue,
    overdueDays,
    isDueToday,
  } = calculation;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#1E1722] border border-[#EFE8DE] dark:border-[#332537] shadow-premium p-6 sm:p-8 text-center space-y-5 transition-all">
      {/* Eyebrow Header */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-champagne-100/70 dark:bg-champagne-950/40 border border-champagne-300/60 dark:border-champagne-800/60 text-[11px] font-bold uppercase tracking-widest text-champagne-800 dark:text-champagne-300">
        <HeartHandshake className="w-3.5 h-3.5 text-champagne-600 dark:text-champagne-400" />
        <span>{t.dashboard.journeyCountdownTitle}</span>
      </div>

      {/* Dominant Countdown Display */}
      <div className="py-2">
        {isDueToday ? (
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-plum-900 dark:text-champagne-300">
              {t.dashboard.todayIsEdd}
            </h2>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
              {language === 'bn' ? 'আপনার সুন্দর মুহূর্তটির আগমন আজ!' : 'Wishing you a calm and joyful day!'}
            </p>
          </div>
        ) : isOverdue ? (
          <div className="space-y-1">
            <div className="text-5xl sm:text-6xl font-black text-plum-800 dark:text-plum-200">
              {formatNumber(overdueDays)}
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-charcoal-500 dark:text-charcoal-400">
              {t.dashboard.daysPastEdd.replace('{days}', formatNumber(overdueDays))}
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-plum-900 dark:text-white leading-none">
              {formatNumber(daysRemaining)}
            </div>
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-champagne-700 dark:text-champagne-300 pt-1">
              {t.dashboard.daysToGo}
            </div>
          </div>
        )}
      </div>

      {/* Due Date Display */}
      <div className="pt-2 border-t border-[#F2ECE3] dark:border-[#2C2130]">
        <div className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-400 mb-0.5">
          {hasDoctorEdd ? t.dashboard.doctorEdd : t.dashboard.primaryEdd}
        </div>
        <div className="text-xl sm:text-2xl font-bold text-plum-950 dark:text-white flex items-center justify-center space-x-2">
          <Calendar className="w-5 h-5 text-plum-600 dark:text-dustyRose-400" />
          <span>{formatDate(primaryEdd)}</span>
        </div>
      </div>

      {/* Clear Source Explanation Notice */}
      <div className="max-w-lg mx-auto">
        <div className="inline-flex items-center space-x-2 text-xs text-charcoal-600 dark:text-charcoal-300 bg-ivory-100/90 dark:bg-charcoal-900/60 px-3.5 py-2 rounded-2xl border border-ivory-300 dark:border-charcoal-800 text-left">
          <Info className="w-4 h-4 text-plum-600 dark:text-champagne-400 flex-shrink-0" />
          <p className="leading-relaxed">
            {isUsingDoctorEdd
              ? t.dashboard.doctorEddExplanation
              : t.dashboard.lmpEddExplanation}
          </p>
        </div>

        {/* If Both Dates Exist: Expandable Comparison */}
        {hasDoctorEdd && hasLmp && datesDiffer && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="text-[11px] font-semibold text-plum-700 dark:text-dustyRose-300 hover:underline inline-flex items-center space-x-1"
            >
              <span>{showComparison ? t.dashboard.hideDetails : t.dashboard.viewDetails}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showComparison ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showComparison && (
              <div className="mt-2 text-xs bg-ivory-50 dark:bg-charcoal-900/90 p-3.5 rounded-2xl border border-[#EFE8DE] dark:border-charcoal-800 text-left space-y-2">
                <div className="flex justify-between items-center text-charcoal-600 dark:text-charcoal-300">
                  <span>{t.dashboard.doctorOrUsEdd}:</span>
                  <span className="font-bold text-charcoal-900 dark:text-white">
                    {formatDate(doctorEdd)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-charcoal-600 dark:text-charcoal-300">
                  <span>{t.dashboard.calculatedFromLmp}:</span>
                  <span className="font-semibold text-charcoal-800 dark:text-charcoal-200">
                    {formatDate(calculatedEdd)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EFE8DE] dark:border-charcoal-800 flex items-center justify-between text-[11px] text-sage-700 dark:text-sage-400 font-medium">
                  <span>{t.dashboard.usingForCountdown}</span>
                  <span className="flex items-center space-x-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
                    <span>{t.dashboard.doctorOrUsEdd}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
