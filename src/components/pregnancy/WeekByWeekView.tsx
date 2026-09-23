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
  Ruler,
  Weight,
  CalendarCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { getWeekData } from '@/data/pregnancy-weeks/weeks-data';

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
  let weekTrimester = 1;
  let trimesterBadge = t.common.firstTrimester;
  if (selectedWeek >= 28) {
    weekTrimester = 3;
    trimesterBadge = t.common.thirdTrimester;
  } else if (selectedWeek >= 14) {
    weekTrimester = 2;
    trimesterBadge = t.common.secondTrimester;
  }

  const fruitName = language === 'bn' ? weekData.fruitComparisonBn : weekData.fruitComparisonEn;
  const devText = language === 'bn' ? weekData.babyDevelopmentBn : weekData.babyDevelopmentEn;
  const motherText = language === 'bn' ? weekData.motherChangesBn : weekData.motherChangesEn;
  const wellnessText = language === 'bn' ? weekData.wellnessTipBn : weekData.wellnessTipEn;
  const milestoneText = language === 'bn' ? weekData.milestoneBn : weekData.milestoneEn;
  const prepText = language === 'bn' ? weekData.prepSuggestionBn : weekData.prepSuggestionEn;

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Arrows */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={selectedWeek <= 1}
            className="p-2.5 rounded-2xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-200 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center px-4">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              {trimesterBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 dark:text-white">
              {t.common.week} {formatNumber(selectedWeek)}
            </h2>
          </div>

          <button
            onClick={handleNext}
            disabled={selectedWeek >= 40}
            className="p-2.5 rounded-2xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-200 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
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
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-sm font-semibold text-charcoal-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
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
              className="px-3.5 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold whitespace-nowrap transition"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Fruit & Growth Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 via-cream-100 to-rose-100/60 dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900 border border-rose-200/80 dark:border-charcoal-700 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-3xl bg-white dark:bg-charcoal-800 flex items-center justify-center text-3xl shadow-sm border border-rose-100 dark:border-charcoal-700">
                  ✨
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                    {t.babyWeek.sizeComparison}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 dark:text-white">
                    {fruitName}
                  </h3>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                    {language === 'bn' ? weekData.babySizeBn : weekData.babySizeEn}
                  </p>
                </div>
              </div>

              {/* Measurements */}
              <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/80 dark:bg-charcoal-800/80 border border-rose-100 dark:border-charcoal-700">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-charcoal-700 text-rose-500">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-charcoal-400 block">{t.dashboard.approxLength}</span>
                    <span className="text-sm font-bold text-charcoal-900 dark:text-white">
                      ~{formatNumber(weekData.approxLengthCm)} cm
                    </span>
                  </div>
                </div>

                <div className="w-px h-8 bg-charcoal-200 dark:bg-charcoal-700" />

                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-sage-50 dark:bg-charcoal-700 text-sage-600 dark:text-sage-400">
                    <Weight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-charcoal-400 block">{t.dashboard.approxWeight}</span>
                    <span className="text-sm font-bold text-charcoal-900 dark:text-white">
                      ~{formatNumber(weekData.approxWeightGrams)} g
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone Badge */}
            <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-charcoal-700 flex items-center space-x-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>{milestoneText}</span>
            </div>
          </div>

          {/* Development Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Baby Development */}
            <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500">
                  <BabyIcon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-charcoal-900 dark:text-white">
                  {t.babyWeek.development}
                </h4>
              </div>
              <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                {devText}
              </p>
            </div>

            {/* Mother Changes */}
            <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-2xl bg-sage-50 dark:bg-sage-950/50 text-sage-600 dark:text-sage-400">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-charcoal-900 dark:text-white">
                  {t.babyWeek.bodyChanges}
                </h4>
              </div>
              <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                {motherText}
              </p>
            </div>

            {/* Wellness Tip */}
            <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-2xl bg-lavender-50 dark:bg-charcoal-800 text-lavender-600 dark:text-lavender-400">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-charcoal-900 dark:text-white">
                  {t.babyWeek.wellnessTip}
                </h4>
              </div>
              <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                {wellnessText}
              </p>
            </div>

            {/* Preparation Suggestion */}
            <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-charcoal-800 text-amber-600 dark:text-amber-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-charcoal-900 dark:text-white">
                  {t.babyWeek.prepSuggestion}
                </h4>
              </div>
              <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                {prepText}
              </p>
            </div>
          </div>

          {/* Medical Disclaimer Note */}
          <div className="p-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-800/40 border border-charcoal-200/60 dark:border-charcoal-700/60 flex items-start space-x-3 text-xs text-charcoal-500 dark:text-charcoal-400">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-charcoal-400" />
            <p>
              {language === 'bn'
                ? 'সতর্কতা: প্রতিটি গর্ভধারণ এবং শিশুর বিকাশ অনন্য ও পরিবর্তনশীল। উপরোক্ত তথ্যগুলো চিকিৎসাবিজ্ঞানের গড় অনুমানের ওপর ভিত্তি করে তৈরি এবং এটি কোনো ব্যক্তিগত চিকিৎসা নির্ণয়ের অংশ নয়।'
                : 'Note: Every pregnancy develops at its own unique pace. Growth metrics and milestones are informational clinical approximations and not a substitute for professional medical care.'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
