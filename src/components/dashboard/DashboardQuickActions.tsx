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
    e.stopPropagation();
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
      iconColor: 'text-emerald',
      bgColor: 'bg-navy-elevated border-navy-border',
      badge: null,
      subtext: null,
    },
    {
      href: '/tracking?tab=water',
      label: t.dashboard.logWater,
      icon: Droplet,
      iconColor: 'text-emerald-accent',
      bgColor: 'bg-navy-elevated border-navy-border',
      badge: (
        <button
          onClick={addQuickGlass}
          title="Quick +1 glass"
          className="p-1 rounded-lg bg-emerald text-navy-bg hover:bg-emerald-accent transition shadow-subtle flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      ),
      subtext: `${formatNumber(glasses)}/8`,
    },
    {
      href: '/tracking?tab=weight',
      label: t.dashboard.weightTrack,
      icon: Scale,
      iconColor: 'text-emerald-soft',
      bgColor: 'bg-navy-elevated border-navy-border',
      badge: null,
      subtext: null,
    },
    {
      href: '/journal',
      label: t.dashboard.moodTrack,
      icon: BookOpen,
      iconColor: 'text-state-warning',
      bgColor: 'bg-navy-elevated border-navy-border',
      badge: null,
      subtext: null,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">
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
              className="p-3.5 sm:p-4 rounded-xl bg-navy-surface border border-navy-border shadow-subtle hover:bg-navy-elevated hover:border-emerald/40 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div
                  className={`p-2.5 rounded-lg border ${item.bgColor} ${item.iconColor} group-hover:scale-105 transition-transform duration-200 flex-shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs sm:text-sm font-bold text-text-primary block truncate group-hover:text-emerald transition-colors">
                    {item.label}
                  </span>
                  {item.subtext && (
                    <span className="text-[10px] text-text-muted font-medium">
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
