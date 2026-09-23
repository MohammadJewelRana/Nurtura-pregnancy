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
    <div className="p-4 sm:p-5 rounded-2xl bg-navy-surface border border-navy-border shadow-soft">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-2 rounded-xl bg-emerald/15 text-emerald">
          <Stethoscope className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-text-primary">
          {language === 'bn' ? 'প্রসবের সম্ভাব্য তারিখ বিশ্লেষণ' : 'Due Date Calculation Analysis'}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Doctor/Ultrasound EDD */}
        <div className={`p-3 rounded-xl border transition-all ${
          doctorEdd
            ? 'bg-emerald/10 border-emerald/30 text-text-primary'
            : 'bg-navy-elevated border-dashed border-navy-border opacity-60 text-text-muted'
        }`}>
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span>{t.dashboard.doctorEdd}</span>
            {isUsingDoctorEdd && <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />}
          </div>
          <div className="text-sm font-bold text-text-primary">
            {doctorEdd ? formatDate(doctorEdd) : (language === 'bn' ? 'প্রদান করা হয়নি' : 'Not entered')}
          </div>
        </div>

        {/* Calculated EDD from LMP */}
        <div className={`p-3 rounded-xl border transition-all ${
          calculatedEdd
            ? 'bg-navy-elevated border-navy-border text-text-primary'
            : 'bg-navy-elevated border-dashed border-navy-border opacity-60 text-text-muted'
        }`}>
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span>{t.dashboard.calculatedEdd}</span>
            {!isUsingDoctorEdd && calculatedEdd && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
            )}
          </div>
          <div className="text-sm font-bold text-text-primary">
            {calculatedEdd ? formatDate(calculatedEdd) : (language === 'bn' ? 'LMP অজানা' : 'LMP unknown')}
          </div>
        </div>

        {/* Primary Due Date */}
        <div className="p-3 rounded-xl bg-emerald/15 border border-emerald/50">
          <div className="flex items-center justify-between text-emerald font-semibold mb-1">
            <span>{t.dashboard.primaryEdd}</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-extrabold text-emerald-light">
            {formatDate(primaryEdd)}
          </div>
        </div>
      </div>

      {/* Explanatory note */}
      {isUsingDoctorEdd ? (
        <div className="mt-3 flex items-start space-x-2 text-[11px] text-text-secondary bg-navy-elevated p-2.5 rounded-xl border border-emerald/30">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald" />
          <div>
            <p className="font-medium text-emerald">{t.dashboard.doctorDateUsedNotice}</p>
            {datesDiffer && (
              <p className="text-text-muted mt-0.5">
                {language === 'bn'
                  ? `ডাক্তারের তারিখটি LMP গণনার চেয়ে ${formatNumber(Math.abs(calculation.dateDifferenceDays))} দিন তফাতে রয়েছে।`
                  : `Doctor's scan date differs by ${formatNumber(Math.abs(calculation.dateDifferenceDays))} days from the 280-day LMP calculation.`}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center space-x-2 text-[11px] text-text-secondary bg-navy-elevated p-2.5 rounded-xl border border-navy-border">
          <Info className="w-4 h-4 flex-shrink-0 text-emerald" />
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
