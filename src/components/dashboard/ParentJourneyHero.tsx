'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Baby, Heart } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-surface via-navy-elevated to-navy-surface border border-navy-border p-5 sm:p-6 shadow-premium"
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-emerald/10 rounded-full blur-3xl pointer-events-none"
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
          <div className="flex items-center justify-center space-x-3 sm:space-x-6 py-1">
            {/* Mother Portrait Card */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-24 h-28 sm:w-28 sm:h-36 rounded-2xl p-1 bg-gradient-to-b from-emerald/40 to-navy-border border-2 border-emerald/50 shadow-glow-emerald/20 transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-full h-full rounded-xl overflow-hidden bg-navy-surface">
                  <img
                    src={motherPhoto}
                    alt={motherName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                {/* <span className="block text-xs font-bold text-text-primary tracking-tight max-w-[110px] truncate">
                  {motherName}
                </span> */}
                <span className="block text-[10px] text-emerald font-semibold uppercase tracking-wider">
                  {language === 'bn' ? 'মা' : 'Mother'}
                </span>
              </div>
            </div>

            {/* Central Baby Connection Emblem */}
            <div className="flex flex-col items-center justify-center px-1 sm:px-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald/15 border border-emerald/30 text-emerald flex items-center justify-center shadow-subtle">
                <Baby className="w-5 h-5 text-emerald" />
              </div>
              <div className="flex items-center space-x-1 mt-1.5 text-emerald text-[10px] font-black uppercase tracking-wider">
                <Heart className="w-2.5 h-2.5 fill-current" />
                <span>{language === 'bn' ? 'শিশু' : 'Baby'}</span>
                <Heart className="w-2.5 h-2.5 fill-current" />
              </div>
            </div>

            {/* Father Portrait Card */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-24 h-28 sm:w-28 sm:h-36 rounded-2xl p-1 bg-gradient-to-b from-emerald-accent/40 to-navy-border border-2 border-emerald-accent/50 shadow-subtle transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-full h-full rounded-xl overflow-hidden bg-navy-surface">
                  <img
                    src={fatherPhoto}
                    alt={fatherName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                {/* <span className="block text-xs font-bold text-text-primary tracking-tight max-w-[110px] truncate">
                  {fatherName}
                </span> */}
            <span className="block text-[10px] text-emerald font-semibold uppercase tracking-wider">
                  {language === 'bn' ? 'বাবা' : 'Father'}
                </span>
              </div>
            </div>
          </div>
        ) : motherPhoto ? (
          /* Case 2: Only Mother exists */
          <div className="flex flex-col items-center space-y-2 py-1">
            <div className="w-28 h-32 sm:w-32 sm:h-40 rounded-2xl p-1.5 bg-gradient-to-b from-emerald/50 to-navy-border border-2 border-emerald/60 shadow-glow-emerald/30">
              <div className="w-full h-full rounded-xl overflow-hidden bg-navy-surface">
                <img
                  src={motherPhoto}
                  alt={motherName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs sm:text-sm font-bold text-text-primary">
                {motherName}
              </span>
              <span className="block text-[10px] text-emerald font-semibold uppercase tracking-wider mt-0.5">
                {language === 'bn' ? 'মা' : 'Mother'}
              </span>
            </div>
          </div>
        ) : fatherPhoto ? (
          /* Case 3: Only Father exists */
          <div className="flex flex-col items-center space-y-2 py-1">
            <div className="w-28 h-32 sm:w-32 sm:h-40 rounded-2xl p-1.5 bg-gradient-to-b from-emerald-accent/50 to-navy-border border-2 border-emerald-accent/60 shadow-subtle">
              <div className="w-full h-full rounded-xl overflow-hidden bg-navy-surface">
                <img
                  src={fatherPhoto}
                  alt={fatherName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs sm:text-sm font-bold text-text-primary">
                {fatherName}
              </span>
              <span className="block text-[10px] text-text-muted font-semibold uppercase tracking-wider mt-0.5">
                {language === 'bn' ? 'বাবা / সঙ্গী' : 'Partner'}
              </span>
            </div>
          </div>
        ) : null}

        {/* Caption */}
        <p className="text-xs text-text-secondary font-medium tracking-wide">
          {t.parentPhotos.growingTogether}
        </p>
      </div>
    </motion.div>
  );
}
