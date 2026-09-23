'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, Baby, Activity, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/calendar', label: t.nav.calendar, icon: Calendar },
    { href: '/baby', label: t.nav.baby, icon: Baby },
    { href: '/tracking', label: t.nav.track, icon: Activity },
    { href: '/more', label: t.nav.more, icon: MoreHorizontal },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-bg/95 backdrop-blur-lg border-t border-navy-border shadow-elevated"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-colors duration-200 select-none ${
                isActive
                  ? 'text-emerald font-semibold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavEmeraldIndicator"
                  className="absolute inset-0 bg-navy-elevated/80 border border-navy-border/60 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-emerald drop-shadow-[0_0_8px_rgba(0,201,154,0.4)]' : 'text-text-muted'
                }`}
                strokeWidth={isActive ? 2.4 : 1.9}
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
