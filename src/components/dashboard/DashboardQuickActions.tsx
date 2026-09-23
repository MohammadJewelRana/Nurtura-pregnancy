'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footprints, Droplet, Scale, BookOpen, Plus } from 'lucide-react';
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

  const actions = [
    {
      href: '/tracking?tab=kicks',
      label: t.dashboard.logMovement,
      icon: Footprints,
      color: 'text-plum-700 dark:text-dustyRose-300 bg-plum-50 dark:bg-plum-950/40 border-plum-200/50 dark:border-plum-800/40',
      badge: null,
    },
    {
      href: '/tracking?tab=water',
      label: t.dashboard.logWater,
      icon: Droplet,
      color: 'text-dustyRose-600 dark:text-dustyRose-300 bg-dustyRose-50 dark:bg-dustyRose-950/40 border-dustyRose-200/50 dark:border-dustyRose-800/40',
      badge: (
        <button
          onClick={addQuickGlass}
          title="Quick +1 glass"
          className="p-1 rounded-full bg-plum-700 text-white hover:bg-plum-800 transition shadow-subtle"
        >
          <Plus className="w-3 h-3" />
        </button>
      ),
      subtext: `${formatNumber(glasses)}/8`,
    },
    {
      href: '/tracking?tab=weight',
      label: t.dashboard.weightTrack,
      icon: Scale,
      color: 'text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-950/40 border-sage-200/50 dark:border-sage-800/40',
      badge: null,
    },
    {
      href: '/journal',
      label: t.dashboard.moodTrack,
      icon: BookOpen,
      color: 'text-champagne-700 dark:text-champagne-300 bg-champagne-50 dark:bg-champagne-950/40 border-champagne-200/50 dark:border-champagne-800/40',
      badge: null,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal-400 dark:text-charcoal-400">
          {t.dashboard.quickActions}
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E1722] border border-[#EFE8DE] dark:border-[#332537] shadow-subtle hover:shadow-premium hover:border-plum-200 dark:hover:border-plum-800 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl border ${item.color} group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-plum-950 dark:text-white block group-hover:text-plum-700 dark:group-hover:text-dustyRose-300 transition-colors">
                    {item.label}
                  </span>
                  {item.subtext && (
                    <span className="text-[10px] text-charcoal-400 font-medium">
                      {item.subtext}
                    </span>
                  )}
                </div>
              </div>

              {item.badge}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
