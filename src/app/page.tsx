'use client';

import React from 'react';
import { usePregnancy } from '@/context/PregnancyContext';
import { useLanguage } from '@/context/LanguageContext';
import { PregnancySetupForm } from '@/components/pregnancy/PregnancySetupForm';
import { PregnancyHeroCard } from '@/components/dashboard/PregnancyHeroCard';
import { DoctorDateComparisonCard } from '@/components/dashboard/DoctorDateComparisonCard';
import { BabyDevelopmentPreviewCard } from '@/components/dashboard/BabyDevelopmentPreviewCard';
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions';
import { UpcomingAppointmentPreview } from '@/components/dashboard/UpcomingAppointmentPreview';

export default function HomePage() {
  const { calculation, isInitialized, refreshData } = usePregnancy();
  const { t } = useLanguage();

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-3">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        <p className="text-xs text-charcoal-400 font-medium">{t.common.loading}</p>
      </div>
    );
  }

  // If user has not set pregnancy dates yet, show Setup Flow!
  if (!calculation.isValid) {
    return (
      <div className="py-6 sm:py-10">
        <PregnancySetupForm onCompleted={refreshData} />
      </div>
    );
  }

  // Dashboard for configured pregnancy
  return (
    <div className="space-y-6">
      {/* Hero Gestational Age Card */}
      <PregnancyHeroCard />

      {/* Doctor EDD vs Calculated EDD Comparison Card */}
      <DoctorDateComparisonCard />

      {/* Quick Actions (Water, Kicks, Weight, Mood, Journal) */}
      <DashboardQuickActions />

      {/* Current Week Baby Development Preview */}
      <BabyDevelopmentPreviewCard />

      {/* Upcoming Appointment */}
      <UpcomingAppointmentPreview />
    </div>
  );
}
