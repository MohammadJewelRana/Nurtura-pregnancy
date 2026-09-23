'use client';

import React, { useState, useEffect } from 'react';
import { Smile, Calendar, Trash2, Heart, Check, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MoodLog, MoodType } from '@/types/pregnancy';
import { getSavedMoods, saveMoods } from '@/lib/storage/local-storage';
import { toDateString, getTodayDate } from '@/lib/date/date-utils';

export function MoodTracker() {
  const { t, formatDate, language } = useLanguage();
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType>('good');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [noteText, setNoteText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setMoods(getSavedMoods());
  }, []);

  const moodOptions: { type: MoodType; emoji: string; label: string }[] = [
    { type: 'great', emoji: '😊', label: t.tracking.moodGreat },
    { type: 'good', emoji: '🙂', label: t.tracking.moodGood },
    { type: 'okay', emoji: '😐', label: t.tracking.moodOkay },
    { type: 'low', emoji: '😔', label: t.tracking.moodLow },
    { type: 'difficult', emoji: '😣', label: t.tracking.moodDifficult },
  ];

  const symptomOptions = [
    { id: 'fatigue', label: t.tracking.symptomFatigue },
    { id: 'nausea', label: t.tracking.symptomNausea },
    { id: 'heartburn', label: t.tracking.symptomHeartburn },
    { id: 'headache', label: t.tracking.symptomHeadache },
    { id: 'calm', label: t.tracking.symptomCalm },
    { id: 'anxious', label: t.tracking.symptomAnxious },
  ];

  const toggleSymptom = (symId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symId) ? prev.filter((s) => s !== symId) : [...prev, symId]
    );
  };

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = toDateString(getTodayDate());

    const newLog: MoodLog = {
      id: `mood_${Date.now()}`,
      date: todayStr,
      mood: selectedMood,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
      note: noteText.trim() || undefined,
    };

    const updated = [newLog, ...moods.filter((m) => m.date !== todayStr)];
    setMoods(updated);
    saveMoods(updated);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = moods.filter((r) => r.id !== id);
    setMoods(updated);
    saveMoods(updated);
  };

  const getMoodEmoji = (type: MoodType) => {
    const found = moodOptions.find((m) => m.type === type);
    return found ? found.emoji : '🙂';
  };

  return (
    <div className="space-y-6">
      {/* Mood Entry Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-[#1E1722] rounded-3xl border border-[#EFE8DE] dark:border-[#332537] shadow-subtle">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-champagne-50 dark:bg-champagne-950/40 text-champagne-700 dark:text-champagne-400">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-plum-950 dark:text-white">
              {t.tracking.moodTitle}
            </h3>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
              {t.tracking.moodSubtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveMood} className="space-y-5">
          {/* Mood selection row */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-charcoal-300 uppercase tracking-wider mb-2.5">
              {t.tracking.howAreYou}
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {moodOptions.map((opt) => {
                const isSelected = selectedMood === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedMood(opt.type)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-plum-100/70 dark:bg-plum-900/50 border-plum-300 dark:border-plum-700 shadow-subtle scale-105'
                        : 'bg-ivory-50 dark:bg-charcoal-800 border-[#EFE8DE] dark:border-charcoal-700 hover:bg-plum-50/50'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{opt.emoji}</span>
                    <span className="text-[11px] font-semibold text-charcoal-700 dark:text-charcoal-200 truncate w-full">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Common Sensations */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-600 dark:text-charcoal-300 mb-2">
              {t.tracking.symptomsLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {symptomOptions.map((sym) => {
                const active = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      active
                        ? 'bg-plum-700 border-plum-800 text-white shadow-subtle'
                        : 'bg-white dark:bg-charcoal-800 border-[#EFE8DE] dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100'
                    }`}
                  >
                    {sym.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <textarea
              rows={2}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={t.tracking.moodNotePlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-xs sm:text-sm text-charcoal-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-plum-400"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {savedSuccess ? (
              <span className="text-xs font-bold text-sage-700 dark:text-sage-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> {t.common.saved}
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-semibold shadow-subtle transition flex items-center space-x-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>{t.tracking.saveMood}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Mood History */}
      <div className="p-6 bg-white dark:bg-[#1E1722] rounded-3xl border border-[#EFE8DE] dark:border-[#332537] shadow-subtle">
        <h4 className="text-sm font-bold text-plum-950 dark:text-white mb-4">
          {t.tracking.moodHistory}
        </h4>

        {moods.length > 0 ? (
          <div className="divide-y divide-[#F2ECE3] dark:divide-[#2C2130]">
            {moods.map((m) => (
              <div key={m.id} className="py-3 flex items-start justify-between text-xs gap-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getMoodEmoji(m.mood)}</span>
                  <div>
                    <span className="font-semibold text-plum-950 dark:text-white block">
                      {formatDate(m.date)}
                    </span>
                    {m.symptoms && m.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.symptoms.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-ivory-100 dark:bg-charcoal-800 text-[10px] text-plum-700 dark:text-dustyRose-400 font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {m.note && (
                      <p className="mt-1 text-charcoal-500 dark:text-charcoal-400 italic text-[11px]">
                        &ldquo;{m.note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1 rounded-lg text-charcoal-400 hover:text-red-500 transition"
                  title={t.common.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-charcoal-400 text-center py-4">
            {language === 'bn' ? 'কোনো রেকর্ড পাওয়া যায়নি।' : 'No mood entries logged yet.'}
          </p>
        )}
      </div>

      {/* Wellness disclaimer */}
      <div className="p-4 rounded-2xl bg-ivory-100/70 dark:bg-charcoal-800/40 border border-[#EFE8DE] dark:border-charcoal-700/60 flex items-start space-x-3 text-xs text-charcoal-500 dark:text-charcoal-400">
        <Info className="w-4 h-4 flex-shrink-0 text-charcoal-400 mt-0.5" />
        <p>
          {language === 'bn'
            ? 'এই মুড ট্র্যাকারটি ব্যক্তিগত সচেতনতার উদ্দেশ্যে তৈরি। গর্ভাবস্থায় মানসিক অবসাদ বা উদ্বেগ বেশি বোধ হলে একজন দক্ষ চিকিৎসকের সহায়তা নিন।'
            : 'This check-in is for personal emotional reflection only. If experiencing severe stress, depression, or distress during pregnancy, contact a healthcare professional.'}
        </p>
      </div>
    </div>
  );
}
