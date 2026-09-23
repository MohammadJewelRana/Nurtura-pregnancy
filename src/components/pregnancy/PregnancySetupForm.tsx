'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, Stethoscope, Sparkles, AlertCircle, Info, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { PregnancyProfile } from '@/types/pregnancy';
import { calculatePregnancy } from '@/lib/pregnancy/pregnancy-calculator';
import { getTodayDate, toDateString, parseLocalDate } from '@/lib/date/date-utils';

interface SetupFormProps {
  onCompleted?: () => void;
  isModal?: boolean;
}

export function PregnancySetupForm({ onCompleted, isModal = false }: SetupFormProps) {
  const { t, language, formatDate, formatNumber } = useLanguage();
  const { profile, updateProfile } = usePregnancy();

  const [motherName, setMotherName] = useState(profile?.name || '');
  const [lmpDate, setLmpDate] = useState(profile?.lmpDate || '');
  const [doctorEdd, setDoctorEdd] = useState(profile?.doctorEdd || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const todayStr = toDateString(getTodayDate());

  // Live preview calculation as user inputs dates
  const liveCalc = useMemo(() => {
    if (!lmpDate && !doctorEdd) return null;
    const tempProfile: PregnancyProfile = {
      id: 'temp',
      name: motherName,
      lmpDate: lmpDate || undefined,
      doctorEdd: doctorEdd || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const res = calculatePregnancy(tempProfile);
    return res.isValid ? res : null;
  }, [lmpDate, doctorEdd, motherName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!lmpDate && !doctorEdd) {
      setErrorMsg(t.setup.errorRequired);
      return;
    }

    if (lmpDate) {
      const parsedLmp = parseLocalDate(lmpDate);
      if (parsedLmp && parsedLmp > getTodayDate()) {
        setErrorMsg(t.setup.errorFutureLmp);
        return;
      }
    }

    const newProfile: PregnancyProfile = {
      id: profile?.id || `profile_${Date.now()}`,
      name: motherName.trim() || undefined,
      lmpDate: lmpDate || undefined,
      doctorEdd: doctorEdd || undefined,
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateProfile(newProfile);
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <div className={`w-full max-w-xl mx-auto ${isModal ? '' : 'p-6 sm:p-8 bg-white dark:bg-charcoal-900 rounded-3xl shadow-soft border border-rose-100 dark:border-charcoal-800'}`}>
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 mb-3">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">
          {profile ? t.setup.updateJourney : t.setup.welcomeTitle}
        </h2>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mt-1 max-w-md mx-auto">
          {t.setup.welcomeSubtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center space-x-2 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mother Name (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 uppercase tracking-wider mb-1.5">
            {t.setup.motherNameLabel}
          </label>
          <input
            type="text"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
            placeholder={t.setup.motherNamePlaceholder}
            className="w-full px-4 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
          />
        </div>

        {/* LMP Field */}
        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-charcoal-800/60 border border-rose-100 dark:border-charcoal-700">
          <div className="flex items-center space-x-2 mb-1.5">
            <Calendar className="w-4 h-4 text-rose-500" />
            <label className="text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
              {t.setup.lmpLabel}
            </label>
          </div>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mb-2">
            {t.setup.lmpHelp}
          </p>
          <input
            type="date"
            max={todayStr}
            value={lmpDate}
            onChange={(e) => setLmpDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-rose-100 dark:border-charcoal-700"></div>
          <span className="flex-shrink mx-4 text-xs font-medium text-charcoal-400 uppercase tracking-wider">
            {language === 'bn' ? 'অথবা / এবং' : 'OR / AND'}
          </span>
          <div className="flex-grow border-t border-rose-100 dark:border-charcoal-700"></div>
        </div>

        {/* Doctor / Ultrasound EDD Field */}
        <div className="p-4 rounded-2xl bg-sage-50/60 dark:bg-charcoal-800/60 border border-sage-200 dark:border-charcoal-700">
          <div className="flex items-center space-x-2 mb-1.5">
            <Stethoscope className="w-4 h-4 text-sage-600 dark:text-sage-400" />
            <label className="text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
              {t.setup.doctorEddLabel}
            </label>
          </div>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mb-2">
            {t.setup.doctorEddHelp}
          </p>
          <input
            type="date"
            value={doctorEdd}
            onChange={(e) => setDoctorEdd(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-sage-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
          <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-sage-700 dark:text-sage-300 font-medium">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{t.setup.doctorEddPriorityNote}</span>
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        {liveCalc && (
          <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide">
              <span>{language === 'bn' ? 'লাইভ হিসাব ও পর্যালোচনা' : 'Live Calculation Preview'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" /> {language === 'bn' ? 'সঠিক' : 'Valid'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-white/80 dark:bg-charcoal-800/80 p-2.5 rounded-xl">
                <span className="text-charcoal-500 block mb-0.5">{t.dashboard.currentStage}</span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  {formatNumber(liveCalc.currentWeek)} {t.common.weeks} {formatNumber(liveCalc.currentDay)} {t.common.days}
                </span>
              </div>
              <div className="bg-white/80 dark:bg-charcoal-800/80 p-2.5 rounded-xl">
                <span className="text-charcoal-500 block mb-0.5">{t.dashboard.primaryEdd}</span>
                <span className="text-sm font-bold text-charcoal-900 dark:text-white">
                  {formatDate(liveCalc.primaryEdd)}
                </span>
              </div>
            </div>

            {/* Distinction between Doctor and Calculated EDD */}
            {liveCalc.doctorEdd && liveCalc.calculatedEdd && (
              <div className="text-xs bg-white/90 dark:bg-charcoal-800/90 p-3 rounded-xl border border-rose-100 dark:border-charcoal-700 space-y-1.5">
                <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300">
                  <span>{t.dashboard.doctorEdd}:</span>
                  <span className="font-semibold text-charcoal-900 dark:text-white">
                    {formatDate(liveCalc.doctorEdd)}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300">
                  <span>{t.dashboard.calculatedEdd}:</span>
                  <span className="font-semibold text-charcoal-900 dark:text-white">
                    {formatDate(liveCalc.calculatedEdd)}
                  </span>
                </div>
                <div className="text-[11px] text-sage-700 dark:text-sage-300 pt-1 border-t border-charcoal-100 dark:border-charcoal-700 font-medium">
                  {t.dashboard.doctorDateUsedNotice}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold shadow-soft hover:shadow-soft-lg flex items-center justify-center space-x-2 transition transform active:scale-[0.99]"
        >
          <span>{profile ? t.setup.updateJourney : t.setup.startJourney}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
