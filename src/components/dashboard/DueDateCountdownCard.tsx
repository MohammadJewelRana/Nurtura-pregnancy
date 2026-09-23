'use client';

import React, { useState } from 'react';
import { Calendar, Info, ChevronDown, CheckCircle2, Sparkles } from 'lucide-react';
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
    isUsingDoctorEdd,
    hasLmp,
    hasDoctorEdd,
    daysRemaining,
    isOverdue,
    overdueDays,
    isDueToday,
  } = calculation;

  return (
    <div className="relative rounded-2xl bg-navy-surface border border-navy-border shadow-premium p-6 sm:p-8 text-center space-y-5 overflow-hidden">
      {/* Subtle background emerald glow in top-right */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald/10 rounded-full blur-3xl pointer-events-none" />

      {/* Eyebrow Header */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-navy-elevated border border-navy-border text-[11px] font-bold uppercase tracking-widest text-emerald">
        <Sparkles className="w-3.5 h-3.5 text-emerald-accent" />
        <span>{language === 'bn' ? "শিশুর আগমন কাউন্টডাউন" : "YOUR BABY'S ARRIVAL"}</span>
      </div>

      {/* Dominant Countdown Display */}
      <div className="py-2">
        {isDueToday ? (
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald tracking-tight">
              {t.dashboard.todayIsEdd}
            </h2>
            <p className="text-xs text-text-muted">
              {language === 'bn' ? 'আজই সেই পরম প্রতীক্ষিত আনন্দের দিন!' : 'Wishing you a calm, safe, and joyful day!'}
            </p>
          </div>
        ) : isOverdue ? (
          <div className="space-y-1">
            <div className="text-5xl sm:text-6xl font-black text-state-warning">
              {formatNumber(overdueDays)}
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-state-warning">
              {t.dashboard.daysPastEdd.replace('{days}', formatNumber(overdueDays))}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-emerald leading-none drop-shadow-[0_0_24px_rgba(0,201,154,0.3)]">
              {formatNumber(daysRemaining)}
            </div>
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-soft pt-1">
              {t.dashboard.daysToGo}
            </div>
          </div>
        )}
      </div>

      {/* Due Date Display */}
      <div className="pt-3 border-t border-navy-border">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
          {hasDoctorEdd ? t.dashboard.doctorEdd : t.dashboard.primaryEdd}
        </div>
        <div className="text-xl sm:text-2xl font-bold text-text-primary flex items-center justify-center space-x-2">
          <Calendar className="w-5 h-5 text-emerald" />
          <span>{formatDate(primaryEdd)}</span>
        </div>
      </div>

      {/* Clear Source Explanation Notice */}
      <div className="max-w-md mx-auto pt-1">
        <div className="flex items-start space-x-2.5 text-xs text-text-secondary bg-navy-elevated px-4 py-2.5 rounded-xl border border-navy-border text-left">
          <Info className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {isUsingDoctorEdd
              ? (language === 'bn'
                  ? 'ⓘ আপনার ডাক্তার/আল্ট্রাসাউন্ডে দেওয়া সম্ভাব্য প্রসবের তারিখ অনুযায়ী এই কাউন্টডাউন গণনা করা হচ্ছে।'
                  : 'ⓘ Countdown is based on the estimated due date provided by your doctor/ultrasound.')
              : (language === 'bn'
                  ? 'ⓘ শেষ মাসিকের প্রথম দিন (LMP) অনুযায়ী ২৮০ দিনের ভিত্তিতে এই কাউন্টডাউন গণনা করা হচ্ছে।'
                  : 'ⓘ Countdown is calculated from your last menstrual period (LMP).')}
          </p>
        </div>

        {/* If Both Dates Exist: Compact Expandable Comparison */}
        {hasDoctorEdd && hasLmp && datesDiffer && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="text-[11px] font-semibold text-emerald hover:underline inline-flex items-center space-x-1"
            >
              <span>{showComparison ? t.dashboard.hideDetails : t.dashboard.viewDetails}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showComparison ? 'rotate-180 text-emerald' : ''
                }`}
              />
            </button>

            {showComparison && (
              <div className="mt-2 text-xs bg-navy-elevated/90 p-3.5 rounded-xl border border-navy-border text-left space-y-2">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>{t.dashboard.doctorOrUsEdd}:</span>
                  <span className="font-bold text-text-primary">
                    {formatDate(doctorEdd)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>{t.dashboard.calculatedFromLmp}:</span>
                  <span className="font-semibold text-text-primary">
                    {formatDate(calculatedEdd)}
                  </span>
                </div>
                <div className="pt-2 border-t border-navy-border flex items-center justify-between text-[11px] text-emerald font-medium">
                  <span>{t.dashboard.usingForCountdown}</span>
                  <span className="flex items-center space-x-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
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
