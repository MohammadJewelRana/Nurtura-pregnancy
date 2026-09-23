'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Square, RotateCcw, AlertTriangle, History, Clock, ShieldAlert } from 'lucide-react';
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
      <div className="p-6 sm:p-8 bg-navy-surface rounded-2xl border border-navy-border shadow-premium text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="inline-flex p-3 rounded-xl bg-navy-elevated border border-navy-border text-emerald mb-1">
            <Footprints className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-text-primary tracking-tight">
            {t.tracking.kicksTitle}
          </h3>
          <p className="text-xs text-text-muted">
            {t.tracking.kicksSubtitle}
          </p>

          {/* Big Interactive Tap Button */}
          <div className="py-4">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleKick}
              className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-full bg-gradient-to-tr from-emerald-dark via-emerald to-emerald-accent text-navy-bg shadow-glow-emerald flex flex-col items-center justify-center border-4 border-navy-elevated focus:outline-none transition-shadow"
            >
              <Footprints className="w-7 h-7 mb-1 opacity-90 stroke-[2.5]" />
              <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">{formatNumber(currentCount)}</span>
              <span className="text-[11px] font-bold text-navy-bg/85 uppercase tracking-wider mt-1">{t.tracking.kicksCounted}</span>
            </motion.button>
            <p className="text-xs text-text-muted mt-3 font-medium">
              {t.tracking.tapToCount}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={handleSaveSession}
              disabled={currentCount === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg font-bold text-xs shadow-subtle disabled:opacity-40 transition flex items-center space-x-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{t.tracking.finishSession}</span>
            </button>
            <button
              onClick={handleReset}
              disabled={currentCount === 0}
              className="px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-muted hover:text-text-primary disabled:opacity-40 text-xs font-semibold transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.common.reset}</span>
            </button>
          </div>

          {/* Today's total count */}
          <div className="pt-4 border-t border-navy-border flex items-center justify-between text-xs text-text-secondary">
            <span>{language === 'bn' ? 'আজকের মোট মুভমেন্ট' : "Today's Total Movements"}:</span>
            <span className="font-extrabold text-sm text-emerald">
              {formatNumber(todayKicksCount)} {language === 'bn' ? 'টি' : 'kicks'}
            </span>
          </div>
        </div>
      </div>

      {/* Medical Safety Disclaimer (Clear guidance for reduced/unusual movement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-navy-surface border border-state-warning/40 flex items-start space-x-3 text-xs text-text-secondary">
        <ShieldAlert className="w-5 h-5 text-state-warning flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-text-primary block font-bold">
            {t.common.disclaimerTitle}
          </strong>
          <p className="leading-relaxed text-text-muted">
            {t.tracking.kickDisclaimer}
          </p>
        </div>
      </div>

      {/* History */}
      {sessions.length > 0 && (
        <div className="p-6 bg-navy-surface rounded-2xl border border-navy-border shadow-subtle space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-text-muted uppercase tracking-wider">
            <History className="w-4 h-4 text-emerald" />
            <span>{t.tracking.kicksHistory}</span>
          </div>

          <div className="divide-y divide-navy-border text-xs">
            {sessions.slice(0, 5).map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-text-primary block">
                    {formatNumber(s.count)} {language === 'bn' ? 'টি নড়াচড়া' : 'movements'}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {formatDate(s.date)} • {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-text-muted text-[11px]">
                  <Clock className="w-3 h-3 text-emerald" />
                  <span>{formatNumber(s.durationMinutes ?? 0)} {language === 'bn' ? 'মিনিট' : 'min'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
