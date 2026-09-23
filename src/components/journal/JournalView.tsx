'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit2,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  Calendar,
  X,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { JournalEntry, MemoryPhoto } from '@/types/pregnancy';
import { getSavedJournal, saveJournal } from '@/lib/storage/local-storage';
import { saveMemoryPhoto, getMemoryPhotos, deleteMemoryPhoto } from '@/lib/storage/indexed-db';
import { toDateString, getTodayDate } from '@/lib/date/date-utils';

export function JournalView() {
  const { t, formatDate, formatNumber, language } = useLanguage();
  const { calculation } = usePregnancy();

  // Journal entries
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryDate, setEntryDate] = useState(toDateString(getTodayDate()));

  // Photos
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoWeek, setPhotoWeek] = useState<number>(calculation.isValid ? calculation.currentWeek : 12);
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getSavedJournal());
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const list = await getMemoryPhotos();
    setPhotos(list);
  };

  // Journal handlers
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryContent.trim()) return;

    if (editingId) {
      const updated = entries.map((item) =>
        item.id === editingId
          ? {
              ...item,
              title: entryTitle.trim(),
              content: entryContent.trim(),
              date: entryDate,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      setEntries(updated);
      saveJournal(updated);
    } else {
      const newEntry: JournalEntry = {
        id: `j_${Date.now()}`,
        title: entryTitle.trim(),
        content: entryContent.trim(),
        date: entryDate,
        weekNumber: calculation.isValid ? calculation.currentWeek : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newEntry, ...entries];
      setEntries(updated);
      saveJournal(updated);
    }

    // Reset editor
    setEntryTitle('');
    setEntryContent('');
    setEditingId(null);
    setShowEditor(false);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntryDate(entry.date);
    setShowEditor(true);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveJournal(updated);
  };

  // Photo handlers
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPreview) return;

    const newPhoto: MemoryPhoto = {
      id: `photo_${Date.now()}`,
      weekNumber: photoWeek,
      date: toDateString(getTodayDate()),
      caption: photoCaption.trim(),
      imageDataUrl: photoPreview,
    };

    await saveMemoryPhoto(newPhoto);
    await loadPhotos();

    // Reset
    setPhotoPreview(null);
    setPhotoCaption('');
    setShowPhotoModal(false);
  };

  const handleDeletePhoto = async (id: string) => {
    await deleteMemoryPhoto(id);
    await loadPhotos();
  };

  // Filtered entries
  const filteredEntries = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-plum-950 dark:text-white">
            {t.journal.title}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
            {t.journal.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setShowPhotoModal(true)}
            className="px-4 py-2.5 rounded-2xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-plum-800 dark:text-dustyRose-300 hover:bg-ivory-100 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Camera className="w-4 h-4" />
            <span>{t.journal.addPhoto}</span>
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setEntryTitle('');
              setEntryContent('');
              setEntryDate(toDateString(getTodayDate()));
              setShowEditor(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-semibold shadow-subtle flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.journal.newEntry}</span>
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1722] border border-plum-200/80 dark:border-plum-800/60 shadow-premium space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-plum-950 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-plum-700 dark:text-dustyRose-400" />
              <span>{editingId ? t.common.edit : t.journal.newEntry}</span>
            </h3>
            <button
              onClick={() => setShowEditor(false)}
              className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder={t.journal.entryTitle}
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-plum-400"
                />
              </div>
              <div>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-plum-400"
                />
              </div>
            </div>

            <div>
              <textarea
                rows={6}
                required
                placeholder={t.journal.entryContent}
                value={entryContent}
                onChange={(e) => setEntryContent(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-plum-400 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-500 hover:bg-ivory-100"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-semibold shadow-subtle transition"
              >
                {t.journal.saveEntry}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1722] border border-plum-200/80 dark:border-plum-800/60 shadow-premium space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-plum-950 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-plum-700 dark:text-dustyRose-400" />
              <span>{t.journal.addPhoto}</span>
            </h3>
            <button
              onClick={() => {
                setShowPhotoModal(false);
                setPhotoPreview(null);
              }}
              className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSavePhoto} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                  {t.journal.photoWeek}
                </label>
                <select
                  value={photoWeek}
                  onChange={(e) => setPhotoWeek(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-sm font-semibold"
                >
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      {t.common.week} {formatNumber(w)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                  {t.journal.choosePhoto}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handlePhotoSelect}
                  className="w-full text-xs text-charcoal-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-ivory-100 file:text-plum-800 hover:file:bg-ivory-200"
                />
              </div>
            </div>

            {photoPreview && (
              <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border border-[#EFE8DE] shadow-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder={t.journal.photoCaption}
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-xs sm:text-sm text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-plum-400"
              />
            </div>

            <p className="text-[11px] text-charcoal-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
              <span>{t.journal.photoPrivacyNote}</span>
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoPreview(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-500 hover:bg-ivory-100"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-semibold shadow-subtle transition"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bump / Memory Photos Gallery */}
      <div className="p-6 bg-white dark:bg-[#1E1722] rounded-3xl border border-[#EFE8DE] dark:border-[#332537] shadow-subtle">
        <div className="flex items-center space-x-2 mb-4">
          <ImageIcon className="w-5 h-5 text-plum-700 dark:text-dustyRose-400" />
          <h3 className="text-base font-bold text-plum-950 dark:text-white">
            {t.journal.photoMemories}
          </h3>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-[#EFE8DE] dark:border-charcoal-700 shadow-subtle bg-ivory-50/60"
              >
                <div className="aspect-square w-full overflow-hidden bg-charcoal-100 dark:bg-charcoal-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageDataUrl}
                    alt={item.caption || `Week ${item.weekNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-2.5 bg-white dark:bg-[#1E1722]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-plum-700 dark:text-dustyRose-400 block">
                    {t.common.week} {formatNumber(item.weekNumber)}
                  </span>
                  {item.caption && (
                    <p className="text-xs text-charcoal-700 dark:text-charcoal-300 truncate mt-0.5">
                      {item.caption}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeletePhoto(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition shadow"
                  title={t.common.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-ivory-50/50 dark:bg-charcoal-800/30 border border-dashed border-[#EFE8DE] dark:border-charcoal-700">
            <Camera className="w-7 h-7 text-plum-400 dark:text-dustyRose-400 mx-auto mb-2 opacity-70" />
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
              {language === 'bn'
                ? 'এখনো কোনো ছবি সংরক্ষণ করা হয়নি। আপনার সুন্দর বেবি বাম্পের ছবি যোগ করুন!'
                : 'No memory photos saved yet. Chronicle your bump journey!'}
            </p>
          </div>
        )}
      </div>

      {/* Journal Entries Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t.journal.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-xs sm:text-sm text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-plum-400"
            />
          </div>
        </div>

        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#1E1722] border border-[#EFE8DE] dark:border-[#332537] shadow-subtle flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-charcoal-400 mb-2">
                    <span className="flex items-center gap-1 font-medium text-plum-700 dark:text-dustyRose-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(entry.date)}
                    </span>
                    {entry.weekNumber && (
                      <span className="px-2 py-0.5 rounded-full bg-plum-50 dark:bg-charcoal-800 text-[10px] font-bold text-plum-800 dark:text-dustyRose-300">
                        {t.common.week} {formatNumber(entry.weekNumber)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-plum-950 dark:text-white mb-2">
                    {entry.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE3] dark:border-[#2C2130] flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-plum-700 transition"
                    title={t.common.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-500 transition"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-white dark:bg-[#1E1722] rounded-3xl border border-[#EFE8DE] dark:border-[#332537] shadow-subtle">
            <BookOpen className="w-8 h-8 text-plum-400 dark:text-dustyRose-400 mx-auto mb-2 opacity-70" />
            <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 max-w-sm mx-auto">
              {t.journal.noEntries}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
