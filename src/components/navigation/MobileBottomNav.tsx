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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border-t border-rose-100 dark:border-charcoal-800 shadow-soft"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-medium'
                  : 'text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-800 dark:hover:text-charcoal-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavPill"
                  className="absolute inset-0 bg-rose-50 dark:bg-rose-950/40 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] leading-tight tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
