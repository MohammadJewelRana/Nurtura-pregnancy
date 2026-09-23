'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-full bg-ivory-200 dark:bg-charcoal-800 ${className}`} />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`p-2 rounded-full transition-colors text-charcoal-600 dark:text-charcoal-300 hover:text-plum-800 dark:hover:text-champagne-300 hover:bg-ivory-200/80 dark:hover:bg-charcoal-800 focus:outline-none focus:ring-2 focus:ring-plum-300 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4 text-champagne-400" /> : <Moon className="w-4 h-4 text-plum-700" />}
    </button>
  );
}
