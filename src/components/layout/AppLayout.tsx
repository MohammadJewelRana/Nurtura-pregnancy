'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, Sparkles } from 'lucide-react';
import { DesktopHeader } from '../navigation/DesktopHeader';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { NurturaLogo } from '../common/NurturaLogo';
import { BrandedSplashScreen } from '../common/BrandedSplashScreen';
import { NetworkStatusBanner, NetworkBadge } from '../common/NetworkStatusIndicator';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';

export function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { isInitialized } = usePregnancy();

  return (
    <div className="min-h-screen flex flex-col bg-navy-bg text-text-primary transition-colors">
      {/* Branded Splash Screen with guaranteed 800ms auto-transition and safety fallback */}
      <BrandedSplashScreen />

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

            {/* Developer Contact Info */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] text-text-muted">
              <span>Developed by <strong className="text-text-secondary font-medium">Md. Jewel Rana</strong> — Software Engineer</span>
              <span className="text-navy-border hidden sm:inline">•</span>
              <div className="flex items-center space-x-3">
                <a
                  href="tel:01533850435"
                  className="inline-flex items-center space-x-1 text-text-secondary hover:text-emerald transition"
                  aria-label="Call Md. Jewel Rana"
                >
                  <Phone className="w-3 h-3 text-emerald" />
                  <span>01533850435</span>
                </a>
                <span className="text-navy-border">•</span>
                <a
                  href="mailto:js.rana0326@gmail.com"
                  className="inline-flex items-center space-x-1 text-text-secondary hover:text-emerald transition"
                  aria-label="Email Md. Jewel Rana"
                >
                  <Mail className="w-3 h-3 text-emerald" />
                  <span>js.rana0326@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Medical disclaimer note & copyright */}
          <div className="border-t border-navy-border/50 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-text-muted">
            <p className="max-w-xl text-center sm:text-left opacity-80 leading-relaxed">
              {t.common.disclaimerText}
            </p>
            <p className="flex-shrink-0 text-center sm:text-right opacity-80">
              © 2026 Nurtura. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
