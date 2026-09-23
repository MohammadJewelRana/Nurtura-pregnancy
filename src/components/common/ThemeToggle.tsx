'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-full bg-navy-surface border border-navy-border ${className}`} />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`p-2 rounded-full transition-colors text-text-muted hover:text-emerald hover:bg-navy-surface border border-navy-border focus:outline-none focus:ring-2 focus:ring-emerald/40 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4 text-emerald" /> : <Moon className="w-4 h-4 text-text-muted" />}
    </button>
  );
}
