'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Plus, Calendar, Trash2, TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { WeightRecord } from '@/types/pregnancy';
import { getSavedWeight, saveWeight } from '@/lib/storage/local-storage';
import { toDateString, getTodayDate } from '@/lib/date/date-utils';

export function WeightTracker() {
  const { t, formatDate, formatNumber, language } = useLanguage();
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [dateInput, setDateInput] = useState(toDateString(getTodayDate()));
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    setRecords(getSavedWeight());
  }, []);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 30 || val >= 250) return;

    const newRecord: WeightRecord = {
      id: `w_${Date.now()}`,
      date: dateInput || toDateString(getTodayDate()),
      weightKg: Math.round(val * 10) / 10,
      note: noteInput.trim() || undefined,
    };

    // Sort by date descending
    const updated = [newRecord, ...records.filter((r) => r.date !== newRecord.date)].sort(
      (a, b) => (a.date > b.date ? 1 : -1)
    );

    setRecords(updated);
    saveWeight(updated);
    setWeightInput('');
    setNoteInput('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveWeight(updated);
  };

  // Sort chronological for chart
  const sortedForChart = [...records].sort((a, b) => (a.date > b.date ? 1 : -1));
  const latestRecord = sortedForChart.length > 0 ? sortedForChart[sortedForChart.length - 1] : null;

  // Chart coordinate calculation
  const minWeight = sortedForChart.length > 0
    ? Math.max(0, Math.floor(Math.min(...sortedForChart.map((r) => r.weightKg)) - 2))
    : 50;
  const maxWeight = sortedForChart.length > 0
    ? Math.ceil(Math.max(...sortedForChart.map((r) => r.weightKg)) + 2)
    : 80;
  const weightRange = Math.max(1, maxWeight - minWeight);

  return (
    <div className="space-y-6">
      {/* Top Overview & Action Card */}
      <div className="p-6 sm:p-8 bg-navy-surface rounded-2xl border border-navy-border shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-navy-elevated border border-navy-border text-emerald">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-text-primary tracking-tight">
                {t.tracking.weightTitle}
              </h3>
              <p className="text-xs text-text-muted">
                {t.tracking.weightSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-bold shadow-subtle flex items-center space-x-1.5 transition self-start sm:self-center"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.tracking.logWeightBtn}</span>
          </button>
        </div>

        {/* Latest Metric Banner */}
        {latestRecord && (
          <div className="mb-6 p-4 rounded-xl bg-navy-elevated border border-navy-border flex items-center justify-between">
            <div>
              <span className="text-xs text-text-muted block mb-0.5">
                {t.tracking.currentWeight}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald">
                {formatNumber(latestRecord.weightKg)}{' '}
                <span className="text-sm font-semibold text-text-muted">kg</span>
              </div>
            </div>
            <div className="text-xs text-text-muted flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald" />
              <span>{formatDate(latestRecord.date)}</span>
            </div>
          </div>
        )}

        {/* Add Entry Form Modal/Accordion */}
        {showAddForm && (
          <form
            onSubmit={handleAddWeight}
            className="mb-6 p-5 rounded-xl bg-navy-elevated border border-navy-border space-y-4"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              {language === 'bn' ? 'নতুন ওজন লিপিবদ্ধ করুন' : 'Log New Weight Record'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {t.tracking.weightInput} *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min="30"
                  max="250"
                  placeholder="e.g. 62.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-navy-border bg-navy-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {t.tracking.weightDate} *
                </label>
                <input
                  type="date"
                  required
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-navy-border bg-navy-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                {t.tracking.weightNote}
              </label>
              <input
                type="text"
                placeholder={language === 'bn' ? 'যেমন: সকালের খাবারের আগে' : 'e.g. Morning before breakfast'}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-navy-border bg-navy-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text-primary"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald hover:bg-emerald-dark text-navy-bg text-xs font-bold shadow-subtle transition"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        )}

        {/* Visual Trend Chart */}
        {sortedForChart.length >= 2 ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-text-secondary">
              <TrendingUp className="w-4 h-4 text-emerald" />
              <span>{language === 'bn' ? 'ওজন পরিবর্তনের চার্ট' : 'Weight Trend Graph'}</span>
            </div>

            <div className="w-full h-48 bg-navy-elevated rounded-xl p-4 border border-navy-border flex flex-col justify-between">
              {/* SVG Chart */}
              <svg className="w-full h-36 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#1D3345" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#1D3345" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#1D3345" strokeDasharray="3 3" />

                {/* Path line */}
                {(() => {
                  const points = sortedForChart.map((item, idx) => {
                    const x = sortedForChart.length === 1 ? 250 : (idx / (sortedForChart.length - 1)) * 480 + 10;
                    const y = 110 - ((item.weightKg - minWeight) / weightRange) * 90;
                    return `${x},${y}`;
                  });
                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#00C99A"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {sortedForChart.map((item, idx) => {
                        const x = sortedForChart.length === 1 ? 250 : (idx / (sortedForChart.length - 1)) * 480 + 10;
                        const y = 110 - ((item.weightKg - minWeight) / weightRange) * 90;
                        return (
                          <g key={item.id}>
                            <circle cx={x} cy={y} r="5" fill="#00C99A" stroke="#0F1C2D" strokeWidth="2" />
                            <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7DE7D2">
                              {formatNumber(item.weightKg)}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[10px] text-text-muted font-medium px-2">
                <span>{formatDate(sortedForChart[0].date)}</span>
                <span>{formatDate(sortedForChart[sortedForChart.length - 1].date)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-text-muted bg-navy-elevated/50 rounded-xl border border-dashed border-navy-border">
            {language === 'bn'
              ? 'ট্রেন্ড চার্ট দেখার জন্য অন্তত ২টি ওজন রেকর্ড যোগ করুন।'
              : 'Log at least 2 weight records to view your trend chart.'}
          </div>
        )}
      </div>

      {/* History List */}
      <div className="p-6 bg-navy-surface rounded-2xl border border-navy-border shadow-subtle">
        <h4 className="text-sm font-bold text-text-primary mb-4">
          {t.tracking.weightHistory}
        </h4>

        {records.length > 0 ? (
          <div className="divide-y divide-navy-border">
            {records.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-text-primary">
                    {formatDate(r.date)}
                  </span>
                  {r.note && (
                    <p className="text-text-muted italic text-[11px] mt-0.5">
                      {r.note}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-emerald">
                    {formatNumber(r.weightKg)} kg
                  </span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1 rounded-lg text-text-muted hover:text-state-danger transition"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-muted text-center py-4">
            {language === 'bn' ? 'কোনো ওজন তথ্য এখনো যোগ করা হয়নি।' : 'No weight entries logged yet.'}
          </p>
        )}
      </div>

      {/* Non-Prescriptive Medical Context Disclaimer */}
      <div className="p-4 rounded-xl bg-navy-surface border border-navy-border flex items-start space-x-3 text-xs text-text-muted">
        <Info className="w-4 h-4 flex-shrink-0 text-emerald mt-0.5" />
        <p className="leading-relaxed">{t.tracking.weightDisclaimer}</p>
      </div>
    </div>
  );
}
