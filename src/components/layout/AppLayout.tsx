'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck } from 'lucide-react';
import { DesktopHeader } from '../navigation/DesktopHeader';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { useLanguage } from '@/context/LanguageContext';

export function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-charcoal-950 text-charcoal-800 dark:text-charcoal-100 transition-colors">
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur border-b border-rose-100 dark:border-charcoal-800 px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-sm">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="font-bold text-base text-rose-700 dark:text-rose-400 tracking-tight">
            {t.common.appName}
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 md:py-8 pb-28 md:pb-12">
        {children}
      </main>

      {/* Medical & Local Privacy Footer */}
      <footer className="hidden md:block border-t border-rose-100 dark:border-charcoal-800 py-6 bg-white/60 dark:bg-charcoal-900/40 text-xs text-charcoal-500 dark:text-charcoal-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.common.localPrivacyBadge}</span>
          </div>
          <p className="text-center sm:text-right max-w-md">
            {t.common.disclaimerText}
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
