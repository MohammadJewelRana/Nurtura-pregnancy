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
    <header className="hidden md:block sticky top-0 z-40 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur border-b border-rose-100 dark:border-charcoal-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-rose-800 dark:from-rose-400 dark:to-rose-300 bg-clip-text text-transparent">
                {t.common.appName}
              </span>
              <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 -mt-1 font-normal">
                {t.common.appSubtitle}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm transition-all ${
                    isActive
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language & Theme */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
