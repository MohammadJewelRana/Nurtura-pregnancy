'use client';

import React from 'react';
import Link from 'next/link';
import {
  WifiOff,
  Home,
  Baby,
  Calendar,
  Activity,
  BookOpen,
  CheckSquare,
  Sparkles,
  Settings,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function OfflineFallbackPage() {
  const { language } = useLanguage();

  const isBn = language === 'bn';

  const quickLinks = [
    { href: '/', label: isBn ? 'হোম ড্যাশবোর্ড' : 'Home Dashboard', icon: Home },
    { href: '/baby', label: isBn ? 'শিশুর বিকাশ (১–৪০ সপ্তাহ)' : 'Baby Development', icon: Baby },
    { href: '/calendar', label: isBn ? 'ক্যালেন্ডার' : 'Pregnancy Calendar', icon: Calendar },
    { href: '/calculator', label: isBn ? 'প্রসব তারিখ ক্যালকুলেটর' : 'Due Date Calculator', icon: Calculator },
    { href: '/tracking', label: isBn ? 'মুভমেন্ট ও ট্র্যাকিং' : 'Daily Tracking', icon: Activity },
    { href: '/journal', label: isBn ? 'ডায়েরি ও ছবি' : 'Journal & Memories', icon: BookOpen },
    { href: '/checklist', label: isBn ? 'চেকলিস্ট ও ব্যাগ' : 'Checklists', icon: CheckSquare },
    { href: '/names', label: isBn ? 'শিশুর নামসমূহ' : 'Baby Names', icon: Sparkles },
    { href: '/settings', label: isBn ? 'সেটিংস ও ব্যাকআপ' : 'Settings & Backup', icon: Settings },
  ];

  return (
    <div className="max-w-xl mx-auto py-8 text-center space-y-6">
      <div className="inline-flex p-4 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
        <WifiOff className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          {isBn ? 'আপনি বর্তমানে অফলাইনে আছেন' : 'You are currently offline'}
        </h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          {isBn
            ? 'চিন্তার কিছু নেই! নার্চুরা সম্পূর্ণভাবে আপনার ডিভাইসের লোকাল স্টোরেজে কাজ করে। নিচের যেকোনো ফিচারে সরাসরি প্রবেশ করুন:'
            : 'No problem! Nurtura operates locally on this device. All your saved dates, countdowns, trackers, and content remain accessible:'}
        </p>
      </div>

      {/* Privacy on-device reassurance */}
      <div className="p-3.5 rounded-2xl bg-navy-surface border border-navy-border inline-flex items-center space-x-2 text-xs text-emerald">
        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
        <span>{isBn ? 'আপনার ডেটা ডিভাইসেই নিরাপদ ও সংরক্ষিত আছে' : 'Your personal data is saved securely on this device'}</span>
      </div>

      {/* Quick offline navigation cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 rounded-2xl bg-navy-surface border border-navy-border hover:border-emerald/40 hover:bg-navy-elevated shadow-soft flex flex-col items-center justify-center space-y-2 transition duration-200"
            >
              <div className="p-2.5 rounded-xl bg-navy-elevated text-emerald">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-text-primary text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
