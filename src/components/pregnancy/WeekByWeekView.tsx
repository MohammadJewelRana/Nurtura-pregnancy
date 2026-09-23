'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Baby as BabyIcon,
  HeartHandshake,
  HeartPulse,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { getWeekData } from '@/data/pregnancy-weeks/weeks-data';
import { BabySizeComparison } from '@/components/common/BabySizeComparison';

export function WeekByWeekView({ initialWeek }: { initialWeek?: number }) {
  const { t, language, formatNumber } = useLanguage();
  const { calculation } = usePregnancy();

  const currentGestationalWeek = calculation.isValid ? calculation.currentWeek : 12;
  const [selectedWeek, setSelectedWeek] = useState<number>(initialWeek || currentGestationalWeek || 12);

  const weekData = getWeekData(selectedWeek);

  const handlePrev = () => {
    if (selectedWeek > 1) setSelectedWeek(selectedWeek - 1);
  };

  const handleNext = () => {
    if (selectedWeek < 40) setSelectedWeek(selectedWeek + 1);
  };

  const jumpToCurrent = () => {
    if (calculation.isValid) {
      setSelectedWeek(Math.max(1, Math.min(40, calculation.currentWeek)));
    }
  };

  // Determine trimester of selected week
  let trimesterBadge = t.common.firstTrimester;
  if (selectedWeek >= 28) {
    trimesterBadge = t.common.thirdTrimester;
  } else if (selectedWeek >= 14) {
    trimesterBadge = t.common.secondTrimester;
  }

  const devText = language === 'bn' ? weekData.babyDevelopmentBn : weekData.babyDevelopmentEn;
  const motherText = language === 'bn' ? weekData.motherChangesBn : weekData.motherChangesEn;
  const wellnessText = language === 'bn' ? weekData.wellnessTipBn : weekData.wellnessTipEn;
  const milestoneText = language === 'bn' ? weekData.milestoneBn : weekData.milestoneEn;
  const prepText = language === 'bn' ? weekData.prepSuggestionBn : weekData.prepSuggestionEn;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Controller Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-premium flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Arrows */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={selectedWeek <= 1}
            className="p-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary hover:border-emerald/40 disabled:opacity-40 transition"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center px-4">
            <span className="text-xs font-semibold text-emerald uppercase tracking-wider block">
              {trimesterBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              {t.common.week} {formatNumber(selectedWeek)}
            </h2>
          </div>

          <button
            onClick={handleNext}
            disabled={selectedWeek >= 40}
            className="p-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary hover:border-emerald/40 disabled:opacity-40 transition"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dropdown Selector & Jump to Current */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald/40"
          >
            {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>
                {t.common.week} {formatNumber(w)}
              </option>
            ))}
          </select>

          {calculation.isValid && calculation.currentWeek !== selectedWeek && (
            <button
              onClick={jumpToCurrent}
              className="px-4 py-2.5 rounded-xl bg-navy-elevated border border-navy-border text-emerald hover:border-emerald/40 text-xs font-semibold whitespace-nowrap transition"
            >
              {t.babyWeek.currentWeekBtn}
            </button>
          )}
        </div>
      </div>

      {/* Week Content Display with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedWeek}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Real-World Baby Size Comparison Hero Card */}
          <div className="space-y-4">
            <BabySizeComparison
              week={selectedWeek}
              variant="prominent"
              showMeasurements={true}
            />

            {/* Milestone Badge */}
            {milestoneText && (
              <div className="p-4 rounded-xl bg-navy-surface border border-navy-border flex items-center space-x-3 text-xs sm:text-sm font-medium text-text-primary shadow-subtle">
                <div className="p-2 rounded-lg bg-emerald/10 border border-emerald/20 flex-shrink-0 text-emerald">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block">
                    {language === 'bn' ? 'সাপ্তাহিক মাইলফলক' : 'Weekly Milestone'}
                  </span>
                  <span className="font-semibold text-text-primary">{milestoneText}</span>
                </div>
              </div>
            )}
          </div>

          {/* Development Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Baby Development */}
            <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-subtle space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-navy-elevated text-emerald">
                  <BabyIcon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-text-primary">
                  {t.babyWeek.development}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {devText}
              </p>
            </div>

            {/* Mother Changes */}
            <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-subtle space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-navy-elevated text-emerald-accent">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-text-primary">
                  {t.babyWeek.bodyChanges}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {motherText}
              </p>
            </div>

            {/* Wellness Tip */}
            <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-subtle space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-navy-elevated text-state-warning">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-text-primary">
                  {t.babyWeek.wellnessTip}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {wellnessText}
              </p>
            </div>

            {/* Preparation Suggestion */}
            <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-subtle space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-navy-elevated text-emerald">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-text-primary">
                  {t.babyWeek.prepSuggestion}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {prepText}
              </p>
            </div>
          </div>

          {/* Safety note */}
          <div className="p-4 rounded-xl bg-navy-surface border border-navy-border flex items-start space-x-3 text-xs text-text-muted">
            <ShieldAlert className="w-4 h-4 text-state-warning flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.common.disclaimerText}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
