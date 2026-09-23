'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, Baby, Activity, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/calendar', label: t.nav.calendar, icon: Calendar },
    { href: '/baby', label: t.nav.baby, icon: Baby },
    { href: '/tracking', label: t.nav.track, icon: Activity },
    { href: '/more', label: t.nav.more, icon: Menu },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FCF9F6]/95 dark:bg-[#1C151F]/95 backdrop-blur-lg border-t border-[#EFE8DE] dark:border-[#2E2432] shadow-premium"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'text-plum-900 dark:text-plum-100 font-semibold'
                  : 'text-charcoal-500 dark:text-charcoal-400 hover:text-plum-800 dark:hover:text-plum-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavPill"
                  className="absolute inset-0 bg-plum-100/70 dark:bg-plum-900/40 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-plum-800 dark:text-dustyRose-400' : 'text-charcoal-400'
                }`}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
              <span className="text-[10px] leading-tight tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
