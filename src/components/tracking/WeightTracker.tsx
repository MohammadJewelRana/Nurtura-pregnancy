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
      <div className="p-6 sm:p-8 bg-white dark:bg-charcoal-900 rounded-3xl border border-rose-100 dark:border-charcoal-800 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white">
                {t.tracking.weightTitle}
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
                {t.tracking.weightSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-soft flex items-center space-x-1.5 transition self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>{t.tracking.logWeightBtn}</span>
          </button>
        </div>

        {/* Latest Metric Banner */}
        {latestRecord && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/50 dark:bg-charcoal-800/50 border border-emerald-100 dark:border-charcoal-700 flex items-center justify-between">
            <div>
              <span className="text-xs text-charcoal-500 dark:text-charcoal-400 block mb-0.5">
                {t.tracking.currentWeight}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {formatNumber(latestRecord.weightKg)}{' '}
                <span className="text-sm font-semibold">kg</span>
              </div>
            </div>
            <div className="text-xs text-charcoal-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(latestRecord.date)}</span>
            </div>
          </div>
        )}

        {/* Add Entry Form Modal/Accordion */}
        {showAddForm && (
          <form
            onSubmit={handleAddWeight}
            className="mb-6 p-5 rounded-2xl bg-charcoal-50 dark:bg-charcoal-800/80 border border-charcoal-200 dark:border-charcoal-700 space-y-4"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-200">
              {language === 'bn' ? 'নতুন ওজন লিপিবদ্ধ করুন' : 'Log New Weight Record'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
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
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                  {t.tracking.weightDate} *
                </label>
                <input
                  type="date"
                  required
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1">
                {t.tracking.weightNote}
              </label>
              <input
                type="text"
                placeholder={language === 'bn' ? 'যেমন: সকালের খাবারের আগে' : 'e.g. Morning before breakfast'}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-charcoal-600 hover:bg-charcoal-200 dark:text-charcoal-300"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        )}

        {/* Visual Trend Chart */}
        {sortedForChart.length >= 2 ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'ওজন পরিবর্তনের চার্ট' : 'Weight Trend Graph'}</span>
            </div>

            <div className="w-full h-48 bg-emerald-50/20 dark:bg-charcoal-800/40 rounded-2xl p-4 border border-emerald-100 dark:border-charcoal-800 flex flex-col justify-between">
              {/* SVG Chart */}
              <svg className="w-full h-36 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="currentColor" strokeDasharray="3 3" className="text-charcoal-200 dark:text-charcoal-700" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="currentColor" strokeDasharray="3 3" className="text-charcoal-200 dark:text-charcoal-700" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeDasharray="3 3" className="text-charcoal-200 dark:text-charcoal-700" />

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
                        stroke="#059669"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points.join(' ')}
                      />
                      {sortedForChart.map((item, idx) => {
                        const x = sortedForChart.length === 1 ? 250 : (idx / (sortedForChart.length - 1)) * 480 + 10;
                        const y = 110 - ((item.weightKg - minWeight) / weightRange) * 90;
                        return (
                          <g key={item.id}>
                            <circle cx={x} cy={y} r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                            <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">
                              {formatNumber(item.weightKg)}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[10px] text-charcoal-400 font-medium px-2">
                <span>{formatDate(sortedForChart[0].date)}</span>
                <span>{formatDate(sortedForChart[sortedForChart.length - 1].date)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-charcoal-400 bg-charcoal-50/50 dark:bg-charcoal-800/30 rounded-2xl border border-dashed border-charcoal-200 dark:border-charcoal-700">
            {language === 'bn'
              ? 'ট্রেন্ড চার্ট দেখার জন্য অন্তত ২টি ওজন রেকর্ড যোগ করুন।'
              : 'Log at least 2 weight records to view your trend chart.'}
          </div>
        )}
      </div>

      {/* History List */}
      <div className="p-6 bg-white dark:bg-charcoal-900 rounded-3xl border border-rose-100 dark:border-charcoal-800 shadow-soft">
        <h4 className="text-sm font-bold text-charcoal-900 dark:text-white mb-4">
          {t.tracking.weightHistory}
        </h4>

        {records.length > 0 ? (
          <div className="divide-y divide-rose-50 dark:divide-charcoal-800">
            {records.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-charcoal-900 dark:text-white">
                    {formatDate(r.date)}
                  </span>
                  {r.note && (
                    <p className="text-charcoal-500 dark:text-charcoal-400 italic text-[11px] mt-0.5">
                      {r.note}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatNumber(r.weightKg)} kg
                  </span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1 rounded-lg text-charcoal-400 hover:text-red-500 transition"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-charcoal-400 text-center py-4">
            {language === 'bn' ? 'কোনো ওজন তথ্য এখনো যোগ করা হয়নি।' : 'No weight entries logged yet.'}
          </p>
        )}
      </div>

      {/* Non-Prescriptive Medical Context Disclaimer */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-charcoal-800/60 border border-emerald-100 dark:border-charcoal-700 flex items-start space-x-3 text-xs text-charcoal-600 dark:text-charcoal-300">
        <Info className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
        <p className="leading-relaxed">{t.tracking.weightDisclaimer}</p>
      </div>
    </div>
  );
}
