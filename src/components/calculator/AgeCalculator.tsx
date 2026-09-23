'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  Cake,
  RotateCcw,
  ArrowRight,
  Clock,
  Award,
  CalendarDays,
  Gift,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { parseLocalDate, getTodayDate, toDateString } from '@/lib/date/date-utils';
import { differenceInCalendarDays } from 'date-fns';

interface ExactAgeResult {
  years: number;
  months: number;
  days: number;
  totalYears: number;
  totalMonths: number;
  totalDays: number;
  nextBirthday: Date;
  daysToNextBirthday: number;
  isBirthdayToday: boolean;
}

export function AgeCalculator() {
  const { t, language, formatDate, formatNumber } = useLanguage();

  const [dobInput, setDobInput] = useState('');
  const [result, setResult] = useState<ExactAgeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLeapYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!dobInput) {
      setErrorMsg(t.ageCalc.errorInvalid);
      return;
    }

    const dob = parseLocalDate(dobInput);
    if (!dob || isNaN(dob.getTime())) {
      setErrorMsg(t.ageCalc.errorInvalid);
      return;
    }

    const today = getTodayDate();

    if (dob > today) {
      setErrorMsg(t.ageCalc.errorFuture);
      setResult(null);
      return;
    }

    const y1 = dob.getFullYear();
    const m1 = dob.getMonth();
    const d1 = dob.getDate();

    const y2 = today.getFullYear();
    const m2 = today.getMonth();
    const d2 = today.getDate();

    let years = y2 - y1;
    let months = m2 - m1;
    let days = d2 - d1;

    if (days < 0) {
      // Days in previous month
      const prevMonthLastDay = new Date(y2, m2, 0).getDate();
      days += prevMonthLastDay;
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const totalYears = years;
    const totalMonths = years * 12 + months;
    const totalDays = differenceInCalendarDays(today, dob);

    // Next birthday calculation
    let targetBdayYear = y2;
    const bdayMonth = m1;
    const bdayDay = d1;

    let targetBday = new Date(targetBdayYear, bdayMonth, bdayDay);
    if (bdayMonth === 1 && bdayDay === 29 && !isLeapYear(targetBdayYear)) {
      targetBday = new Date(targetBdayYear, 1, 28);
    }

    let isBirthdayToday = false;
    if (differenceInCalendarDays(targetBday, today) === 0) {
      isBirthdayToday = true;
    } else if (targetBday < today) {
      targetBdayYear += 1;
      targetBday = new Date(targetBdayYear, bdayMonth, bdayDay);
      if (bdayMonth === 1 && bdayDay === 29 && !isLeapYear(targetBdayYear)) {
        targetBday = new Date(targetBdayYear, 1, 28);
      }
    }

    const daysToNextBirthday = isBirthdayToday ? 0 : differenceInCalendarDays(targetBday, today);

    setResult({
      years,
      months,
      days,
      totalYears,
      totalMonths,
      totalDays,
      nextBirthday: targetBday,
      daysToNextBirthday,
      isBirthdayToday,
    });
  };

  const handleReset = () => {
    setDobInput('');
    setResult(null);
    setErrorMsg(null);
  };

  const todayStr = toDateString(getTodayDate());

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center space-x-2.5">
          <Cake className="w-7 h-7 text-emerald" />
          <span>{t.ageCalc.title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          {t.ageCalc.subtitle}
        </p>
      </div>

      {/* Input Card */}
      <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-soft space-y-4">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
              {t.ageCalc.dobLabel}
            </label>
            <div className="relative">
              <input
                type="date"
                max={todayStr}
                value={dobInput}
                onChange={(e) => setDobInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-border bg-navy-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald/60"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-xl bg-emerald hover:bg-emerald-light text-navy-bg font-black text-sm shadow-glow-sm inline-flex items-center justify-center space-x-2 transition"
            >
              <span>{t.ageCalc.calculateBtn}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-4 rounded-xl border border-navy-border bg-navy-elevated text-text-muted hover:text-text-primary text-xs font-semibold transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.ageCalc.resetBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Primary Exact Age Card */}
            <div className="p-6 rounded-2xl bg-navy-surface border border-navy-border shadow-premium text-center space-y-4">
              <span className="text-xs font-bold text-emerald uppercase tracking-wider block">
                {t.ageCalc.exactAge}
              </span>

              {/* 3 Metric Badges: Years, Months, Days */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-xl bg-navy-elevated border border-navy-border/80">
                  <div className="text-2xl sm:text-4xl font-black text-text-primary">
                    {formatNumber(result.years)}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-text-muted mt-1 uppercase">
                    {t.ageCalc.years}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-navy-elevated border border-navy-border/80">
                  <div className="text-2xl sm:text-4xl font-black text-text-primary">
                    {formatNumber(result.months)}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-text-muted mt-1 uppercase">
                    {t.ageCalc.months}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-navy-elevated border border-navy-border/80">
                  <div className="text-2xl sm:text-4xl font-black text-text-primary">
                    {formatNumber(result.days)}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-text-muted mt-1 uppercase">
                    {t.ageCalc.days}
                  </div>
                </div>
              </div>

              {result.isBirthdayToday && (
                <div className="p-3 rounded-xl bg-emerald/15 border border-emerald/40 text-emerald font-bold text-xs">
                  {t.ageCalc.todayIsBirthday}
                </div>
              )}
            </div>

            {/* Next Birthday Card */}
            <div className="p-5 rounded-2xl bg-navy-surface border border-navy-border shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-center sm:text-left">
                <div className="p-3 rounded-xl bg-emerald/15 text-emerald flex-shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">
                    {t.ageCalc.nextBirthday}
                  </span>
                  <span className="text-base font-bold text-text-primary">
                    {formatDate(result.nextBirthday)}
                  </span>
                </div>
              </div>

              <div className="px-4 py-2 rounded-xl bg-navy-elevated border border-navy-border text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald">
                  {formatNumber(result.daysToNextBirthday)}
                </div>
                <span className="text-[10px] uppercase font-bold text-text-muted">
                  {t.ageCalc.daysToGo}
                </span>
              </div>
            </div>

            {/* Completed Milestones Grid */}
            <div className="p-5 rounded-2xl bg-navy-surface border border-navy-border shadow-soft space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald" />
                <span>{t.ageCalc.milestonesTitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-navy-elevated border border-navy-border/60">
                  <span className="text-text-muted block mb-0.5">{t.ageCalc.totalYears}</span>
                  <span className="text-base font-bold text-text-primary">
                    {formatNumber(result.totalYears)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-navy-elevated border border-navy-border/60">
                  <span className="text-text-muted block mb-0.5">{t.ageCalc.totalMonths}</span>
                  <span className="text-base font-bold text-text-primary">
                    {formatNumber(result.totalMonths)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-navy-elevated border border-navy-border/60">
                  <span className="text-text-muted block mb-0.5">{t.ageCalc.totalDays}</span>
                  <span className="text-base font-bold text-emerald">
                    {formatNumber(result.totalDays)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Precision calculation note */}
      <div className="p-4 rounded-xl bg-navy-surface border border-navy-border text-xs text-text-muted text-center">
        <p>{t.ageCalc.helperText}</p>
      </div>
    </div>
  );
}
