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
    <div className="rounded-3xl bg-white dark:bg-[#1E1722] border border-[#EFE8DE] dark:border-[#332537] p-6 sm:p-7 shadow-subtle space-y-4">
      {/* Eyebrow */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-plum-700 dark:text-dustyRose-400 block">
          {t.dashboard.nextApptHeading}
        </span>

        {nextAppt && (
          <Link
            href="/appointments"
            className="text-xs font-semibold text-plum-700 dark:text-dustyRose-300 hover:underline flex items-center space-x-1"
          >
            <span>{t.dashboard.viewAppt}</span>
          </Link>
        )}
      </div>

      {nextAppt ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-ivory-100/90 dark:bg-charcoal-900/60 border border-ivory-300 dark:border-charcoal-800">
          <div>
            <div className="text-base sm:text-lg font-bold text-plum-950 dark:text-white mb-1">
              {nextAppt.doctorName}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-600 dark:text-charcoal-300">
              <span className="flex items-center gap-1 font-semibold text-plum-800 dark:text-champagne-300">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(nextAppt.date)} {nextAppt.time ? `• ${nextAppt.time}` : ''}
              </span>
              {nextAppt.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-dustyRose-500" />
                  {nextAppt.location}
                </span>
              )}
            </div>
            {nextAppt.notes && (
              <p className="mt-1.5 text-xs text-charcoal-500 dark:text-charcoal-400 italic line-clamp-1">
                &ldquo;{nextAppt.notes}&rdquo;
              </p>
            )}
          </div>

          <Link
            href="/appointments"
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-[#EFE8DE] dark:border-charcoal-700 text-xs font-semibold text-plum-800 dark:text-dustyRose-200 hover:bg-plum-50 transition"
          >
            {t.common.edit}
          </Link>
        </div>
      ) : (
        <div className="py-5 px-4 text-center rounded-2xl bg-ivory-50 dark:bg-charcoal-900/40 border border-dashed border-[#EFE8DE] dark:border-charcoal-800 space-y-2">
          <CalendarDays className="w-6 h-6 text-plum-400 dark:text-dustyRose-400 mx-auto opacity-75" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-plum-950 dark:text-white">
              {t.dashboard.noApptTitle}
            </h4>
            <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400">
              {t.dashboard.noApptDesc}
            </p>
          </div>
          <Link
            href="/appointments"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-semibold shadow-subtle transition mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.dashboard.addAppt}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
