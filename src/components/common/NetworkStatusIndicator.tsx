'use client';

import React from 'react';
import { Wifi, WifiOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';
import { useLanguage } from '@/context/LanguageContext';

interface NetworkBadgeProps {
  showText?: boolean;
  className?: string;
}

/**
 * Compact inline indicator suitable for headers or menus
 */
export function NetworkBadge({ showText = false, className = '' }: NetworkBadgeProps) {
  const { isOnline } = useNetworkStatus();
  const { t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
        isOnline
          ? 'bg-emerald/10 text-emerald border border-emerald/20'
          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
      } ${className}`}
      title={isOnline ? t.common.networkOnline : t.common.networkOffline}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? 'bg-emerald' : 'bg-amber-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline ? 'bg-emerald' : 'bg-amber-400'
          }`}
        />
      </span>
      {showText && (
        <span className="truncate max-w-[170px] sm:max-w-none">
          {isOnline ? t.common.networkOnline : t.common.networkOffline}
        </span>
      )}
    </div>
  );
}

/**
 * Global non-intrusive floating status banner & toast
 */
export function NetworkStatusBanner() {
  const { isOffline, backOnlineNotice } = useNetworkStatus();
  const { t } = useLanguage();

  return (
    <>
      {/* Reconnected Back Online Toast (temporary 4s) */}
      {backOnlineNotice && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-none">
          <div className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-surface border border-emerald/50 text-emerald shadow-2xl text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald" />
            <span>{t.common.networkBackOnline}</span>
          </div>
        </div>
      )}

      {/* Persistent Offline Compact Banner (Unobtrusive & non-blocking) */}
      {isOffline && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-200 px-4 py-1.5 text-center text-xs flex items-center justify-center space-x-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="font-medium">{t.common.networkOfflineBanner}</span>
          <span className="hidden sm:inline-block text-amber-400/60">•</span>
          <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] text-amber-300/80">
            <ShieldCheck className="w-3 h-3 text-emerald" />
            <span>{t.common.localPrivacyBadge}</span>
          </span>
        </div>
      )}
    </>
  );
}
