'use client';

import React from 'react';
import { Stethoscope, Calendar, CheckCircle2, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';

export function DoctorDateComparisonCard() {
  const { t, formatDate, formatNumber, language } = useLanguage();
  const { calculation } = usePregnancy();

  if (!calculation.isValid) return null;
  const { doctorEdd, calculatedEdd, primaryEdd, datesDiffer, isUsingDoctorEdd } = calculation;

  // Show if both dates exist or if doctorEdd is provided
  if (!doctorEdd && !calculatedEdd) return null;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-2 rounded-xl bg-sage-50 dark:bg-charcoal-800 text-sage-600 dark:text-sage-400">
          <Stethoscope className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100">
          {language === 'bn' ? 'প্রসবের সম্ভাব্য তারিখ বিশ্লেষণ' : 'Due Date Calculation Analysis'}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Doctor/Ultrasound EDD */}
        <div className={`p-3 rounded-2xl border transition-all ${
          doctorEdd
            ? 'bg-sage-50/50 dark:bg-sage-950/20 border-sage-200 dark:border-sage-800/50'
            : 'bg-charcoal-50 dark:bg-charcoal-800/40 border-dashed border-charcoal-200 dark:border-charcoal-700 opacity-60'
        }`}>
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-400 mb-1">
            <span>{t.dashboard.doctorEdd}</span>
            {isUsingDoctorEdd && <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />}
          </div>
          <div className="text-sm font-bold text-charcoal-900 dark:text-white">
            {doctorEdd ? formatDate(doctorEdd) : (language === 'bn' ? 'প্রদান করা হয়নি' : 'Not entered')}
          </div>
        </div>

        {/* Calculated EDD from LMP */}
        <div className={`p-3 rounded-2xl border transition-all ${
          calculatedEdd
            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
            : 'bg-charcoal-50 dark:bg-charcoal-800/40 border-dashed border-charcoal-200 dark:border-charcoal-700 opacity-60'
        }`}>
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-400 mb-1">
            <span>{t.dashboard.calculatedEdd}</span>
            {!isUsingDoctorEdd && calculatedEdd && (
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            )}
          </div>
          <div className="text-sm font-bold text-charcoal-900 dark:text-white">
            {calculatedEdd ? formatDate(calculatedEdd) : (language === 'bn' ? 'LMP অজানা' : 'LMP unknown')}
          </div>
        </div>

        {/* Primary Due Date */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 font-semibold mb-1">
            <span>{t.dashboard.primaryEdd}</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-extrabold text-rose-700 dark:text-rose-300">
            {formatDate(primaryEdd)}
          </div>
        </div>
      </div>

      {/* Explanatory note */}
      {isUsingDoctorEdd ? (
        <div className="mt-3 flex items-start space-x-2 text-[11px] text-sage-700 dark:text-sage-300 bg-sage-50/60 dark:bg-sage-950/30 p-2.5 rounded-xl border border-sage-200 dark:border-sage-800/40">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-sage-600 dark:text-sage-400" />
          <div>
            <p className="font-medium">{t.dashboard.doctorDateUsedNotice}</p>
            {datesDiffer && (
              <p className="text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                {language === 'bn'
                  ? `ডাক্তারের তারিখটি LMP গণনার চেয়ে ${formatNumber(Math.abs(calculation.dateDifferenceDays))} দিন তফাতে রয়েছে।`
                  : `Doctor's scan date differs by ${formatNumber(Math.abs(calculation.dateDifferenceDays))} days from the 280-day LMP calculation.`}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center space-x-2 text-[11px] text-charcoal-500 dark:text-charcoal-400 bg-rose-50/40 dark:bg-charcoal-800/40 p-2.5 rounded-xl">
          <Info className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>
            {language === 'bn'
              ? 'LMP থেকে ২৮০ দিন যোগ করে সম্ভাব্য তারিখ হিসাব করা হয়েছে। ডাক্তার বা আল্ট্রাসাউন্ডের তারিখ পেলে তা সেটিংসে যোগ করতে পারেন।'
              : 'Calculated using standard 280-day baseline from your LMP. You can add a doctor/ultrasound date anytime in Settings.'}
          </span>
        </div>
      )}
    </div>
  );
}
