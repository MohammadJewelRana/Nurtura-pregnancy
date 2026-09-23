'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckSquare,
  CalendarDays,
  Sparkles,
  HelpCircle,
  Settings,
  ChevronRight,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function MoreNavHub() {
  const { t } = useLanguage();

  const links = [
    {
      href: '/journal',
      label: t.nav.journal,
      desc: t.journal.subtitle,
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
    },
    {
      href: '/checklist',
      label: t.nav.checklists,
      desc: t.checklists.subtitle,
      icon: CheckSquare,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    },
    {
      href: '/appointments',
      label: t.nav.appointments,
      desc: t.appointments.subtitle,
      icon: CalendarDays,
      color: 'text-lavender-600 bg-lavender-50 dark:bg-lavender-950/40 border-lavender-200 dark:border-lavender-800',
    },
    {
      href: '/names',
      label: t.nav.names,
      desc: t.names.subtitle,
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    },
    {
      href: '/faq',
      label: t.nav.faq,
      desc: t.faq.subtitle,
      icon: HelpCircle,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    },
    {
      href: '/settings',
      label: t.nav.settings,
      desc: t.settings.subtitle,
      icon: Settings,
      color: 'text-charcoal-700 bg-charcoal-50 dark:bg-charcoal-800 border-charcoal-200 dark:border-charcoal-700',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 dark:text-white">
          {t.nav.more}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
          Explore all tools and features of your pregnancy sanctuary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft hover:shadow-soft-lg flex items-center justify-between group transition"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-3 rounded-2xl border ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-charcoal-900 dark:text-white group-hover:text-rose-600 transition">
                    {item.label}
                  </h3>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 line-clamp-1 max-w-[200px]">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-charcoal-300 group-hover:text-rose-500 transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>

      {/* Safety Badge */}
      <div className="p-4 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-800 flex items-center space-x-3 text-xs text-charcoal-600 dark:text-charcoal-400">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <p>{t.common.localPrivacySub}</p>
      </div>
    </div>
  );
}
