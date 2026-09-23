'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { DesktopHeader } from '../navigation/DesktopHeader';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { NurturaLogo } from '../common/NurturaLogo';
import { BrandedSplashScreen } from '../common/BrandedSplashScreen';
import { NetworkStatusBanner, NetworkBadge } from '../common/NetworkStatusIndicator';
import { useLanguage } from '@/context/LanguageContext';
import { runStorageMigration } from '@/lib/storage/local-storage';

export function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);

  // Background local migration: completely decoupled from splash visibility
  useEffect(() => {
    try {
      runStorageMigration();
    } catch (err) {
      console.warn('[Nurtura] Migration error:', err);
    }
  }, []);

  // Single authoritative 800ms timer for splash screen
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <BrandedSplashScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-bg text-text-primary transition-colors">
      {/* Network Offline / Back Online Toast Banner */}
      <NetworkStatusBanner />

      {/* Desktop Header with Primary Navigation Only */}
      <DesktopHeader />

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-navy-bg/95 backdrop-blur-md border-b border-navy-border px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <NurturaLogo size="sm" showWordmark={true} />
          </Link>
          <NetworkBadge />
        </div>
        <div className="flex items-center space-x-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-32 md:pb-16">
        {children}
      </main>

      {/* Professional Footer (Desktop & Mobile with bottom-nav clearance) */}
      <footer className="border-t border-navy-border/80 bg-navy-secondary/60 text-xs text-text-muted pb-24 md:pb-8 pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand & Privacy Badge */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <NurturaLogo size="sm" showWordmark={true} />
              <span className="hidden sm:inline text-navy-border">•</span>
              <div className="flex items-center space-x-1.5 text-text-secondary">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
                <span>{t.common.localPrivacyBadge}</span>
              </div>
            </div>

            {/* Quick Links & Emergency Note */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-text-secondary">
              <Link href="/faq" className="hover:text-emerald transition">
                {t.nav.faq}
              </Link>
              <Link href="/checklist" className="hover:text-emerald transition">
                {t.nav.checklists}
              </Link>
              <Link href="/hospital-bag" className="hover:text-emerald transition">
                {t.nav.hospitalBag}
              </Link>
              <Link href="/names" className="hover:text-emerald transition">
                {t.nav.names}
              </Link>
              <Link href="/settings" className="hover:text-emerald transition">
                {t.nav.settings}
              </Link>
            </div>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="pt-4 border-t border-navy-border/50 text-[11px] text-text-muted leading-relaxed text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="max-w-3xl">
              {t.common.disclaimerText}
            </p>
            <span className="text-[10px] text-text-muted/60 whitespace-nowrap">
              © {new Date().getFullYear()} Nurtura. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}
