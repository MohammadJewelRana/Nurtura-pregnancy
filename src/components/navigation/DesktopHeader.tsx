'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Baby,
  Activity,
  MoreHorizontal,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Luggage,
  Sparkles,
  HelpCircle,
  Settings,
  ChevronDown,
  Calculator,
  Scale,
  Cake,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { NurturaLogo } from '../common/NurturaLogo';
import { NetworkBadge } from '../common/NetworkStatusIndicator';

export function DesktopHeader() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary 5 Top-Level Navigation Items
  const primaryNav = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/calendar', label: t.nav.calendar, icon: Calendar },
    { href: '/baby', label: t.nav.baby, icon: Baby },
    { href: '/tracking', label: t.nav.track, icon: Activity },
  ];

  // Secondary items nested inside "More"
  const secondaryNav = [
    { href: '/calculator', label: t.nav.setup, icon: Calculator },
    { href: '/bmi', label: t.nav.bmiCalculator, icon: Scale },
    { href: '/age', label: t.nav.ageCalculator, icon: Cake },
    { href: '/journal', label: t.nav.journal, icon: BookOpen },
    { href: '/appointments', label: t.nav.appointments, icon: CalendarDays },
    { href: '/checklist', label: t.nav.checklists, icon: CheckSquare },
    { href: '/hospital-bag', label: t.checklists.tabHospital, icon: Luggage },
    { href: '/names', label: t.nav.names, icon: Sparkles },
    { href: '/faq', label: t.nav.faq, icon: HelpCircle },
    { href: '/settings', label: t.nav.settings, icon: Settings },
  ];

  const isMoreActive =
    pathname === '/more' ||
    secondaryNav.some((item) => pathname === item.href.split('?')[0]);

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-navy-bg/95 backdrop-blur-md border-b border-navy-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo and Wordmark */}
          <Link href="/" className="flex items-center group">
            <NurturaLogo size="md" showWordmark={true} />
          </Link>

          {/* Primary Navigation Links (Fewer items, high hierarchy) */}
          <nav className="flex items-center space-x-1.5 text-xs lg:text-sm font-medium">
            {primaryNav.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-navy-elevated text-emerald border border-navy-border shadow-subtle font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-navy-surface/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald' : 'text-text-muted'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* "More" Menu Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  isMoreActive
                    ? 'bg-navy-elevated text-emerald border border-navy-border shadow-subtle font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-navy-surface/80'
                }`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                <MoreHorizontal
                  className={`w-4 h-4 ${
                    isMoreActive ? 'text-emerald' : 'text-text-muted'
                  }`}
                />
                <span>{t.nav.more}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                    moreOpen ? 'rotate-180 text-emerald' : ''
                  }`}
                />
              </button>

              {/* Polished Dropdown Popover */}
              {moreOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-navy-surface border border-navy-border shadow-elevated p-2 space-y-1 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    {t.nav.more} Features
                  </div>
                  {secondaryNav.map((sub) => {
                    const isSubActive = pathname === sub.href.split('?')[0];
                    const SubIcon = sub.icon;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition ${
                          isSubActive
                            ? 'bg-navy-elevated text-emerald font-semibold border border-navy-border/60'
                            : 'text-text-secondary hover:text-text-primary hover:bg-navy-elevated/70'
                        }`}
                      >
                        <SubIcon
                          className={`w-4 h-4 ${
                            isSubActive ? 'text-emerald' : 'text-text-muted'
                          }`}
                        />
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Controls: Network Badge, Language & Theme */}
          <div className="flex items-center space-x-2.5">
            <NetworkBadge showText={true} />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
