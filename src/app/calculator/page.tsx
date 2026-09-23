'use client';

import React from 'react';
import { Calculator, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PregnancySetupForm } from '@/components/pregnancy/PregnancySetupForm';
import { DoctorDateComparisonCard } from '@/components/dashboard/DoctorDateComparisonCard';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';

export default function CalculatorPage() {
  const { t, language } = useLanguage();
  const { calculation } = usePregnancy();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight flex items-center space-x-2">
            <Calculator className="w-7 h-7 text-emerald" />
            <span>{language === 'bn' ? 'গর্ভকালীন ক্যালকুলেটর' : 'Pregnancy Due Date Calculator'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {language === 'bn'
              ? 'LMP অথবা ডাক্তারের আল্ট্রাসাউন্ড তারিখ দিয়ে নির্ভুল হিসাব ও কাউন্টডাউন পান।'
              : 'Calculate your exact gestational age, due date, and countdown using LMP or Doctor scan.'}
          </p>
        </div>

        <Link
          href="/"
          className="px-3 py-1.5 rounded-xl border border-navy-border bg-navy-surface text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.common.back}</span>
        </Link>
      </div>

      {/* Calculator Setup Form */}
      <div className="rounded-2xl overflow-hidden border border-navy-border bg-navy-surface p-6 shadow-soft">
        <PregnancySetupForm />
      </div>

      {/* Date Analysis Comparison if calculation valid */}
      {calculation.isValid && <DoctorDateComparisonCard />}
    </div>
  );
}
