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
      color: 'text-plum-700 dark:text-dustyRose-300 bg-plum-50 dark:bg-plum-950/40 border-plum-200/50 dark:border-plum-800/40',
    },
    {
      href: '/checklist',
      label: t.nav.checklists,
      desc: t.checklists.subtitle,
      icon: CheckSquare,
      color: 'text-dustyRose-600 dark:text-dustyRose-300 bg-dustyRose-50 dark:bg-dustyRose-950/40 border-dustyRose-200/50 dark:border-dustyRose-800/40',
    },
    {
      href: '/appointments',
      label: t.nav.appointments,
      desc: t.appointments.subtitle,
      icon: CalendarDays,
      color: 'text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-950/40 border-sage-200/50 dark:border-sage-800/40',
    },
    {
      href: '/names',
      label: t.nav.names,
      desc: t.names.subtitle,
      icon: Sparkles,
      color: 'text-champagne-700 dark:text-champagne-300 bg-champagne-50 dark:bg-champagne-950/40 border-champagne-200/50 dark:border-champagne-800/40',
    },
    {
      href: '/faq',
      label: t.nav.faq,
      desc: t.faq.subtitle,
      icon: HelpCircle,
      color: 'text-charcoal-700 dark:text-charcoal-300 bg-ivory-100 dark:bg-charcoal-900 border-ivory-300 dark:border-charcoal-800',
    },
    {
      href: '/settings',
      label: t.nav.settings,
      desc: t.settings.subtitle,
      icon: Settings,
      color: 'text-charcoal-700 dark:text-charcoal-300 bg-ivory-100 dark:bg-charcoal-900 border-ivory-300 dark:border-charcoal-800',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-plum-950 dark:text-white">
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
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1722] border border-[#EFE8DE] dark:border-[#332537] shadow-subtle hover:shadow-premium flex items-center justify-between group transition-all duration-200"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2.5 rounded-2xl border ${item.color} group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-plum-950 dark:text-white group-hover:text-plum-700 dark:group-hover:text-dustyRose-300 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-xs text-charcoal-400 dark:text-charcoal-400 line-clamp-1 max-w-[200px] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-charcoal-300 group-hover:text-plum-600 dark:group-hover:text-dustyRose-300 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>

      {/* Safety Badge */}
      <div className="p-4 rounded-2xl bg-white/60 dark:bg-charcoal-900/40 border border-[#EFE8DE] dark:border-[#332537] flex items-center space-x-3 text-xs text-charcoal-600 dark:text-charcoal-400">
        <ShieldCheck className="w-4 h-4 text-sage-600 dark:text-sage-400 flex-shrink-0" />
        <p>{t.common.localPrivacySub}</p>
      </div>
    </div>
  );
}
