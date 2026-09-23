'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Ruler, Weight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getBabySizeComparison, BabySizeComparisonItem } from '@/data/baby-size-comparisons';

interface BabySizeComparisonProps {
  week: number;
  variant?: 'compact' | 'prominent' | 'card';
  showMeasurements?: boolean;
  className?: string;
}

export function BabySizeComparison({
  week,
  variant = 'compact',
  showMeasurements = false,
  className = '',
}: BabySizeComparisonProps) {
  const { language, formatNumber } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const comparison: BabySizeComparisonItem = getBabySizeComparison(week);
  const name = language === 'bn' ? comparison.nameBn : comparison.nameEn;
  const altText = language === 'bn' ? comparison.altBn : comparison.altEn;

  // Category badge translation
  const getCategoryLabel = (category: string) => {
    if (language === 'bn') {
      switch (category) {
        case 'seed':
          return 'বীজ ও অঙ্কুর';
        case 'fruit':
          return 'ফল';
        case 'vegetable':
          return 'শাকসবজি';
        case 'cellular':
          return 'কোষীয় পর্যায়';
        default:
          return 'তুলনামূলক আকার';
      }
    }
    switch (category) {
      case 'seed':
        return 'Seed & Sprout';
      case 'fruit':
        return 'Fruit';
      case 'vegetable':
        return 'Vegetable';
      case 'cellular':
        return 'Cellular';
      default:
        return 'Size Comparison';
    }
  };

  // Compact Thumbnail Variant (e.g., inside preview rows or cards)
  if (variant === 'compact') {
    return (
      <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-navy-elevated/90 border border-navy-border shadow-subtle p-1.5 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-emerald/40 group">
          {!imageError ? (
            <div className="relative w-full h-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
              <Image
                src={comparison.imageSrc}
                alt={altText}
                width={56}
                height={56}
                className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                onError={() => setImageError(true)}
                unoptimized
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-emerald">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Prominent Variant (Featured prominently on the Week-by-Week page)
  if (variant === 'prominent') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-elevated via-navy-surface to-navy-background border border-navy-border p-6 shadow-premium transition-all duration-300 hover:border-emerald/30 ${className}`}
      >
        {/* Soft background radial emerald glow */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 bg-emerald/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Real-World Visual Item Frame */}
          <div className="relative group flex-shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-navy-elevated border-2 border-navy-border/80 shadow-card flex items-center justify-center p-3 relative overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:border-emerald/40">
              {/* Inner ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald/10 via-transparent to-transparent opacity-60" />

              {!imageError ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={comparison.imageSrc}
                    alt={altText}
                    width={110}
                    height={110}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]"
                    onError={() => setImageError(true)}
                    priority={week <= 14}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2 text-emerald">
                  <Sparkles className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold text-text-muted">{name}</span>
                </div>
              )}
            </div>

            {/* Scale category tag */}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-navy-surface border border-navy-border text-emerald shadow-subtle whitespace-nowrap">
              {getCategoryLabel(comparison.category)}
            </span>
          </div>

          {/* Descriptive Information */}
          <div className="text-center sm:text-left flex-1 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald/10 border border-emerald/20 text-emerald text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বাস্তব আকারের তুলনা' : 'Real-World Size Comparison'}</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                {name}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-1">
                {language === 'bn'
                  ? `সপ্তাহ ${formatNumber(week)}-এ আপনার শিশু আনুমানিক একটি ${name}-এর সমান!`
                  : `At week ${formatNumber(week)}, your baby is approximately the size of a ${name}!`
                }
              </p>
            </div>

            {showMeasurements && (
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-text-muted">
                <div className="flex items-center space-x-1.5 bg-navy-surface px-3 py-1.5 rounded-xl border border-navy-border">
                  <Ruler className="w-3.5 h-3.5 text-emerald" />
                  <span>~{formatNumber(comparison.approxLengthCm)} cm</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-navy-surface px-3 py-1.5 rounded-xl border border-navy-border">
                  <Weight className="w-3.5 h-3.5 text-emerald-accent" />
                  <span>~{formatNumber(comparison.approxWeightGrams)} g</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card Variant (Self-contained widget)
  return (
    <div
      className={`rounded-2xl bg-navy-surface border border-navy-border p-5 shadow-premium flex items-center space-x-4 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-navy-elevated border border-navy-border flex items-center justify-center p-2 flex-shrink-0 shadow-subtle">
        {!imageError ? (
          <Image
            src={comparison.imageSrc}
            alt={altText}
            width={60}
            height={60}
            className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <Sparkles className="w-6 h-6 text-emerald" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block">
          {getCategoryLabel(comparison.category)}
        </span>
        <h4 className="text-base font-black text-text-primary truncate">{name}</h4>
        <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
          <span>~{formatNumber(comparison.approxLengthCm)} cm</span>
          <span>•</span>
          <span>~{formatNumber(comparison.approxWeightGrams)} g</span>
        </div>
      </div>
    </div>
  );
}
