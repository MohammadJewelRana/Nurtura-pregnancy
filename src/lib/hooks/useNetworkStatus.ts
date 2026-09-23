'use client';

import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [backOnlineNotice, setBackOnlineNotice] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    let backOnlineTimer: NodeJS.Timeout | null = null;

    const handleOnline = () => {
      setIsOnline(true);
      setBackOnlineNotice(true);
      if (backOnlineTimer) clearTimeout(backOnlineTimer);
      backOnlineTimer = setTimeout(() => {
        setBackOnlineNotice(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setBackOnlineNotice(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (backOnlineTimer) clearTimeout(backOnlineTimer);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    backOnlineNotice,
  };
}
