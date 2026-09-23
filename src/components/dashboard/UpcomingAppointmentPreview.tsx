'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarDays, Plus, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment } from '@/types/pregnancy';
import { getSavedAppointments } from '@/lib/storage/local-storage';
import { parseLocalDate, getTodayDate } from '@/lib/date/date-utils';

export function UpcomingAppointmentPreview() {
  const { t, formatDate } = useLanguage();
  const [nextAppt, setNextAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    const list = getSavedAppointments();
    const today = getTodayDate();
    const upcoming = list
      .filter((a) => {
        const d = parseLocalDate(a.date);
        return d && d >= today && !a.isCompleted;
      })
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    setNextAppt(upcoming[0] || null);
  }, []);

  return (
    <div className="rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 p-5 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-lavender-50 dark:bg-charcoal-800 text-lavender-600 dark:text-lavender-400">
            <CalendarDays className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-charcoal-900 dark:text-white">
            {t.dashboard.upcomingAppt}
          </h3>
        </div>

        <Link
          href="/appointments"
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center space-x-1"
        >
          <span>{nextAppt ? t.common.all : t.dashboard.addAppt}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {nextAppt ? (
        <div className="p-4 rounded-2xl bg-lavender-50/40 dark:bg-charcoal-800/60 border border-lavender-100 dark:border-charcoal-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-sm text-charcoal-900 dark:text-white mb-1">
              {nextAppt.doctorName}
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-charcoal-500 dark:text-charcoal-400">
              <span className="flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(nextAppt.date)} {nextAppt.time ? `• ${nextAppt.time}` : ''}
              </span>
              {nextAppt.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {nextAppt.location}
                </span>
              )}
            </div>
            {nextAppt.notes && (
              <p className="mt-2 text-charcoal-600 dark:text-charcoal-300 italic line-clamp-1">
                &ldquo;{nextAppt.notes}&rdquo;
              </p>
            )}
          </div>

          <Link
            href="/appointments"
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal-700 border border-lavender-200 dark:border-charcoal-600 text-charcoal-700 dark:text-charcoal-200 hover:text-rose-600 font-medium transition"
          >
            {t.common.edit}
          </Link>
        </div>
      ) : (
        <div className="text-center py-4 px-3 rounded-2xl bg-rose-50/20 dark:bg-charcoal-800/30 border border-dashed border-rose-200 dark:border-charcoal-700">
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mb-2">
            {t.dashboard.noAppt}
          </p>
          <Link
            href="/appointments"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.dashboard.addAppt}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
