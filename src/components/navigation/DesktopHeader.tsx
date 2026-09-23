'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Calendar, Baby, Activity, BookOpen, CheckSquare, CalendarDays, HelpCircle, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';

export function DesktopHeader() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const primaryNav = [
    { href: '/', label: t.nav.home, icon: Heart },
    { href: '/calendar', label: t.nav.calendar, icon: Calendar },
    { href: '/baby', label: t.nav.baby, icon: Baby },
    { href: '/tracking', label: t.nav.track, icon: Activity },
    { href: '/journal', label: t.nav.journal, icon: BookOpen },
    { href: '/checklist', label: t.nav.checklists, icon: CheckSquare },
    { href: '/appointments', label: t.nav.appointments, icon: CalendarDays },
    { href: '/faq', label: t.nav.faq, icon: HelpCircle },
    { href: '/settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-[#FCF9F6]/95 dark:bg-[#1C151F]/95 backdrop-blur-md border-b border-[#EFE8DE] dark:border-[#2E2432] transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Emblem */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-plum-800 via-plum-700 to-dustyRose-500 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-plum-900 dark:text-plum-100">
                {t.common.appName}
              </span>
              <p className="text-[11px] text-charcoal-400 dark:text-charcoal-400 -mt-0.5 tracking-tight font-normal">
                {t.common.appSubtitle}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 lg:space-x-1.5 text-xs lg:text-sm font-medium">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-plum-100/70 dark:bg-plum-900/40 text-plum-900 dark:text-plum-200 font-semibold shadow-subtle border border-plum-200/50 dark:border-plum-800/40'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-plum-800 dark:hover:text-plum-200 hover:bg-plum-50/60 dark:hover:bg-plum-950/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-plum-700 dark:text-dustyRose-400' : 'text-charcoal-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-2.5">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
