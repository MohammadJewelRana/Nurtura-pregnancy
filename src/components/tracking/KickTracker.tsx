'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Play, Square, RotateCcw, AlertTriangle, History, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { KickSession } from '@/types/pregnancy';
import { getSavedKicks, saveKicks } from '@/lib/storage/local-storage';
import { toDateString, getTodayDate } from '@/lib/date/date-utils';

export function KickTracker() {
  const { t, language, formatNumber, formatDate } = useLanguage();
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    setSessions(getSavedKicks());
  }, []);

  const handleStart = () => {
    setIsRecording(true);
    setCurrentCount(0);
    setStartTime(Date.now());
  };

  const handleKick = () => {
    if (!isRecording) {
      setIsRecording(true);
      setStartTime(Date.now());
    }
    setCurrentCount((prev) => prev + 1);
  };

  const handleSaveSession = () => {
    if (currentCount === 0 && !isRecording) return;
    const now = new Date();
    const duration = startTime ? Math.max(1, Math.round((Date.now() - startTime) / 60000)) : 1;

    const newSession: KickSession = {
      id: `kick_${Date.now()}`,
      date: toDateString(now),
      timestamp: now.toISOString(),
      count: currentCount,
      durationMinutes: duration,
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveKicks(updated);

    // Reset session
    setIsRecording(false);
    setCurrentCount(0);
    setStartTime(null);
  };

  const handleReset = () => {
    setIsRecording(false);
    setCurrentCount(0);
    setStartTime(null);
  };

  // Today's total kicks
  const todayStr = toDateString(getTodayDate());
  const todayKicksCount = sessions
    .filter((s) => s.date === todayStr)
    .reduce((sum, s) => sum + s.count, 0) + (isRecording ? currentCount : 0);

  return (
    <div className="space-y-6">
      {/* Tracker Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-charcoal-900 rounded-3xl border border-rose-100 dark:border-charcoal-800 shadow-soft text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mb-1">
            <Footprints className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-charcoal-900 dark:text-white">
            {t.tracking.kicksTitle}
          </h3>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
            {t.tracking.kicksSubtitle}
          </p>

          {/* Big Interactive Tap Button */}
          <div className="py-4">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleKick}
              className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white shadow-soft-lg flex flex-col items-center justify-center border-4 border-rose-100 dark:border-rose-900 focus:outline-none"
            >
              <Footprints className="w-8 h-8 mb-1" />
              <span className="text-4xl font-extrabold">{formatNumber(currentCount)}</span>
              <span className="text-[11px] font-medium opacity-90">{t.tracking.kicksCounted}</span>
            </motion.button>
            <p className="text-xs text-charcoal-400 mt-3 font-medium">
              {t.tracking.tapToCount}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {!isRecording && currentCount === 0 ? (
              <button
                onClick={handleStart}
                className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-soft flex items-center space-x-1.5 transition"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{t.tracking.startSession}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveSession}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-soft flex items-center space-x-1.5 transition"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>{t.tracking.finishSession}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-2xl border border-charcoal-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:bg-rose-50 text-xs font-medium flex items-center space-x-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.tracking.resetCounter}</span>
                </button>
              </>
            )}
          </div>

          {/* Today's total summary */}
          <div className="mt-4 p-3 rounded-2xl bg-rose-50/60 dark:bg-charcoal-800/60 border border-rose-100 dark:border-charcoal-700 text-xs text-charcoal-700 dark:text-charcoal-300 flex items-center justify-between">
            <span>{language === 'bn' ? 'আজকের মোট নড়াচড়া:' : "Today's Total Kicks:"}</span>
            <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
              {formatNumber(todayKicksCount)}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <p className="leading-relaxed">{t.tracking.kickDisclaimer}</p>
      </div>

      {/* History */}
      <div className="p-6 bg-white dark:bg-charcoal-900 rounded-3xl border border-rose-100 dark:border-charcoal-800 shadow-soft">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-4 h-4 text-rose-500" />
          <h4 className="text-sm font-bold text-charcoal-900 dark:text-white">
            {t.tracking.kicksHistory}
          </h4>
        </div>

        {sessions.length > 0 ? (
          <div className="divide-y divide-rose-50 dark:divide-charcoal-800">
            {sessions.slice(0, 10).map((session) => (
              <div key={session.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-charcoal-900 dark:text-white block">
                    {formatDate(session.date)}
                  </span>
                  <span className="text-charcoal-400 text-[11px] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {session.durationMinutes
                      ? `${formatNumber(session.durationMinutes)} min session`
                      : 'Quick entry'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                    {formatNumber(session.count)}
                  </span>
                  <span className="text-charcoal-400 block text-[10px]">{t.tracking.kicksCounted}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-charcoal-400 text-center py-4">
            {t.tracking.noKicksYet}
          </p>
        )}
      </div>
    </div>
  );
}
