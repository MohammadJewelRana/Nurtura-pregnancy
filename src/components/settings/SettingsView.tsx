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
  Info,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { NetworkBadge } from '../common/NetworkStatusIndicator';
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
    downloadAnchor.setAttribute('download', `nurtura_backup_${new Date().toISOString().slice(0, 10)}.json`);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {t.settings.title}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Date Edit Modal */}
      {showEditDates && (
        <div className="fixed inset-0 z-50 bg-navy-bg/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-surface border border-navy-border rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowEditDates(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text-primary transition"
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
      <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-soft space-y-4">
        <div className="flex items-center space-x-2 text-emerald">
          <Calendar className="w-5 h-5" />
          <h3 className="text-base font-bold text-text-primary">
            {t.settings.profileSection}
          </h3>
        </div>

        {calculation.isValid ? (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-navy-elevated border border-navy-border">
                <span className="text-text-muted block mb-0.5">{t.setup.motherNameLabel}</span>
                <span className="font-bold text-sm text-text-primary">
                  {profile?.name || (language === 'bn' ? 'মা' : 'Mama')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-elevated border border-navy-border">
                <span className="text-text-muted block mb-0.5">{t.dashboard.primaryEdd}</span>
                <span className="font-bold text-sm text-emerald">
                  {formatDate(calculation.primaryEdd)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowEditDates(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald hover:bg-emerald-light text-navy-bg font-bold text-xs transition shadow-glow-sm"
            >
              {t.settings.editDatesBtn}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-text-secondary mb-3">{t.setup.welcomeSubtitle}</p>
            <button
              onClick={() => setShowEditDates(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald hover:bg-emerald-light text-navy-bg font-bold text-xs transition shadow-glow-sm"
            >
              {t.setup.startJourney}
            </button>
          </div>
        )}
      </div>

      {/* Preferences Card */}
      <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">
            {t.settings.preferencesSection}
          </h3>
          <NetworkBadge showText={true} />
        </div>

        <div className="divide-y divide-navy-border/60 text-xs sm:text-sm">
          {/* Language preference */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Globe className="w-4 h-4 text-emerald" />
              <span className="font-medium text-text-primary">
                {t.common.language}
              </span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Theme preference */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <SunMoon className="w-4 h-4 text-emerald" />
              <span className="font-medium text-text-primary">
                {t.common.theme}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Data & Privacy Controls */}
      <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-soft space-y-4">
        <div className="flex items-center space-x-2 text-emerald">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-base font-bold text-text-primary">
            {t.settings.storageSection}
          </h3>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          {t.settings.storageExplanation}
        </p>

        {/* Local Storage & Backup Notice */}
        <div className="p-3.5 rounded-xl bg-navy-elevated border border-navy-border/80 flex items-start space-x-2.5 text-xs text-text-secondary">
          <Info className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.common.dataStorageNotice}
          </p>
        </div>

        {importStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              importStatus.success
                ? 'bg-emerald/15 text-emerald border border-emerald/40'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/40'
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
            className="px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary hover:border-emerald/40 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4 text-emerald" />
            <span>{t.common.exportData}</span>
          </button>

          {/* Import JSON */}
          <label className="px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-text-primary hover:border-emerald/40 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition">
            <Upload className="w-4 h-4 text-emerald" />
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
            className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.common.clearData}</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-navy-bg/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-surface border border-navy-border rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h4 className="text-base font-bold text-text-primary">
              {t.common.clearData}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {t.common.clearConfirm}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-xs font-semibold text-text-secondary hover:text-text-primary transition"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About & Medical Disclaimer */}
      <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-soft text-xs text-text-secondary space-y-2.5">
        <div className="flex items-center space-x-2 text-emerald font-bold">
          <Heart className="w-4 h-4 fill-emerald" />
          <span>{t.common.appName} – {t.common.appSubtitle}</span>
        </div>
        <p className="leading-relaxed">{t.common.disclaimerText}</p>
        <p className="text-[11px] text-text-muted pt-1">
          {t.settings.version}: 1.0.0 • {t.settings.license}
        </p>
      </div>
    </div>
  );
}
