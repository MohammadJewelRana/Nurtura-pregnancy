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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 dark:text-white">
          {t.names.title}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
          {t.names.subtitle}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-plum-100/60 dark:border-charcoal-800 shadow-soft space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t.names.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-plum-100 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-xs sm:text-sm text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-plum-400"
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
                    ? 'bg-plum-900 border-plum-900 text-white shadow-soft'
                    : 'bg-white dark:bg-charcoal-800 border-plum-100 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100'
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
                ? 'bg-dustyRose-50 border-dustyRose-300 text-dustyRose-700 dark:bg-dustyRose-950/40 dark:border-dustyRose-800 dark:text-dustyRose-300'
                : 'bg-white dark:bg-charcoal-800 border-plum-100 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-100'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-dustyRose-500 text-dustyRose-500' : ''}`} />
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
                className="p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-plum-100/60 dark:border-charcoal-800 shadow-soft flex flex-col justify-between space-y-3 group hover:border-plum-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm font-bangla text-plum-800 dark:text-dustyRose-400 font-semibold">
                      {item.banglaName}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-2 rounded-xl text-charcoal-300 hover:text-dustyRose-500 transition"
                    aria-label="Toggle favorite"
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-dustyRose-500 text-dustyRose-500' : ''}`} />
                  </button>
                </div>

                <div>
                  <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                    {language === 'bn' ? item.meaningBn : item.meaningEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-plum-50 dark:border-charcoal-800 flex items-center justify-between text-[11px] text-charcoal-400">
                  <span className="capitalize">{item.gender}</span>
                  <span>{item.origin}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-charcoal-900 rounded-3xl border border-plum-100/60 dark:border-charcoal-800 shadow-soft">
          <Sparkles className="w-8 h-8 text-champagne-400 mx-auto mb-2" />
          <p className="text-xs text-charcoal-500">{t.names.noNamesFound}</p>
        </div>
      )}
    </div>
  );
}
