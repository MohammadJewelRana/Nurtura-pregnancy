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
    <div className="rounded-2xl bg-navy-surface border border-navy-border p-6 sm:p-7 shadow-premium space-y-4">
      {/* Eyebrow */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald block">
          {t.dashboard.nextApptHeading}
        </span>

        {nextAppt && (
          <Link
            href="/appointments"
            className="text-xs font-semibold text-emerald hover:text-emerald-accent flex items-center space-x-1"
          >
            <span>{t.dashboard.viewAppt}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {nextAppt ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-navy-elevated border border-navy-border">
          <div>
            <div className="text-base sm:text-lg font-bold text-text-primary mb-1">
              {nextAppt.doctorName}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1 font-semibold text-emerald">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(nextAppt.date)} {nextAppt.time ? `• ${nextAppt.time}` : ''}
              </span>
              {nextAppt.location && (
                <span className="flex items-center gap-1 text-text-muted">
                  <MapPin className="w-3.5 h-3.5 text-emerald-accent" />
                  {nextAppt.location}
                </span>
              )}
            </div>
            {nextAppt.notes && (
              <p className="mt-1.5 text-xs text-text-muted italic line-clamp-1">
                &ldquo;{nextAppt.notes}&rdquo;
              </p>
            )}
          </div>

          <Link
            href="/appointments"
            className="self-start sm:self-center px-4 py-2 rounded-lg bg-navy-surface border border-navy-border text-xs font-semibold text-emerald hover:bg-navy-elevated transition"
          >
            {t.common.edit}
          </Link>
        </div>
      ) : (
        <div className="py-6 px-4 text-center rounded-xl bg-navy-elevated/50 border border-dashed border-navy-border space-y-2">
          <CalendarDays className="w-6 h-6 text-emerald mx-auto opacity-70" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-text-primary">
              {t.dashboard.noApptTitle}
            </h4>
            <p className="text-[11px] text-text-muted">
              {t.dashboard.noApptDesc}
            </p>
          </div>
          <Link
            href="/appointments"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-semibold shadow-subtle transition mt-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.dashboard.addAppt}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
