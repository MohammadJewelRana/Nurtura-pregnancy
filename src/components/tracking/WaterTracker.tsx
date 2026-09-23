'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, Minus, RotateCcw, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { WaterLog } from '@/types/pregnancy';
import { getSavedWaterLogs, saveWaterLogs } from '@/lib/storage/local-storage';
import { toDateString, getTodayDate } from '@/lib/date/date-utils';

export function WaterTracker() {
  const { t, formatNumber } = useLanguage();
  const todayKey = toDateString(getTodayDate());
  const [glasses, setGlasses] = useState<number>(0);
  const goalGlasses = 8;

  useEffect(() => {
    const logs = getSavedWaterLogs();
    setGlasses(logs[todayKey]?.glasses || 0);
  }, [todayKey]);

  const updateGlasses = (newCount: number) => {
    const count = Math.max(0, Math.min(20, newCount));
    const logs = getSavedWaterLogs();
    const entry: WaterLog = {
      date: todayKey,
      glasses: count,
      goalGlasses,
    };
    logs[todayKey] = entry;
    saveWaterLogs(logs);
    setGlasses(count);
  };

  const percent = Math.min(100, Math.round((glasses / goalGlasses) * 100));

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 bg-white dark:bg-[#1E1722] rounded-3xl border border-[#EFE8DE] dark:border-[#332537] shadow-subtle text-center">
        <div className="max-w-md mx-auto space-y-5">
          <div className="inline-flex p-3 rounded-2xl bg-dustyRose-50 dark:bg-dustyRose-950/40 text-dustyRose-600 dark:text-dustyRose-300 mb-1">
            <Droplet className="w-7 h-7 fill-current" />
          </div>

          <h3 className="text-xl font-bold text-plum-950 dark:text-white">
            {t.tracking.waterTitle}
          </h3>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
            {t.tracking.waterSubtitle}
          </p>

          {/* Big Glasses Indicator */}
          <div className="py-2">
            <div className="text-4xl sm:text-5xl font-extrabold text-plum-900 dark:text-white">
              {formatNumber(glasses)}{' '}
              <span className="text-lg sm:text-xl text-charcoal-400 font-medium">
                / {formatNumber(goalGlasses)}
              </span>
            </div>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1">
              {t.tracking.glassesDrank} (~{formatNumber((glasses * 0.25).toFixed(1))} L)
            </p>
          </div>

          {/* Visual Glass Glyphs */}
          <div className="flex flex-wrap items-center justify-center gap-2 py-2">
            {Array.from({ length: goalGlasses }).map((_, i) => {
              const isFilled = i < glasses;
              return (
                <button
                  key={i}
                  onClick={() => updateGlasses(i + 1)}
                  className={`w-9 h-11 rounded-xl border flex items-center justify-center transition-all ${
                    isFilled
                      ? 'bg-plum-700 border-plum-800 text-white shadow-subtle scale-105'
                      : 'bg-ivory-50 dark:bg-charcoal-800 border-[#EFE8DE] dark:border-charcoal-700 text-plum-300 dark:text-charcoal-600 hover:bg-ivory-100'
                  }`}
                  title={`Set to ${i + 1} glasses`}
                >
                  <Droplet className={`w-4 h-4 ${isFilled ? 'fill-white' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-ivory-100 dark:bg-charcoal-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-[#EFE8DE] dark:border-charcoal-700">
            <motion.div
              className="bg-gradient-to-r from-dustyRose-400 to-plum-700 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => updateGlasses(glasses - 1)}
              disabled={glasses <= 0}
              className="px-4 py-2.5 rounded-2xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-100 disabled:opacity-40 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>{t.tracking.removeGlass}</span>
            </button>

            <button
              onClick={() => updateGlasses(glasses + 1)}
              className="px-5 py-2.5 rounded-2xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-semibold shadow-subtle flex items-center space-x-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.tracking.addGlass}</span>
            </button>

            <button
              onClick={() => updateGlasses(0)}
              className="p-2.5 rounded-2xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-500 hover:text-plum-700 transition"
              title="Reset day"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hydration Disclaimer */}
      <div className="p-4 rounded-2xl bg-ivory-100/80 dark:bg-charcoal-800/60 border border-[#EFE8DE] dark:border-charcoal-700 flex items-start space-x-3 text-xs text-charcoal-600 dark:text-charcoal-300">
        <Info className="w-4 h-4 flex-shrink-0 text-plum-600 dark:text-champagne-400 mt-0.5" />
        <p className="leading-relaxed">{t.tracking.waterDisclaimer}</p>
      </div>
    </div>
  );
}
