'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, Stethoscope, Sparkles, AlertCircle, Info, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { PregnancyProfile } from '@/types/pregnancy';
import { calculatePregnancy } from '@/lib/pregnancy/pregnancy-calculator';
import { getTodayDate, toDateString, parseLocalDate } from '@/lib/date/date-utils';
import { NurturaLogo } from '../common/NurturaLogo';
import { ParentPhotoUpload } from '../common/ParentPhotoUpload';

interface SetupFormProps {
  onCompleted?: () => void;
  isModal?: boolean;
}

export function PregnancySetupForm({ onCompleted, isModal = false }: SetupFormProps) {
  const { t, language, formatDate, formatNumber } = useLanguage();
  const { profile, updateProfile, parentPhotos, updateParentPhoto, removeParentPhoto } = usePregnancy();

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
    <div className={`w-full max-w-xl mx-auto ${isModal ? '' : 'p-6 sm:p-9 bg-navy-surface rounded-2xl shadow-premium border border-navy-border'}`}>
      {/* Title */}
      <div className="text-center mb-6 space-y-2">
        <div className="flex justify-center">
          <NurturaLogo size="md" showWordmark={false} />
        </div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">
          {profile ? t.setup.updateJourney : t.setup.welcomeTitle}
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          {t.setup.welcomeSubtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-state-danger/10 border border-state-danger/30 flex items-center space-x-2 text-state-danger text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: "Do you know your due date?" Selector */}
      <div className="mb-6 space-y-2">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider text-center">
          {t.setup.step1Question}
        </label>
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-navy-elevated border border-navy-border text-xs">
          <button
            type="button"
            onClick={() => setInputMode('edd')}
            className={`py-2 px-2 rounded-lg font-bold transition ${
              inputMode === 'edd'
                ? 'bg-emerald text-navy-bg shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.setup.step1Yes}
          </button>
          <button
            type="button"
            onClick={() => setInputMode('lmp')}
            className={`py-2 px-2 rounded-lg font-bold transition ${
              inputMode === 'lmp'
                ? 'bg-emerald text-navy-bg shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.setup.step1No}
          </button>
          <button
            type="button"
            onClick={() => setInputMode('both')}
            className={`py-2 px-2 rounded-lg font-bold transition ${
              inputMode === 'both'
                ? 'bg-emerald text-navy-bg shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.setup.step1Both}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mother Name (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            {t.setup.motherNameLabel}
          </label>
          <input
            type="text"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
            placeholder={t.setup.motherNamePlaceholder}
            className="w-full px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 transition placeholder:text-text-muted"
          />
        </div>

        {/* Doctor EDD Field */}
        {(inputMode === 'edd' || inputMode === 'both') && (
          <div className="p-4 rounded-xl bg-navy-elevated/70 border border-navy-border">
            <div className="flex items-center space-x-2 mb-1">
              <Stethoscope className="w-4 h-4 text-emerald" />
              <label className="text-xs sm:text-sm font-bold text-text-primary">
                {t.setup.doctorEddLabel}
              </label>
            </div>
            <p className="text-[11px] text-text-muted mb-2">
              {t.setup.doctorEddHelp}
            </p>
            <input
              type="date"
              required={inputMode === 'edd'}
              value={doctorEdd}
              onChange={(e) => setDoctorEdd(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
            />
          </div>
        )}

        {/* LMP Field */}
        {(inputMode === 'lmp' || inputMode === 'both') && (
          <div className="p-4 rounded-xl bg-navy-elevated/70 border border-navy-border">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-emerald-accent" />
              <label className="text-xs sm:text-sm font-bold text-text-primary">
                {t.setup.lmpLabel}
              </label>
            </div>
            <p className="text-[11px] text-text-muted mb-2">
              {t.setup.lmpHelp}
            </p>
            <input
              type="date"
              max={todayStr}
              required={inputMode === 'lmp'}
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
            />
          </div>
        )}

        {/* Live Calculation Preview Card */}
        {liveCalc && (
          <div className="p-4 rounded-xl bg-navy-elevated border border-emerald/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald uppercase tracking-wide">
              <span>{language === 'bn' ? 'গণনা ও রূপরেখা' : 'Your Pregnancy Preview'}</span>
              <span className="flex items-center gap-1 text-emerald-accent font-bold">
                <Check className="w-3.5 h-3.5" /> {language === 'bn' ? 'সঠিক' : 'Ready'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-navy-surface p-3 rounded-lg border border-navy-border">
                <span className="text-text-muted block mb-0.5">{t.dashboard.currentStage}</span>
                <span className="text-sm font-extrabold text-text-primary">
                  {formatNumber(liveCalc.currentWeek)} {t.common.weeks} {formatNumber(liveCalc.currentDay)} {t.common.days}
                </span>
                <span className="block text-[10px] text-emerald font-semibold mt-0.5">
                  {liveCalc.trimesterName}
                </span>
              </div>

              <div className="bg-navy-surface p-3 rounded-lg border border-navy-border">
                <span className="text-text-muted block mb-0.5">{t.dashboard.primaryEdd}</span>
                <span className="text-sm font-extrabold text-text-primary">
                  {formatDate(liveCalc.primaryEdd)}
                </span>
                <span className="block text-[10px] text-text-muted font-medium mt-0.5">
                  {formatNumber(liveCalc.daysRemaining)} {t.common.daysRemaining}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Parent / Family Photos (Optional) */}
        <div className="pt-3 border-t border-navy-border/60 space-y-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald block">
              {t.parentPhotos.sectionTitle}
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">
              {t.parentPhotos.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ParentPhotoUpload
              type="mother"
              label={t.parentPhotos.motherLabel}
              photoUrl={parentPhotos.mother}
              onUpload={(dataUrl) => updateParentPhoto('mother', dataUrl)}
              onRemove={() => removeParentPhoto('mother')}
            />
            <ParentPhotoUpload
              type="father"
              label={t.parentPhotos.fatherLabel}
              photoUrl={parentPhotos.father}
              onUpload={(dataUrl) => updateParentPhoto('father', dataUrl)}
              onRemove={() => removeParentPhoto('father')}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg font-bold shadow-glow-emerald flex items-center justify-center space-x-2 transition transform active:scale-[0.99] mt-2"
        >
          <span>{profile ? t.setup.updateJourney : t.setup.startJourney}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}
