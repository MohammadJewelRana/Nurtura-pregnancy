'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Stethoscope, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';

export function PregnancyHeroCard() {
  const { t, formatNumber, formatDate, language } = useLanguage();
  const { calculation } = usePregnancy();

  if (!calculation.isValid) return null;

  const {
    currentWeek,
    currentDay,
    progressPercent,
    daysRemaining,
    isOverdue,
    overdueDays,
    isDueToday,
    trimester,
    primaryEdd,
    doctorEdd,
    calculatedEdd,
    datesDiffer,
    dateDifferenceDays,
    isUsingDoctorEdd,
  } = calculation;

  const trimesterLabel =
    trimester === 1
      ? t.common.firstTrimester
      : trimester === 2
      ? t.common.secondTrimester
      : t.common.thirdTrimester;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white p-6 sm:p-8 shadow-soft-lg">
      {/* Decorative backdrop elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-rose-400/20 blur-xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Badges: Trimester & Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-rose-50 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{trimesterLabel}</span>
          </span>

          <div className="text-xs font-medium px-3 py-1 rounded-full bg-black/15 backdrop-blur-md text-white/90">
            {isDueToday ? (
              <span className="font-bold text-amber-200">{t.common.dueToday}</span>
            ) : isOverdue ? (
              <span className="font-semibold text-rose-100 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 inline text-amber-300" />
                {language === 'bn'
                  ? `সম্ভাব্য প্রসবের তারিখ থেকে ${formatNumber(overdueDays)} দিন অতিক্রান্ত`
                  : `Due date passed by ${formatNumber(overdueDays)} days`}
              </span>
            ) : (
              <span>
                <strong className="text-white font-bold">{formatNumber(daysRemaining)}</strong>{' '}
                {t.common.daysRemaining}
              </span>
            )}
          </div>
        </div>

        {/* Big Gestational Age Header */}
        <div className="my-3 sm:my-5">
          <p className="text-xs sm:text-sm text-rose-100/90 font-medium">
            {t.dashboard.currentStage}
          </p>
          <div className="flex items-baseline space-x-2 mt-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {formatNumber(currentWeek)}{' '}
              <span className="text-lg sm:text-2xl font-semibold opacity-90">{t.common.weeks}</span>{' '}
              {formatNumber(currentDay)}{' '}
              <span className="text-lg sm:text-2xl font-semibold opacity-90">{t.common.days}</span>
            </h1>
          </div>
        </div>

        {/* Progress Bar with Framer Motion */}
        <div className="mt-4 mb-6">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-rose-100">
            <span>{t.dashboard.progressTitle}</span>
            <span className="font-bold text-white text-sm">
              {formatNumber(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-200 via-rose-200 to-white shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Primary Due Date Summary Bar */}
        <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 text-rose-100">
            <Calendar className="w-4 h-4 text-white" />
            <span>{t.dashboard.primaryEdd}:</span>
            <strong className="text-white font-semibold">
              {formatDate(primaryEdd)}
            </strong>
          </div>

          {/* If Doctor EDD differs from Calculated EDD, show clear comparison */}
          {datesDiffer && doctorEdd && calculatedEdd && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur border border-white/20 text-xs">
              <Stethoscope className="w-3.5 h-3.5 text-amber-200 flex-shrink-0" />
              <span>
                {language === 'bn'
                  ? `ডাক্তারের তারিখ ব্যবহৃত হচ্ছে (ব্যবধন: ${formatNumber(Math.abs(dateDifferenceDays))} দিন)`
                  : `Doctor's date prioritized (${formatNumber(Math.abs(dateDifferenceDays))}d diff)`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
