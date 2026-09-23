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
      <div className="p-6 sm:p-8 bg-navy-surface rounded-2xl border border-navy-border shadow-premium text-center">
        <div className="max-w-md mx-auto space-y-5">
          <div className="inline-flex p-3 rounded-xl bg-navy-elevated border border-navy-border text-emerald-accent mb-1">
            <Droplet className="w-7 h-7 fill-current" />
          </div>

          <h3 className="text-xl font-black text-text-primary tracking-tight">
            {t.tracking.waterTitle}
          </h3>
          <p className="text-xs text-text-muted">
            {t.tracking.waterSubtitle}
          </p>

          {/* Big Glasses Indicator */}
          <div className="py-2">
            <div className="text-4xl sm:text-5xl font-black text-text-primary">
              {formatNumber(glasses)}{' '}
              <span className="text-lg sm:text-xl text-text-muted font-normal">
                / {formatNumber(goalGlasses)}
              </span>
            </div>
            <p className="text-xs text-emerald-soft mt-1 font-medium">
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
                      ? 'bg-emerald border-emerald text-navy-bg shadow-glow-emerald scale-105'
                      : 'bg-navy-elevated border-navy-border text-text-muted hover:border-emerald/40'
                  }`}
                  title={`Set to ${i + 1} glasses`}
                >
                  <Droplet className={`w-4 h-4 ${isFilled ? 'fill-navy-bg' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-navy-elevated rounded-full h-2 overflow-hidden border border-navy-border">
            <motion.div
              className="bg-gradient-to-r from-emerald-teal to-emerald h-full rounded-full shadow-[0_0_12px_rgba(0,201,154,0.4)]"
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
              className="p-3 rounded-xl border border-navy-border bg-navy-elevated text-text-muted hover:text-text-primary disabled:opacity-40 transition"
              title="Minus one glass"
            >
              <Minus className="w-4 h-4" />
            </button>

            <button
              onClick={() => updateGlasses(glasses + 1)}
              className="py-2.5 px-6 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg font-bold text-xs shadow-subtle flex items-center space-x-1.5 transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.tracking.addGlass}</span>
            </button>

            <button
              onClick={() => updateGlasses(0)}
              disabled={glasses === 0}
              className="p-3 rounded-xl border border-navy-border bg-navy-elevated text-text-muted hover:text-text-primary disabled:opacity-40 transition"
              title={t.common.reset}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hydration safety tip */}
      <div className="p-4 rounded-xl bg-navy-surface border border-navy-border flex items-start space-x-3 text-xs text-text-muted">
        <Info className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.tracking.waterDisclaimer}
        </p>
      </div>
    </div>
  );
}
