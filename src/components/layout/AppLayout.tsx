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
    <div className="min-h-screen flex flex-col bg-[#FCF9F6] dark:bg-[#17121A] text-charcoal-800 dark:text-charcoal-100 transition-colors">
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-[#FCF9F6]/95 dark:bg-[#1C151F]/95 backdrop-blur-md border-b border-[#EFE8DE] dark:border-[#2E2432] px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-plum-800 to-dustyRose-500 flex items-center justify-center text-white shadow-subtle">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="font-bold text-base text-plum-900 dark:text-plum-100 tracking-tight">
              {t.common.appName}
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-32 md:pb-16">
        {children}
      </main>

      {/* Medical & Local Privacy Footer */}
      <footer className="hidden md:block border-t border-[#EFE8DE] dark:border-[#2E2432] py-6 bg-white/40 dark:bg-charcoal-900/30 text-xs text-charcoal-500 dark:text-charcoal-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-sage-600 dark:text-sage-400" />
            <span className="font-medium text-charcoal-700 dark:text-charcoal-300">
              {t.common.localPrivacyBadge}
            </span>
          </div>
          <p className="text-center sm:text-right max-w-xl text-[11px] leading-relaxed opacity-85">
            {t.common.disclaimerText}
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
