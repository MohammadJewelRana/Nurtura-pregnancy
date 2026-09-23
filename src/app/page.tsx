'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { usePregnancy } from '@/context/PregnancyContext';
import { useLanguage } from '@/context/LanguageContext';
import { PregnancySetupForm } from '@/components/pregnancy/PregnancySetupForm';
import { PregnancyHeroCard } from '@/components/dashboard/PregnancyHeroCard';
import { DueDateCountdownCard } from '@/components/dashboard/DueDateCountdownCard';
import { BabyDevelopmentPreviewCard } from '@/components/dashboard/BabyDevelopmentPreviewCard';
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions';
import { UpcomingAppointmentPreview } from '@/components/dashboard/UpcomingAppointmentPreview';

export default function HomePage() {
  const { profile, calculation, isInitialized, refreshData } = usePregnancy();
  const { t, language } = useLanguage();
  const [showSetupForm, setShowSetupForm] = useState(false);

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-3">
        <div className="w-8 h-8 border-3 border-plum-200 border-t-plum-700 rounded-full animate-spin" />
        <p className="text-xs text-charcoal-400 font-medium">{t.common.loading}</p>
      </div>
    );
  }

  // If user has not set pregnancy dates yet
  if (!calculation.isValid) {
    return (
      <div className="py-8 sm:py-16 max-w-xl mx-auto">
        {!showSetupForm ? (
          <div className="rounded-3xl bg-white dark:bg-[#1E1722] border border-[#EFE8DE] dark:border-[#332537] p-8 sm:p-12 text-center shadow-premium space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-plum-800 to-dustyRose-500 text-white flex items-center justify-center mx-auto shadow-subtle">
              <Heart className="w-8 h-8 fill-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-plum-950 dark:text-white">
                {t.setup.setupPromptTitle}
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 max-w-sm mx-auto leading-relaxed">
                {t.setup.setupPromptSubtitle}
              </p>
            </div>

            <button
              onClick={() => setShowSetupForm(true)}
              className="py-3.5 px-8 rounded-2xl bg-plum-700 hover:bg-plum-800 text-white font-semibold text-sm shadow-premium inline-flex items-center space-x-2 transition transform active:scale-[0.99]"
            >
              <span>{t.setup.setupButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
    <div className="space-y-6 sm:space-y-8">
      {/* Top Greeting Header */}
      <div className="px-1 flex flex-col sm:flex-row sm:items-end justify-between gap-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-plum-950 dark:text-white">
            {getGreeting()}{momName ? `, ${momName}` : ''}
          </h2>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5 font-normal">
            {t.dashboard.tagline}
          </p>
        </div>
      </div>

      {/* Row 1: Hero Card + Countdown Card (2 columns on Desktop, vertical on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        <PregnancyHeroCard />
        <DueDateCountdownCard />
      </div>

      {/* Row 2: Baby This Week + Next Appointment (2 columns on Desktop, vertical on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
        <BabyDevelopmentPreviewCard />
        <UpcomingAppointmentPreview />
      </div>

      {/* Row 3: Compact Quick Actions */}
      <div className="pt-1">
        <DashboardQuickActions />
      </div>
    </div>
  );
}
