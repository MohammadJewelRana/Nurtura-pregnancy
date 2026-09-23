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
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {t.journal.title}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {t.journal.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => setShowPhotoModal(true)}
            className="px-4 py-2.5 rounded-xl border border-navy-border bg-navy-surface text-emerald hover:bg-navy-elevated text-xs font-semibold flex items-center space-x-1.5 transition"
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
            className="px-4 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-bold shadow-subtle flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.journal.newEntry}</span>
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="p-6 rounded-2xl bg-navy-surface border border-emerald/40 shadow-premium space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald" />
              <span>{editingId ? t.common.edit : t.journal.newEntry}</span>
            </h3>
            <button
              onClick={() => setShowEditor(false)}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
                />
              </div>
              <div>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
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
                className="w-full px-4 py-3 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-text-primary"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-bold shadow-subtle transition"
              >
                {t.journal.saveEntry}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="p-6 rounded-2xl bg-navy-surface border border-emerald/40 shadow-premium space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald" />
              <span>{t.journal.addPhoto}</span>
            </h3>
            <button
              onClick={() => {
                setShowPhotoModal(false);
                setPhotoPreview(null);
              }}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSavePhoto} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {t.journal.photoWeek}
                </label>
                <select
                  value={photoWeek}
                  onChange={(e) => setPhotoWeek(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary text-sm font-semibold"
                >
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      {t.common.week} {formatNumber(w)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {t.journal.choosePhoto}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handlePhotoSelect}
                  className="w-full text-xs text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-navy-elevated file:text-emerald hover:file:border-emerald"
                />
              </div>
            </div>

            {photoPreview && (
              <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden border border-navy-border shadow-subtle">
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
                className="w-full px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald/40"
              />
            </div>

            <p className="text-[11px] text-text-muted flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
              <span>{t.journal.photoPrivacyNote}</span>
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoPreview(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-text-primary"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-bold shadow-subtle transition"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bump / Memory Photos Gallery */}
      <div className="p-6 bg-navy-surface rounded-2xl border border-navy-border shadow-premium">
        <div className="flex items-center space-x-2 mb-4">
          <ImageIcon className="w-5 h-5 text-emerald" />
          <h3 className="text-base font-bold text-text-primary">
            {t.journal.photoMemories}
          </h3>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-navy-border shadow-subtle bg-navy-elevated"
              >
                <div className="aspect-square w-full overflow-hidden bg-navy-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageDataUrl}
                    alt={item.caption || `Week ${item.weekNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-2.5 bg-navy-elevated">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block">
                    {t.common.week} {formatNumber(item.weekNumber)}
                  </span>
                  {item.caption && (
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {item.caption}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeletePhoto(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-navy-bg/80 text-state-danger opacity-0 group-hover:opacity-100 transition shadow"
                  title={t.common.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-xl bg-navy-elevated/40 border border-dashed border-navy-border">
            <Camera className="w-7 h-7 text-emerald mx-auto mb-2 opacity-60" />
            <p className="text-xs text-text-muted">
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
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t.journal.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-navy-border bg-navy-elevated text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald/40 placeholder:text-text-muted"
            />
          </div>
        </div>

        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl bg-navy-surface border border-navy-border shadow-subtle flex flex-col justify-between space-y-4 hover:border-emerald/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                    <span className="flex items-center gap-1 font-medium text-emerald">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(entry.date)}
                    </span>
                    {entry.weekNumber && (
                      <span className="px-2 py-0.5 rounded-full bg-navy-elevated border border-navy-border text-[10px] font-bold text-emerald">
                        {t.common.week} {formatNumber(entry.weekNumber)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-text-primary mb-2">
                    {entry.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-navy-border flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-emerald transition"
                    title={t.common.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-state-danger transition"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-navy-surface rounded-2xl border border-navy-border shadow-subtle">
            <BookOpen className="w-8 h-8 text-emerald mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto">
              {t.journal.noEntries}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
