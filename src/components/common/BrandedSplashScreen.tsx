'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NurturaLogo } from './NurturaLogo';
import { useLanguage } from '@/context/LanguageContext';

export function BrandedSplashScreen() {
  const { language } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-bg px-6 select-none">
      <div className="flex flex-col items-center text-center space-y-6 max-w-xs animate-in fade-in duration-300">
        {/* Animated Custom Ring Loader with central emblem */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald/15 blur-xl animate-pulse" />

          {/* Rotating Emerald Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.3,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-full border-2 border-navy-border border-t-emerald border-r-emerald-teal"
          />

          {/* Static Center Emblem */}
          <div className="relative z-10">
            <NurturaLogo size="md" showWordmark={false} />
          </div>
        </div>

        {/* Wordmark and Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Nurtura
          </h1>
          <p className="text-xs text-text-muted leading-relaxed font-normal">
            {language === 'bn'
              ? 'আপনার মাতৃত্বের যাত্রা, সুন্দর ও নিরাপদে সাজানো'
              : 'Your pregnancy journey, beautifully organized'}
          </p>
        </div>

        {/* Pulsing Status Indicator Dots */}
        <div className="flex items-center space-x-1.5 pt-2" aria-hidden="true">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-emerald"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
            className="w-1.5 h-1.5 rounded-full bg-emerald"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
            className="w-1.5 h-1.5 rounded-full bg-emerald/60"
          />
        </div>
      </div>
    </div>
  );
}
