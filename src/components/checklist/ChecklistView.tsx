'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, Luggage, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ChecklistItem, HospitalBagItem } from '@/types/pregnancy';
import {
  getSavedChecklists,
  saveChecklists,
  getSavedHospitalBag,
  saveHospitalBag,
} from '@/lib/storage/local-storage';
import { DEFAULT_CHECKLISTS, DEFAULT_HOSPITAL_BAG } from '@/data/checklists/default-checklists';

type ActiveView = 'trimesters' | 'hospital';

interface ChecklistViewProps {
  initialView?: ActiveView;
}

export function ChecklistView({ initialView = 'trimesters' }: ChecklistViewProps) {
  const { t, language, formatNumber } = useLanguage();
  const [activeView, setActiveView] = useState<ActiveView>(initialView);
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [hospitalBag, setHospitalBag] = useState<HospitalBagItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('first-trimester');

  useEffect(() => {
    const savedCL = getSavedChecklists();
    if (savedCL && savedCL.length > 0) {
      setChecklists(savedCL);
    } else {
      setChecklists(DEFAULT_CHECKLISTS);
      saveChecklists(DEFAULT_CHECKLISTS);
    }

    const savedHB = getSavedHospitalBag();
    if (savedHB && savedHB.length > 0) {
      setHospitalBag(savedHB);
    } else {
      setHospitalBag(DEFAULT_HOSPITAL_BAG);
      saveHospitalBag(DEFAULT_HOSPITAL_BAG);
    }
  }, []);

  // Trimester checklist toggle
  const toggleChecklist = (id: string) => {
    const updated = checklists.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setChecklists(updated);
    saveChecklists(updated);
  };

  // Hospital bag toggle
  const toggleHospitalBag = (id: string) => {
    const updated = hospitalBag.map((item) =>
      item.id === id ? { ...item, isPacked: !item.isPacked } : item
    );
    setHospitalBag(updated);
    saveHospitalBag(updated);
  };

  // Add custom item
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeView === 'trimesters') {
      const newItem: ChecklistItem = {
        id: `c_custom_${Date.now()}`,
        category: newCategory as ChecklistItem['category'],
        titleEn: newTitle.trim(),
        titleBn: newTitle.trim(),
        isCompleted: false,
        isCustom: true,
      };
      const updated = [...checklists, newItem];
      setChecklists(updated);
      saveChecklists(updated);
    } else {
      const newItem: HospitalBagItem = {
        id: `hb_custom_${Date.now()}`,
        category: newCategory as HospitalBagItem['category'],
        titleEn: newTitle.trim(),
        titleBn: newTitle.trim(),
        isPacked: false,
        isCustom: true,
      };
      const updated = [...hospitalBag, newItem];
      setHospitalBag(updated);
      saveHospitalBag(updated);
    }

    setNewTitle('');
  };

  const handleDeleteItem = (id: string, isHospital: boolean) => {
    if (isHospital) {
      const updated = hospitalBag.filter((i) => i.id !== id);
      setHospitalBag(updated);
      saveHospitalBag(updated);
    } else {
      const updated = checklists.filter((i) => i.id !== id);
      setChecklists(updated);
      saveChecklists(updated);
    }
  };

  // Stats
  const completedTrimesterCount = checklists.filter((c) => c.isCompleted).length;
  const trimesterPercent = checklists.length > 0 ? Math.round((completedTrimesterCount / checklists.length) * 100) : 0;

  const completedHospitalCount = hospitalBag.filter((h) => h.isPacked).length;
  const hospitalPercent = hospitalBag.length > 0 ? Math.round((completedHospitalCount / hospitalBag.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
          {t.checklists.title}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          {t.checklists.subtitle}
        </p>
      </div>

      {/* View Switcher Bar */}
      <div className="flex p-1.5 rounded-xl bg-navy-surface border border-navy-border shadow-subtle">
        <button
          onClick={() => {
            setActiveView('trimesters');
            setNewCategory('first-trimester');
          }}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-xs sm:text-sm font-semibold transition ${
            activeView === 'trimesters'
              ? 'bg-emerald text-navy-bg font-bold shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>{t.checklists.tabTrimesters}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-bg/20 ml-1 font-bold">
            {formatNumber(trimesterPercent)}%
          </span>
        </button>

        <button
          onClick={() => {
            setActiveView('hospital');
            setNewCategory('mother');
          }}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-xs sm:text-sm font-semibold transition ${
            activeView === 'hospital'
              ? 'bg-emerald text-navy-bg font-bold shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Luggage className="w-4 h-4" />
          <span>{t.checklists.tabHospital}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-bg/20 ml-1 font-bold">
            {formatNumber(hospitalPercent)}%
          </span>
        </button>
      </div>

      {/* Progress banner */}
      <div className="p-5 rounded-2xl bg-navy-surface border border-navy-border shadow-premium">
        <div className="flex justify-between items-center text-xs font-semibold text-text-secondary mb-2">
          <span>{t.checklists.overallProgress}</span>
          <span className="text-emerald text-sm font-bold">
            {formatNumber(activeView === 'trimesters' ? trimesterPercent : hospitalPercent)}%
          </span>
        </div>
        <div className="w-full bg-navy-elevated rounded-full h-2 overflow-hidden border border-navy-border">
          <div
            className="bg-gradient-to-r from-emerald-teal to-emerald h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,201,154,0.4)]"
            style={{ width: `${activeView === 'trimesters' ? trimesterPercent : hospitalPercent}%` }}
          />
        </div>
      </div>

      {/* Add Custom Task Form */}
      <form
        onSubmit={handleAddCustom}
        className="p-4 rounded-xl bg-navy-surface border border-navy-border flex flex-col sm:flex-row gap-3 shadow-subtle"
      >
        <div className="flex-1">
          <input
            type="text"
            required
            placeholder={t.checklists.itemPlaceholder}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald/40 placeholder:text-text-muted"
          />
        </div>

        {activeView === 'trimesters' ? (
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-xs font-semibold text-text-primary"
          >
            <option value="first-trimester">{t.common.firstTrimester}</option>
            <option value="second-trimester">{t.common.secondTrimester}</option>
            <option value="third-trimester">{t.common.thirdTrimester}</option>
          </select>
        ) : (
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-xs font-semibold text-text-primary"
          >
            <option value="mother">{t.checklists.motherBag}</option>
            <option value="baby">{t.checklists.babyBag}</option>
            <option value="documents">{t.checklists.partnerBag}</option>
            <option value="personal">Personal Items</option>
          </select>
        )}

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-bold shadow-subtle flex items-center justify-center space-x-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.checklists.addItem}</span>
        </button>
      </form>

      {/* Trimester Checklist View */}
      {activeView === 'trimesters' && (
        <div className="space-y-6">
          {(['first-trimester', 'second-trimester', 'third-trimester'] as const).map((cat) => {
            const items = checklists.filter((i) => i.category === cat);
            const catLabel =
              cat === 'first-trimester'
                ? t.common.firstTrimester
                : cat === 'second-trimester'
                ? t.common.secondTrimester
                : t.common.thirdTrimester;

            return (
              <div
                key={cat}
                className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-premium"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-4 h-4 text-emerald" />
                  <h3 className="text-base font-bold text-text-primary">
                    {catLabel}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs sm:text-sm ${
                        item.isCompleted
                          ? 'bg-navy-elevated/40 border-navy-border/60 text-text-muted line-through'
                          : 'bg-navy-elevated border-navy-border text-text-primary hover:border-emerald/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.isCompleted ? (
                          <CheckSquare className="w-4 h-4 text-emerald flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-text-muted flex-shrink-0" />
                        )}
                        <span>{language === 'bn' ? item.titleBn : item.titleEn}</span>
                      </div>

                      {item.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id, false);
                          }}
                          className="p-1 text-text-muted hover:text-state-danger transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hospital Bag View */}
      {activeView === 'hospital' && (
        <div className="space-y-6">
          {(['mother', 'baby', 'documents', 'personal'] as const).map((cat) => {
            const items = hospitalBag.filter((i) => i.category === cat);
            const catLabel =
              cat === 'mother'
                ? t.checklists.motherBag
                : cat === 'baby'
                ? t.checklists.babyBag
                : cat === 'documents'
                ? t.checklists.partnerBag
                : 'Personal Items';

            return (
              <div
                key={cat}
                className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-premium"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Luggage className="w-4 h-4 text-emerald" />
                  <h3 className="text-base font-bold text-text-primary">
                    {catLabel}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleHospitalBag(item.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs sm:text-sm ${
                        item.isPacked
                          ? 'bg-navy-elevated/40 border-navy-border/60 text-text-muted line-through'
                          : 'bg-navy-elevated border-navy-border text-text-primary hover:border-emerald/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.isPacked ? (
                          <CheckSquare className="w-4 h-4 text-emerald flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-text-muted flex-shrink-0" />
                        )}
                        <span>{language === 'bn' ? item.titleBn : item.titleEn}</span>
                      </div>

                      {item.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id, true);
                          }}
                          className="p-1 text-text-muted hover:text-state-danger transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
