'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Sparkles,
  Info,
  ShieldAlert,
  RotateCcw,
  ArrowRight,
  HeartPulse,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';

type UnitSystem = 'metric' | 'imperial';
type BmiCategory = 'underweight' | 'healthy' | 'overweight' | 'obesity';

export function BmiCalculator() {
  const { t, language, formatNumber } = useLanguage();
  const { calculation } = usePregnancy();

  const [unit, setUnit] = useState<UnitSystem>('metric');

  // Metric inputs
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');

  // Imperial inputs
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLb, setWeightLb] = useState('');

  // Results
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: BmiCategory;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let calculatedBmi = 0;

    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);

      if (isNaN(h) || isNaN(w)) {
        setErrorMsg(t.bmi.errorValid);
        return;
      }
      if (h <= 0 || w <= 0) {
        setErrorMsg(t.bmi.errorPositive);
        return;
      }

      const heightM = h / 100;
      calculatedBmi = w / (heightM * heightM);
    } else {
      const ft = parseFloat(heightFeet) || 0;
      const inch = parseFloat(heightInches) || 0;
      const lb = parseFloat(weightLb);

      const totalInches = ft * 12 + inch;

      if (totalInches <= 0 || isNaN(lb) || lb <= 0) {
        setErrorMsg(t.bmi.errorPositive);
        return;
      }

      calculatedBmi = (703 * lb) / (totalInches * totalInches);
    }

    if (!isFinite(calculatedBmi) || isNaN(calculatedBmi)) {
      setErrorMsg(t.bmi.errorValid);
      return;
    }

    const rounded = Math.round(calculatedBmi * 10) / 10;

    let category: BmiCategory = 'healthy';
    if (rounded < 18.5) {
      category = 'underweight';
    } else if (rounded <= 24.9) {
      category = 'healthy';
    } else if (rounded <= 29.9) {
      category = 'overweight';
    } else {
      category = 'obesity';
    }

    setBmiResult({
      bmi: rounded,
      category,
    });
  };

  const handleReset = () => {
    setHeightCm('');
    setWeightKg('');
    setHeightFeet('');
    setHeightInches('');
    setWeightLb('');
    setBmiResult(null);
    setErrorMsg(null);
  };

  // Visual marker position: maps BMI range 15–40 to percentage (0% to 100%)
  const markerPercent = bmiResult
    ? Math.min(95, Math.max(5, ((bmiResult.bmi - 15) / (40 - 15)) * 100))
    : 0;

  const categoryDetails = {
    underweight: {
      label: t.bmi.underweight,
      range: t.bmi.rangeUnderweight,
      suggestion: t.bmi.suggestionUnderweight,
      textColor: 'text-sky-400',
      bgColor: 'bg-sky-500/15',
      borderColor: 'border-sky-500/40',
      indicatorColor: 'bg-sky-400',
    },
    healthy: {
      label: t.bmi.healthy,
      range: t.bmi.rangeHealthy,
      suggestion: t.bmi.suggestionHealthy,
      textColor: 'text-emerald',
      bgColor: 'bg-emerald/15',
      borderColor: 'border-emerald/40',
      indicatorColor: 'bg-emerald',
    },
    overweight: {
      label: t.bmi.overweight,
      range: t.bmi.rangeOverweight,
      suggestion: t.bmi.suggestionOverweight,
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/15',
      borderColor: 'border-amber-500/40',
      indicatorColor: 'bg-amber-400',
    },
    obesity: {
      label: t.bmi.obesity,
      range: t.bmi.rangeObesity,
      suggestion: t.bmi.suggestionObesity,
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/15',
      borderColor: 'border-rose-500/40',
      indicatorColor: 'bg-rose-400',
    },
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center space-x-2.5">
          <Scale className="w-7 h-7 text-emerald" />
          <span>{t.bmi.title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          {t.bmi.subtitle}
        </p>
      </div>

      {/* Main Input Card */}
      <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-soft space-y-5">
        {/* Unit Selector Toggle */}
        <div className="flex p-1 rounded-xl bg-navy-elevated border border-navy-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setUnit('metric');
              setBmiResult(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              unit === 'metric'
                ? 'bg-emerald text-navy-bg font-bold shadow-glow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t.bmi.metricUnits}
          </button>
          <button
            type="button"
            onClick={() => {
              setUnit('imperial');
              setBmiResult(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              unit === 'imperial'
                ? 'bg-emerald text-navy-bg font-bold shadow-glow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t.bmi.imperialUnits}
          </button>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          {unit === 'metric' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Height cm */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  {t.bmi.heightLabel} (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  placeholder={t.bmi.cmPlaceholder}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald/60"
                  required
                />
              </div>

              {/* Weight kg */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  {t.bmi.weightLabel} (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="500"
                  placeholder={t.bmi.kgPlaceholder}
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald/60"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Height ft + in */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  {t.bmi.heightLabel} (ft & in)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    placeholder={t.bmi.feetLabel}
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald/60"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    placeholder={t.bmi.inchesLabel}
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald/60"
                  />
                </div>
              </div>

              {/* Weight lb */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  {t.bmi.weightLabel} (lb)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="40"
                  max="1000"
                  placeholder="e.g. 140"
                  value={weightLb}
                  onChange={(e) => setWeightLb(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald/60"
                  required
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-xl bg-emerald hover:bg-emerald-light text-navy-bg font-black text-sm shadow-glow-sm inline-flex items-center justify-center space-x-2 transition"
            >
              <span>{t.bmi.calculateBtn}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-4 rounded-xl border border-navy-border bg-navy-elevated text-text-muted hover:text-text-primary text-xs font-semibold transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.bmi.resetBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Calculated Result Card */}
      <AnimatePresence>
        {bmiResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-premium space-y-6"
          >
            {/* Primary Value & Category Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block mb-0.5">
                  {t.bmi.yourBmi}
                </span>
                <div className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
                  {formatNumber(bmiResult.bmi)}
                </div>
              </div>

              <div
                className={`px-4 py-2.5 rounded-xl border text-center sm:text-right ${
                  categoryDetails[bmiResult.category].bgColor
                } ${categoryDetails[bmiResult.category].borderColor}`}
              >
                <span className="text-[11px] font-medium text-text-muted block uppercase tracking-wider">
                  {t.bmi.categoryLabel}
                </span>
                <span
                  className={`text-base font-extrabold ${
                    categoryDetails[bmiResult.category].textColor
                  }`}
                >
                  {categoryDetails[bmiResult.category].label}
                </span>
              </div>
            </div>

            {/* Visual BMI Range Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-[11px] font-semibold text-text-muted">
                <span>{t.bmi.rangeUnderweight}</span>
                <span>{t.bmi.rangeHealthy}</span>
                <span>{t.bmi.rangeOverweight}</span>
                <span>{t.bmi.rangeObesity}</span>
              </div>

              {/* Segmented Color Bar */}
              <div className="relative h-3.5 rounded-full overflow-hidden flex bg-navy-elevated">
                <div className="h-full bg-sky-500/70" style={{ width: '25%' }} title={t.bmi.underweight} />
                <div className="h-full bg-emerald" style={{ width: '25%' }} title={t.bmi.healthy} />
                <div className="h-full bg-amber-500/80" style={{ width: '25%' }} title={t.bmi.overweight} />
                <div className="h-full bg-rose-500/80" style={{ width: '25%' }} title={t.bmi.obesity} />
              </div>

              {/* Indicator Arrow Pin */}
              <div className="relative h-4">
                <div
                  className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${markerPercent}%` }}
                >
                  <div className="w-2.5 h-2.5 rotate-45 bg-text-primary shadow-sm" />
                </div>
              </div>
            </div>

            {/* Practical Suggestion Box */}
            <div className="p-4 rounded-xl bg-navy-elevated border border-navy-border/80 flex items-start space-x-3 text-xs text-text-secondary">
              <Sparkles className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-text-primary block font-bold">
                  {categoryDetails[bmiResult.category].label}
                </strong>
                <p className="leading-relaxed">
                  {categoryDetails[bmiResult.category].suggestion}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pregnancy Safety Note (Always visible / highlighted) */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex items-start space-x-3 text-xs ${
          calculation.isValid
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            : 'bg-navy-surface border-navy-border text-text-secondary'
        }`}
      >
        <ShieldAlert
          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            calculation.isValid ? 'text-amber-400' : 'text-emerald'
          }`}
        />
        <div className="space-y-1">
          <strong className="font-bold text-text-primary block">
            {t.bmi.pregnancyNoticeTitle}
          </strong>
          <p className="leading-relaxed">
            {t.bmi.pregnancyNotice}
          </p>
        </div>
      </div>

      {/* Informational Disclaimer */}
      <div className="p-4 rounded-xl bg-navy-surface border border-navy-border text-center text-xs text-text-muted">
        <p>{t.bmi.informationalDisclaimer}</p>
      </div>
    </div>
  );
}
