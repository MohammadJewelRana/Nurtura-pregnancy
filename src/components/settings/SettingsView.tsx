'use client';

import React, { useState, useRef } from 'react';
import {
  Settings,
  Calendar,
  Globe,
  SunMoon,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Heart,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { PregnancySetupForm } from '../pregnancy/PregnancySetupForm';
import {
  exportAllData,
  importAllData,
  clearAllLocalData,
} from '@/lib/storage/local-storage';

export function SettingsView() {
  const { t, formatDate, language } = useLanguage();
  const { profile, calculation, refreshData } = usePregnancy();

  const [showEditDates, setShowEditDates] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const data = exportAllData();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `motherly_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const result = importAllData(parsed);
        setImportStatus(result);
        if (result.success) {
          refreshData();
        }
      } catch {
        setImportStatus({
          success: false,
          message: language === 'bn' ? 'ফাইলটি সঠিক JSON ফরম্যাটে নেই।' : 'Invalid JSON file format.',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmClear = () => {
    clearAllLocalData();
    refreshData();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 dark:text-white">
          {t.settings.title}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Date Edit Modal */}
      {showEditDates && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-soft-lg">
            <button
              onClick={() => setShowEditDates(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <PregnancySetupForm
              isModal
              onCompleted={() => {
                setShowEditDates(false);
                refreshData();
              }}
            />
          </div>
        </div>
      )}

      {/* Profile & Dates Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft space-y-4">
        <div className="flex items-center space-x-2 text-rose-500">
          <Calendar className="w-5 h-5" />
          <h3 className="text-base font-bold text-charcoal-900 dark:text-white">
            {t.settings.profileSection}
          </h3>
        </div>

        {calculation.isValid ? (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-charcoal-800/50 border border-rose-100 dark:border-charcoal-700">
                <span className="text-charcoal-400 block mb-0.5">{t.setup.motherNameLabel}</span>
                <span className="font-bold text-sm text-charcoal-800 dark:text-white">
                  {profile?.name || (language === 'bn' ? 'মা' : 'Mama')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-charcoal-800/50 border border-rose-100 dark:border-charcoal-700">
                <span className="text-charcoal-400 block mb-0.5">{t.dashboard.primaryEdd}</span>
                <span className="font-bold text-sm text-charcoal-800 dark:text-white">
                  {formatDate(calculation.primaryEdd)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowEditDates(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition shadow-sm"
            >
              {t.settings.editDatesBtn}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-charcoal-500 mb-3">{t.setup.welcomeSubtitle}</p>
            <button
              onClick={() => setShowEditDates(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition shadow-sm"
            >
              {t.setup.startJourney}
            </button>
          </div>
        )}
      </div>

      {/* Preferences Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-charcoal-900 dark:text-white">
          {t.settings.preferencesSection}
        </h3>

        <div className="divide-y divide-rose-50 dark:divide-charcoal-800 text-xs sm:text-sm">
          {/* Language preference */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Globe className="w-4 h-4 text-charcoal-500" />
              <span className="font-medium text-charcoal-800 dark:text-charcoal-200">
                {t.common.language}
              </span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Theme preference */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <SunMoon className="w-4 h-4 text-charcoal-500" />
              <span className="font-medium text-charcoal-800 dark:text-charcoal-200">
                {t.common.theme}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Data & Privacy Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-rose-100 dark:border-charcoal-800 shadow-soft space-y-4">
        <div className="flex items-center space-x-2 text-emerald-600">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-base font-bold text-charcoal-900 dark:text-white">
            {t.settings.storageSection}
          </h3>
        </div>

        <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
          {t.settings.storageExplanation}
        </p>

        {importStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              importStatus.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {importStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-200 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4 text-rose-500" />
            <span>{t.common.exportData}</span>
          </button>

          {/* Import JSON */}
          <label className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-200 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition">
            <Upload className="w-4 h-4 text-rose-500" />
            <span>{t.common.importData}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {/* Clear Data */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.common.clearData}</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-soft-lg">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <h4 className="text-base font-bold text-charcoal-900 dark:text-white">
              {t.common.clearData}
            </h4>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
              {t.common.clearConfirm}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-charcoal-200 dark:border-charcoal-700 text-xs font-semibold text-charcoal-700 dark:text-charcoal-300"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About & Medical Disclaimer */}
      <div className="p-6 rounded-3xl bg-cream-50/70 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-800 shadow-soft text-xs text-charcoal-600 dark:text-charcoal-300 space-y-2.5">
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold">
          <Heart className="w-4 h-4 fill-rose-500" />
          <span>{t.common.appName} – {t.common.appSubtitle}</span>
        </div>
        <p className="leading-relaxed">{t.common.disclaimerText}</p>
        <p className="text-[11px] text-charcoal-400 pt-1">
          {t.settings.version}: 1.0.0 • {t.settings.license}
        </p>
      </div>
    </div>
  );
}
