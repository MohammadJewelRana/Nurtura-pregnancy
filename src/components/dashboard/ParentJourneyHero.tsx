'use client';

import React from 'react';
import { Heart, Sparkles, Baby } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';

export function ParentJourneyHero() {
  const { t, language } = useLanguage();
  const { parentPhotos, profile } = usePregnancy();

  const motherPhoto = parentPhotos.mother;
  const fatherPhoto = parentPhotos.father;

  // RULE: If no photos exist, do NOT show an empty section or placeholder. Home stays clean.
  if (!motherPhoto && !fatherPhoto) {
    return null;
  }

  const motherName = profile?.name || (language === 'bn' ? 'মা' : 'Mother');
  const fatherName = language === 'bn' ? 'বাবা / সঙ্গী' : 'Partner';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-surface via-navy-elevated to-navy-surface border border-navy-border p-5 sm:p-6 shadow-premium">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Subtle Eyebrow Title */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-navy-surface border border-navy-border text-emerald text-[11px] font-bold uppercase tracking-widest shadow-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.parentPhotos.journeyTitle}</span>
        </div>

        {/* Visual Portraits Composition */}
        {motherPhoto && fatherPhoto ? (
          /* Case 1: Both Mother and Father exist */
          <div className="flex items-center justify-center space-x-4 sm:space-x-8 py-2">
            {/* Mother Portrait */}
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-emerald/40 to-navy-border border border-emerald/50 shadow-glow-emerald/20">
                <div className="w-full h-full rounded-full overflow-hidden bg-navy-surface">
                  <img
                    src={motherPhoto}
                    alt={motherName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-bold text-text-primary tracking-tight">
                {motherName}
              </span>
            </div>

            {/* Central Baby Emblem */}
            <div className="flex flex-col items-center justify-center px-1">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald/15 border border-emerald/30 text-emerald flex items-center justify-center shadow-subtle">
                <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-emerald" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald mt-1">
                ✦ {language === 'bn' ? 'শিশু' : 'Baby'} ✦
              </span>
            </div>

            {/* Father Portrait */}
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-emerald-accent/40 to-navy-border border border-emerald-accent/50 shadow-subtle">
                <div className="w-full h-full rounded-full overflow-hidden bg-navy-surface">
                  <img
                    src={fatherPhoto}
                    alt={fatherName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-bold text-text-primary tracking-tight">
                {fatherName}
              </span>
            </div>
          </div>
        ) : motherPhoto ? (
          /* Case 2: Only Mother exists */
          <div className="flex flex-col items-center space-y-2 py-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-gradient-to-tr from-emerald/50 to-navy-border border-2 border-emerald/60 shadow-glow-emerald/30">
              <div className="w-full h-full rounded-full overflow-hidden bg-navy-surface">
                <img
                  src={motherPhoto}
                  alt={motherName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-text-primary">
              {motherName}
            </span>
          </div>
        ) : fatherPhoto ? (
          /* Case 3: Only Father exists */
          <div className="flex flex-col items-center space-y-2 py-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-gradient-to-tr from-emerald-accent/50 to-navy-border border-2 border-emerald-accent/60 shadow-subtle">
              <div className="w-full h-full rounded-full overflow-hidden bg-navy-surface">
                <img
                  src={fatherPhoto}
                  alt={fatherName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-text-primary">
              {fatherName}
            </span>
          </div>
        ) : null}

        {/* Caption */}
        <p className="text-xs text-text-secondary font-medium tracking-wide">
          {t.parentPhotos.growingTogether}
        </p>
      </div>
    </div>
  );
}
