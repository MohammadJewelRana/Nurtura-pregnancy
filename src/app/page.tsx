'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { usePregnancy } from '@/context/PregnancyContext';
import { useLanguage } from '@/context/LanguageContext';
import { PregnancySetupForm } from '@/components/pregnancy/PregnancySetupForm';
import { PregnancyHeroCard } from '@/components/dashboard/PregnancyHeroCard';
import { DueDateCountdownCard } from '@/components/dashboard/DueDateCountdownCard';
import { BabyDevelopmentPreviewCard } from '@/components/dashboard/BabyDevelopmentPreviewCard';
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions';
import { UpcomingAppointmentPreview } from '@/components/dashboard/UpcomingAppointmentPreview';
import { ParentJourneyHero } from '@/components/dashboard/ParentJourneyHero';
import { NurturaLogo } from '@/components/common/NurturaLogo';

export default function HomePage() {
  const { profile, calculation, isInitialized, refreshData } = usePregnancy();
  const { t, language } = useLanguage();
  const [showSetupForm, setShowSetupForm] = useState(false);

  // If user has not set pregnancy dates yet
  if (!calculation.isValid) {
    return (
      <div className="py-8 sm:py-16 max-w-xl mx-auto">
        {!showSetupForm ? (
          <div className="rounded-2xl bg-navy-surface border border-navy-border p-8 sm:p-12 text-center shadow-premium space-y-6">
            <div className="flex justify-center">
              <NurturaLogo size="xl" showWordmark={false} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {language === 'bn' ? 'আপনার মাতৃত্বের যাত্রা শুরু করুন' : 'Start Your Pregnancy Journey'}
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                {language === 'bn'
                  ? 'আপনার শেষ মাসিকের তারিখ (LMP) অথবা ডাক্তারের দেওয়া আল্ট্রাসাউন্ড ডেট যোগ করে আপনার দিনভিত্তিক ক্যালকুলেশন শুরু করুন।'
                  : 'Add your last menstrual period (LMP) or doctor/ultrasound due date to personalize your daily experience.'}
              </p>
            </div>

            <button
              onClick={() => setShowSetupForm(true)}
              className="py-3 px-7 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg font-bold text-sm shadow-glow-emerald inline-flex items-center space-x-2 transition transform active:scale-[0.99]"
            >
              <span>{t.setup.setupButton}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="pt-2 flex items-center justify-center space-x-1.5 text-[11px] text-text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
              <span>{t.common.localPrivacyBadge}</span>
            </div>
          </div>
        ) : (
          <PregnancySetupForm onCompleted={refreshData} />
        )}
      </div>
    );
  }

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.goodMorning;
    if (hour < 17) return t.dashboard.goodAfternoon;
    return t.dashboard.goodEvening;
  };

  const momName = profile?.name ? profile.name : '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Top Greeting / Brand Header */}
      <div className="px-1 flex flex-col sm:flex-row sm:items-end justify-between gap-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            {getGreeting()}{momName ? `, ${momName}` : ''}
          </h2>
          <p className="text-xs text-text-muted mt-0.5 font-normal">
            {language === 'bn'
              ? 'এক নজরে আপনার মাতৃত্বের সুন্দর মুহূর্ত ও অগ্রগতি।'
              : 'Your pregnancy journey at a glance.'}
          </p>
        </div>
      </div>

      {/* 2 & 3 & 4. Row 1: Hero Gestational Age Card + Prominent Due Date Countdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        <PregnancyHeroCard />
        <DueDateCountdownCard />
      </div>

      {/* 5 & 7. Row 2: Baby This Week + Next Appointment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
        <BabyDevelopmentPreviewCard />
        <UpcomingAppointmentPreview />
      </div>

      {/* 6. Row 3: Compact 2x2 Quick Actions */}
      <div className="pt-1">
        <DashboardQuickActions />
      </div>

      {/* 5. Parent / Family Visual Touch (renders only when parent photos exist) */}
      <ParentJourneyHero />

      {/* 8. Row 4: Discreet Useful Pregnancy Information / Reassurance */}
      <div className="rounded-2xl bg-navy-surface border border-navy-border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>{language === 'bn' ? 'শান্ত থাকুন, নিরাপদে থাকুন' : 'Calm & Mindful Wellness'}</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
            {language === 'bn'
              ? 'গর্ভকালীন সময়ে পর্যাপ্ত বিশ্রাম ও প্রচুর পানি পান করুন। কোনো অস্বাভাবিক লক্ষণ বা শিশুর নড়াচড়া কম অনুভূত হলে অবিলম্বে আপনার চিকিৎসকের পরামর্শ নিন।'
              : 'Remember to stay hydrated and take gentle rests throughout your day. If you notice any unusual changes or decreased fetal movement, consult your healthcare provider.'}
          </p>
        </div>

        <Link
          href="/faq"
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-navy-elevated border border-navy-border text-xs font-semibold text-text-secondary hover:text-emerald hover:border-emerald/40 transition whitespace-nowrap"
        >
          {language === 'bn' ? 'প্রশ্নোত্তর জানুন →' : 'Read FAQs →'}
        </Link>
      </div>
    </div>
  );
}
