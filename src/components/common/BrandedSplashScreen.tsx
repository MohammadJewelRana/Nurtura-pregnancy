'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NurturaLogo } from './NurturaLogo';
import { useLanguage } from '@/context/LanguageContext';

interface BrandedSplashScreenProps {
  isLoading: boolean;
}

export function BrandedSplashScreen({ isLoading }: BrandedSplashScreenProps) {
  const { language } = useLanguage();

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-bg px-6 select-none"
    >
      <div className="flex flex-col items-center text-center space-y-6 max-w-xs">
        {/* Animated Custom Ring Loader with central logo */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald/10 blur-xl animate-pulse" />

          {/* Rotating Emerald Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
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

        {/* Subtle pulsing status dot */}
        <div className="flex items-center space-x-1.5 pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-ping" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald/40" />
        </div>
      </div>
    </motion.div>
  );
}
