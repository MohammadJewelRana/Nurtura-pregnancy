'use client';

import React from 'react';

interface NurturaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
}

export function NurturaLogo({ className = '', size = 'md', showWordmark = true }: NurturaLogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-base', spacing: 'space-x-2' },
    md: { icon: 32, text: 'text-lg', spacing: 'space-x-2.5' },
    lg: { icon: 44, text: 'text-2xl', spacing: 'space-x-3' },
    xl: { icon: 64, text: 'text-3xl', spacing: 'space-x-4' },
  };

  const { icon, text, spacing } = sizeMap[size];

  return (
    <div className={`flex items-center ${spacing} select-none ${className}`}>
      {/* Abstract Emerald Maternal Emblem */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-navy-elevated to-navy-surface border border-navy-border shadow-subtle flex-shrink-0"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 40 40"
          width={icon * 0.72}
          height={icon * 0.72}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Protective maternal embrace curve */}
          <path
            d="M20 7 C26 7 31 11 31 17 C31 24 24 29 20 33 C16 29 9 24 9 17 C9 11 14 7 20 7 Z"
            stroke="url(#emblemGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Mother serene spark */}
          <circle cx="20" cy="13" r="2.2" fill="url(#emblemGrad)" />
          {/* Baby life nucleus */}
          <circle cx="20" cy="21" r="3.2" fill="url(#emblemGrad)" />
          <circle cx="20" cy="21" r="1.3" fill="#F5F8FA" />

          <defs>
            <linearGradient id="emblemGrad" x1="9" y1="7" x2="31" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3B6" />
              <stop offset="0.5" stopColor="#00C99A" />
              <stop offset="1" stopColor="#00BFA5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-text-primary ${text}`}>
            Nurtura
          </span>
        </div>
      )}
    </div>
  );
}
