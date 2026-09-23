'use client';

import React, { useState, useEffect } from 'react';
import { Search, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { BABY_NAMES_DATA } from '@/data/baby-names/names-data';
import { getFavoriteNames, saveFavoriteNames } from '@/lib/storage/local-storage';

export function BabyNamesView() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl' | 'unisex'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getFavoriteNames());
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = favoriteIds.includes(id)
      ? favoriteIds.filter((item) => item !== id)
      : [...favoriteIds, id];
    setFavoriteIds(updated);
    saveFavoriteNames(updated);
  };

  const filteredNames = BABY_NAMES_DATA.filter((item) => {
    // Gender
    if (genderFilter !== 'all' && item.gender !== genderFilter) return false;

    // Favorites only
    if (favoritesOnly && !favoriteIds.includes(item.id)) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchBn = item.banglaName.includes(q);
      const matchMeaningEn = item.meaningEn.toLowerCase().includes(q);
      const matchMeaningBn = item.meaningBn.includes(q);
      return matchName || matchBn || matchMeaningEn || matchMeaningBn;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {t.names.title}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          {t.names.subtitle}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-navy-surface border border-navy-border shadow-soft space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t.names.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald/60 transition"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Gender buttons */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {(['all', 'boy', 'girl', 'unisex'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  genderFilter === g
                    ? 'bg-emerald border-emerald text-navy-bg font-bold shadow-glow-sm'
                    : 'bg-navy-elevated border-navy-border text-text-secondary hover:text-text-primary hover:border-navy-border/80'
                }`}
              >
                {g === 'all'
                  ? t.names.categoryAll
                  : g === 'boy'
                  ? t.names.categoryBoy
                  : g === 'girl'
                  ? t.names.categoryGirl
                  : t.names.categoryUnisex}
              </button>
            ))}
          </div>

          {/* Favorites filter toggle */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
              favoritesOnly
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 font-bold'
                : 'bg-navy-elevated border-navy-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-400 text-rose-400' : 'text-text-muted'}`} />
            <span>
              {language === 'bn'
                ? `পছন্দের তালিকা (${favoriteIds.length})`
                : `Favorites (${favoriteIds.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Names Grid */}
      {filteredNames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredNames.map((item) => {
            const isFav = favoriteIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-navy-surface border border-navy-border hover:border-emerald/40 shadow-soft flex flex-col justify-between space-y-3 transition duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      {item.name}
                    </h3>
                    <p className="text-sm font-bangla text-emerald font-semibold">
                      {item.banglaName}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-2 rounded-xl text-text-muted hover:text-rose-400 transition"
                    aria-label="Toggle favorite"
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-400 text-rose-400' : 'text-text-muted'}`} />
                  </button>
                </div>

                <div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {language === 'bn' ? item.meaningBn : item.meaningEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-navy-border/60 flex items-center justify-between text-[11px] text-text-muted">
                  <span className="capitalize">{item.gender}</span>
                  <span>{item.origin}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-navy-surface rounded-2xl border border-navy-border shadow-soft">
          <Sparkles className="w-8 h-8 text-emerald/60 mx-auto mb-2" />
          <p className="text-xs text-text-secondary">{t.names.noNamesFound}</p>
        </div>
      )}
    </div>
  );
}
