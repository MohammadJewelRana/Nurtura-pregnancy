'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckSquare,
  Luggage,
  CalendarDays,
  Sparkles,
  HelpCircle,
  Settings,
  ChevronRight,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { NetworkBadge } from '../common/NetworkStatusIndicator';

export function MoreNavHub() {
  const { t, language } = useLanguage();

  const links = [
    {
      href: '/calculator',
      label: language === 'bn' ? 'প্রসব তারিখ ক্যালকুলেটর' : 'Due Date Calculator',
      desc: language === 'bn' ? 'LMP ও আল্ট্রাসাউন্ড হিসাব বিশ্লেষণ' : 'LMP & Ultrasound EDD analysis',
      icon: Calculator,
      iconColor: 'text-emerald',
    },
    {
      href: '/journal',
      label: t.nav.journal,
      desc: t.journal.subtitle,
      icon: BookOpen,
      iconColor: 'text-emerald-accent',
    },
    {
      href: '/appointments',
      label: t.nav.appointments,
      desc: t.appointments.subtitle,
      icon: CalendarDays,
      iconColor: 'text-emerald-soft',
    },
    {
      href: '/checklist',
      label: t.nav.checklists,
      desc: t.checklists.subtitle,
      icon: CheckSquare,
      iconColor: 'text-emerald',
    },
    {
      href: '/hospital-bag',
      label: t.checklists.tabHospital,
      desc: language === 'bn' ? 'হাসপাতালের জন্য প্রয়োজনীয় জিনিসপত্রের তালিকা' : 'Complete hospital delivery bag packing list',
      icon: Luggage,
      iconColor: 'text-emerald-accent',
    },
    {
      href: '/names',
      label: t.nav.names,
      desc: t.names.subtitle,
      icon: Sparkles,
      iconColor: 'text-state-warning',
    },
    {
      href: '/faq',
      label: t.nav.faq,
      desc: t.faq.subtitle,
      icon: HelpCircle,
      iconColor: 'text-text-secondary',
    },
    {
      href: '/settings',
      label: t.nav.settings,
      desc: t.settings.subtitle,
      icon: Settings,
      iconColor: 'text-text-muted',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {t.nav.more}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {language === 'bn'
              ? 'আপনার গর্ভকালীন সকল প্রয়োজনীয় ফিচার ও সেটিংস।'
              : 'Explore all tools and features of your pregnancy companion.'}
          </p>
        </div>
        <NetworkBadge showText={true} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 sm:p-5 rounded-2xl bg-navy-surface border border-navy-border shadow-subtle hover:bg-navy-elevated hover:border-emerald/40 flex items-center justify-between group transition-all duration-200"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2.5 rounded-xl bg-navy-elevated border border-navy-border ${item.iconColor} group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-emerald transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-1 max-w-[220px] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-emerald transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>

      {/* Safety Badge */}
      <div className="p-4 rounded-xl bg-navy-surface border border-navy-border flex items-center space-x-3 text-xs text-text-secondary">
        <ShieldCheck className="w-4 h-4 text-emerald flex-shrink-0" />
        <p>{t.common.localPrivacySub}</p>
      </div>
    </div>
  );
}
