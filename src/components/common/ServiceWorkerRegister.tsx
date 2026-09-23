'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { runStorageMigration } from '@/lib/storage/local-storage';
import { useLanguage } from '@/context/LanguageContext';

export function ServiceWorkerRegister() {
  const { t } = useLanguage();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // 1. Run local storage version migration immediately on client startup
    runStorageMigration();

    // 2. Register service worker if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // Check if there's already a waiting worker
            if (registration.waiting) {
              setWaitingWorker(registration.waiting);
              setShowUpdatePrompt(true);
            }

            // Listen for new updates found
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setWaitingWorker(newWorker);
                    setShowUpdatePrompt(true);
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('[PWA] Service worker registration error:', err);
          });

        // Listen for new service worker controlling page ONLY when user requested update
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-navy-surface border border-emerald/50 shadow-2xl text-xs text-text-primary">
        <RefreshCw className="w-4 h-4 text-emerald animate-spin" />
        <span className="font-semibold">{t.common.newVersionAvailable}</span>
        <div className="flex items-center space-x-1.5 pl-1">
          <button
            onClick={handleUpdate}
            className="px-2.5 py-1 rounded-lg bg-emerald hover:bg-emerald-light text-navy-bg font-bold transition shadow-glow-sm"
          >
            {t.common.updateApp}
          </button>
          <button
            onClick={() => setShowUpdatePrompt(false)}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary transition"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
