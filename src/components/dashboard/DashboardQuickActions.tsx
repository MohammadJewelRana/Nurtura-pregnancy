'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplet, Footprints, Scale, Smile, BookOpen, CheckSquare, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getSavedWaterLogs, saveWaterLogs } from '@/lib/storage/local-storage';
import { toDateString, getTodayDate } from '@/lib/date/date-utils';

export function DashboardQuickActions() {
  const { t, formatNumber } = useLanguage();
  const todayKey = toDateString(getTodayDate());
  const [glasses, setGlasses] = useState(0);

  useEffect(() => {
    const logs = getSavedWaterLogs();
    setGlasses(logs[todayKey]?.glasses || 0);
  }, [todayKey]);

  const addQuickGlass = (e: React.MouseEvent) => {
    e.preventDefault();
    const logs = getSavedWaterLogs();
    const current = logs[todayKey]?.glasses || 0;
    const updated = current + 1;
    logs[todayKey] = {
      date: todayKey,
      glasses: updated,
      goalGlasses: 8,
    };
    saveWaterLogs(logs);
    setGlasses(updated);
  };

  const actionItems = [
    {
      href: '/tracking?tab=water',
      label: t.dashboard.logWater,
      sub: `${formatNumber(glasses)}/8`,
      icon: Droplet,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900',
      badgeAction: (
        <button
          onClick={addQuickGlass}
          title="Quick +1 glass"
          className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      ),
    },
    {
      href: '/tracking?tab=kicks',
      label: t.dashboard.kickCounter,
      sub: t.tracking.kicksCounted,
      icon: Footprints,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900',
    },
    {
      href: '/tracking?tab=weight',
      label: t.dashboard.weightTrack,
      sub: 'kg trend',
      icon: Scale,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900',
    },
    {
      href: '/tracking?tab=mood',
      label: t.dashboard.moodTrack,
      sub: 'Daily check-in',
      icon: Smile,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900',
    },
    {
      href: '/journal',
      label: t.dashboard.newJournal,
      sub: 'Memories',
      icon: BookOpen,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900',
    },
    {
      href: '/checklist',
      label: t.nav.checklists,
      sub: 'Prep & bags',
      icon: CheckSquare,
      color: 'text-rose-600 bg-rose-50/60 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900',
    },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 p-5 sm:p-6 shadow-soft">
      <h3 className="text-sm font-bold text-charcoal-900 dark:text-white uppercase tracking-wider mb-4">
        {t.dashboard.quickActions}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actionItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="group p-3 rounded-2xl border border-rose-100 dark:border-charcoal-800 bg-rose-50/20 dark:bg-charcoal-800/40 hover:bg-rose-50 dark:hover:bg-charcoal-800 hover:border-rose-200 transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl border ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                {item.badgeAction}
              </div>

              <div>
                <span className="text-xs font-bold text-charcoal-800 dark:text-white block group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                  {item.label}
                </span>
                <span className="text-[10px] text-charcoal-400 block truncate">
                  {item.sub}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
