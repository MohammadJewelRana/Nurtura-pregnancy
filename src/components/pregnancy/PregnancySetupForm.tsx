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

  // Mode: 'edd' | 'lmp' | 'both'
  const initialMode = profile?.doctorEdd && profile?.lmpDate
    ? 'both'
    : profile?.doctorEdd
    ? 'edd'
    : 'lmp';

  const [inputMode, setInputMode] = useState<'edd' | 'lmp' | 'both'>(initialMode);
  const [motherName, setMotherName] = useState(profile?.name || '');
  const [lmpDate, setLmpDate] = useState(profile?.lmpDate || '');
  const [doctorEdd, setDoctorEdd] = useState(profile?.doctorEdd || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const todayStr = toDateString(getTodayDate());

  // Active dates based on mode
  const effectiveLmp = inputMode === 'edd' ? '' : lmpDate;
  const effectiveDoctorEdd = inputMode === 'lmp' ? '' : doctorEdd;

  // Live preview calculation as user inputs dates
  const liveCalc = useMemo(() => {
    if (!effectiveLmp && !effectiveDoctorEdd) return null;
    const tempProfile: PregnancyProfile = {
      id: 'temp',
      name: motherName,
      lmpDate: effectiveLmp || undefined,
      doctorEdd: effectiveDoctorEdd || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const res = calculatePregnancy(tempProfile);
    return res.isValid ? res : null;
  }, [effectiveLmp, effectiveDoctorEdd, motherName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!effectiveLmp && !effectiveDoctorEdd) {
      setErrorMsg(t.setup.errorRequired);
      return;
    }

    if (effectiveLmp) {
      const parsedLmp = parseLocalDate(effectiveLmp);
      if (parsedLmp && parsedLmp > getTodayDate()) {
        setErrorMsg(t.setup.errorFutureLmp);
        return;
      }
    }

    const newProfile: PregnancyProfile = {
      id: profile?.id || `profile_${Date.now()}`,
      name: motherName.trim() || undefined,
      lmpDate: effectiveLmp || undefined,
      doctorEdd: effectiveDoctorEdd || undefined,
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateProfile(newProfile);
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <div className={`w-full max-w-xl mx-auto ${isModal ? '' : 'p-6 sm:p-9 bg-white dark:bg-[#1E1722] rounded-3xl shadow-premium border border-[#EFE8DE] dark:border-[#332537]'}`}>
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-plum-50 dark:bg-plum-950/50 text-plum-700 dark:text-dustyRose-400 mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-plum-950 dark:text-white">
          {profile ? t.setup.updateJourney : t.setup.welcomeTitle}
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1 max-w-md mx-auto leading-relaxed">
          {t.setup.welcomeSubtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center space-x-2 text-red-700 dark:text-red-300 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: "Do you know your due date?" Selector */}
      <div className="mb-6 space-y-2">
        <label className="block text-xs font-bold text-charcoal-700 dark:text-charcoal-300 uppercase tracking-wider text-center">
          {t.setup.step1Question}
        </label>
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-ivory-100 dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-800 text-xs">
          <button
            type="button"
            onClick={() => setInputMode('edd')}
            className={`py-2 px-2 rounded-xl font-semibold transition ${
              inputMode === 'edd'
                ? 'bg-plum-700 text-white shadow-subtle'
                : 'text-charcoal-600 dark:text-charcoal-400 hover:text-plum-800'
            }`}
          >
            {t.setup.step1Yes}
          </button>
          <button
            type="button"
            onClick={() => setInputMode('lmp')}
            className={`py-2 px-2 rounded-xl font-semibold transition ${
              inputMode === 'lmp'
                ? 'bg-plum-700 text-white shadow-subtle'
                : 'text-charcoal-600 dark:text-charcoal-400 hover:text-plum-800'
            }`}
          >
            {t.setup.step1No}
          </button>
          <button
            type="button"
            onClick={() => setInputMode('both')}
            className={`py-2 px-2 rounded-xl font-semibold transition ${
              inputMode === 'both'
                ? 'bg-plum-700 text-white shadow-subtle'
                : 'text-charcoal-600 dark:text-charcoal-400 hover:text-plum-800'
            }`}
          >
            {t.setup.step1Both}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-plum-400 transition"
          />
        </div>

        {/* Doctor EDD Field */}
        {(inputMode === 'edd' || inputMode === 'both') && (
          <div className="p-4 rounded-2xl bg-champagne-50/60 dark:bg-charcoal-900/60 border border-champagne-200/80 dark:border-charcoal-700">
            <div className="flex items-center space-x-2 mb-1">
              <Stethoscope className="w-4 h-4 text-champagne-700 dark:text-champagne-400" />
              <label className="text-xs sm:text-sm font-bold text-plum-950 dark:text-white">
                {t.setup.doctorEddLabel}
              </label>
            </div>
            <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mb-2">
              {t.setup.doctorEddHelp}
            </p>
            <input
              type="date"
              required={inputMode === 'edd'}
              value={doctorEdd}
              onChange={(e) => setDoctorEdd(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300/80 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-champagne-400"
            />
          </div>
        )}

        {/* LMP Field */}
        {(inputMode === 'lmp' || inputMode === 'both') && (
          <div className="p-4 rounded-2xl bg-ivory-100/90 dark:bg-charcoal-900/60 border border-[#EFE8DE] dark:border-charcoal-700">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-plum-700 dark:text-dustyRose-400" />
              <label className="text-xs sm:text-sm font-bold text-plum-950 dark:text-white">
                {t.setup.lmpLabel}
              </label>
            </div>
            <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mb-2">
              {t.setup.lmpHelp}
            </p>
            <input
              type="date"
              max={todayStr}
              required={inputMode === 'lmp'}
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8DE] dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-plum-400"
            />
          </div>
        )}

        {/* Live Calculation Preview Card */}
        {liveCalc && (
          <div className="p-4 rounded-2xl bg-plum-50/80 dark:bg-plum-950/30 border border-plum-200 dark:border-plum-900 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-plum-900 dark:text-plum-200 uppercase tracking-wide">
              <span>{language === 'bn' ? 'গণনা ও রূপরেখা' : 'Your Pregnancy Preview'}</span>
              <span className="flex items-center gap-1 text-sage-700 dark:text-sage-400 font-bold">
                <Check className="w-3.5 h-3.5" /> {language === 'bn' ? 'সঠিক' : 'Ready'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-white/90 dark:bg-charcoal-800/90 p-3 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700">
                <span className="text-charcoal-400 block mb-0.5">{t.dashboard.currentStage}</span>
                <span className="text-sm font-extrabold text-plum-900 dark:text-white">
                  {formatNumber(liveCalc.currentWeek)} {t.common.weeks} {formatNumber(liveCalc.currentDay)} {t.common.days}
                </span>
                <span className="block text-[10px] text-dustyRose-600 dark:text-dustyRose-400 font-semibold mt-0.5">
                  {liveCalc.trimesterName}
                </span>
              </div>

              <div className="bg-white/90 dark:bg-charcoal-800/90 p-3 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700">
                <span className="text-charcoal-400 block mb-0.5">{t.dashboard.primaryEdd}</span>
                <span className="text-sm font-extrabold text-plum-900 dark:text-white">
                  {formatDate(liveCalc.primaryEdd)}
                </span>
                <span className="block text-[10px] text-charcoal-400 font-medium mt-0.5">
                  {formatNumber(liveCalc.daysRemaining)} {t.common.daysRemaining}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-plum-700 hover:bg-plum-800 text-white font-semibold shadow-premium flex items-center justify-center space-x-2 transition transform active:scale-[0.99] mt-2"
        >
          <span>{profile ? t.setup.updateJourney : t.setup.startJourney}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
