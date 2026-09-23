'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NurturaLogo } from './NurturaLogo';
import { useLanguage } from '@/context/LanguageContext';
import { runStorageMigration } from '@/lib/storage/local-storage';

// Module-level guard: guarantees splash only runs once per app launch/page load,
// preventing it from re-appearing during client-side route navigation.
let hasShownAppSplash = false;

const MIN_SPLASH_TIME = 800; // ms: polished duration requested (~800ms)
const MAX_SAFETY_TIMEOUT = 2500; // ms: absolute safety ceiling to prevent infinite hang

interface BrandedSplashScreenProps {
  isLoading?: boolean;
}

export function BrandedSplashScreen({ isLoading }: BrandedSplashScreenProps) {
  const { language } = useLanguage();
  // Start visible on initial load if splash hasn't shown yet in this window session
  const [isSplashVisible, setIsSplashVisible] = useState<boolean>(() => !hasShownAppSplash);

  useEffect(() => {
    // If already shown in this session, immediately hide
    if (hasShownAppSplash) {
      setIsSplashVisible(false);
      return;
    }

    hasShownAppSplash = true;
    const startTime = Date.now();

    // Safety timeout: automatically dismiss splash even if an async task or storage hangs
    const safetyTimer = setTimeout(() => {
      setIsSplashVisible(false);
    }, MAX_SAFETY_TIMEOUT);

    // Run core local initializations
    const initLocalTasks = async () => {
      try {
        runStorageMigration();
      } catch (err) {
        console.warn('[Nurtura] Local migration error:', err);
      }
    };

    // Calculate remaining time to satisfy exact minimum duration (~800ms)
    const delayTimer = new Promise<void>((resolve) => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_SPLASH_TIME - elapsed);
      setTimeout(resolve, remaining);
    });

    // When both local tasks and minimum display duration finish, auto-transition
    Promise.all([initLocalTasks(), delayTimer])
      .then(() => {
        clearTimeout(safetyTimer);
        setIsSplashVisible(false);
      })
      .catch(() => {
        clearTimeout(safetyTimer);
        setIsSplashVisible(false);
      });

    return () => {
      clearTimeout(safetyTimer);
    };
  }, []);

  // Also honor external isLoading if provided, but still dismiss when timer finishes
  const shouldRender = isSplashVisible || (isLoading === true && !hasShownAppSplash);

  return (
    <AnimatePresence mode="wait">
      {shouldRender && (
        <motion.div
          key="nurtura-splash-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-bg px-6 select-none"
        >
          <div className="flex flex-col items-center text-center space-y-6 max-w-xs">
            {/* Animated Custom Ring Loader with central emblem */}
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

            {/* Pulsing Status Indicator Dots */}
            <div className="flex items-center space-x-1.5 pt-2">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
