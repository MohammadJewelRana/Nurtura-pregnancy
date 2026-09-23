'use client';

import React, { useState } from 'react';
import {
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePregnancy } from '@/context/PregnancyContext';
import { calculateDateOnCalendar } from '@/lib/pregnancy/pregnancy-calculator';
import { getTodayDate } from '@/lib/date/date-utils';
import { getWeekData } from '@/data/pregnancy-weeks/weeks-data';

export function PregnancyCalendar() {
  const { t, language, formatDate, formatNumber } = useLanguage();
  const { profile, calculation } = usePregnancy();

  const [currentMonth, setCurrentMonth] = useState<Date>(getTodayDate());
  const [selectedDate, setSelectedDate] = useState<Date>(getTodayDate());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    const today = getTodayDate();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Calculation on selected date
  const selectedDateStats = calculateDateOnCalendar(profile, selectedDate);
  const weekData = selectedDateStats ? getWeekData(selectedDateStats.week) : null;

  const weekDayLabels = language === 'bn'
    ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!calculation.isValid) {
    return (
      <div className="p-8 text-center bg-navy-surface rounded-2xl border border-navy-border shadow-premium space-y-3">
        <AlertCircle className="w-10 h-10 text-emerald mx-auto mb-3" />
        <h3 className="text-lg font-bold text-text-primary mb-1">
          {t.setup.welcomeTitle}
        </h3>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
          {t.setup.welcomeSubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-200">
      {/* Calendar Grid Section */}
      <div className="lg:col-span-2 p-5 sm:p-7 bg-navy-surface rounded-2xl border border-navy-border shadow-premium">
        {/* Month Header & Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-navy-border bg-navy-elevated text-text-primary hover:border-emerald/40 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base sm:text-lg font-bold text-text-primary px-2">
              {formatDate(currentMonth, { includeYear: true, shortMonth: false })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-navy-border bg-navy-elevated text-text-primary hover:border-emerald/40 transition"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3.5 py-1.5 rounded-xl bg-navy-elevated border border-navy-border text-emerald hover:border-emerald/40 text-xs font-semibold transition"
          >
            {t.calendar.todayBtn}
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
          {weekDayLabels.map((day, idx) => (
            <div key={idx} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day, idx) => {
            const isCurrentM = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, getTodayDate());
            const dayStats = calculateDateOnCalendar(profile, day);

            // Due date marker
            const isEdd = calculation.primaryEdd && isSameDay(day, calculation.primaryEdd);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`relative min-h-[52px] sm:min-h-[64px] p-1.5 rounded-xl border transition text-xs flex flex-col justify-between items-center ${
                  isSelected
                    ? 'bg-emerald border-emerald text-navy-bg font-black shadow-glow-emerald'
                    : isToday
                    ? 'bg-navy-elevated border-emerald text-emerald font-bold'
                    : isCurrentM
                    ? 'bg-navy-elevated/40 border-navy-border/60 text-text-primary hover:bg-navy-elevated hover:border-emerald/40'
                    : 'bg-transparent border-transparent text-text-muted opacity-30'
                }`}
              >
                <span className="text-xs sm:text-sm">
                  {formatNumber(day.getDate())}
                </span>

                {/* Gestational indicator pill */}
                {dayStats && dayStats.week >= 1 && dayStats.week <= 42 && isCurrentM && (
                  <span
                    className={`text-[9px] px-1 py-0.5 rounded-md truncate max-w-full font-bold ${
                      isSelected
                        ? 'bg-navy-bg/25 text-navy-bg'
                        : isEdd
                        ? 'bg-emerald text-navy-bg font-extrabold'
                        : 'text-emerald'
                    }`}
                  >
                    {isEdd ? 'EDD' : `W${formatNumber(dayStats.week)}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details Panel */}
      <div className="p-6 bg-navy-surface rounded-2xl border border-navy-border shadow-premium flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center space-x-2 text-emerald mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.calendar.selectedDate}
            </span>
          </div>

          <h3 className="text-xl font-bold text-text-primary">
            {formatDate(selectedDate)}
          </h3>

          {selectedDateStats ? (
            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-4 rounded-xl bg-navy-elevated border border-navy-border">
                <span className="text-text-muted block mb-0.5">{t.calendar.gestationalAgeOnDate}</span>
                <span className="text-base font-extrabold text-text-primary">
                  {formatNumber(selectedDateStats.week)} {t.common.weeks} {formatNumber(selectedDateStats.day)} {t.common.days}
                </span>
                <span className="block mt-1 text-[11px] text-emerald font-semibold">
                  {selectedDateStats.trimester === 1
                    ? t.common.firstTrimester
                    : selectedDateStats.trimester === 2
                    ? t.common.secondTrimester
                    : t.common.thirdTrimester}
                </span>
              </div>

              {weekData && (
                <div className="p-4 rounded-xl bg-navy-elevated border border-navy-border">
                  <span className="text-emerald block mb-1 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-accent" />
                    {t.calendar.milestoneNotice}
                  </span>
                  <p className="text-text-secondary leading-relaxed">
                    {language === 'bn' ? weekData.milestoneBn : weekData.milestoneEn}
                  </p>
                  <p className="mt-2 text-[11px] text-emerald font-bold">
                    {language === 'bn' ? `তুলনা: ${weekData.fruitComparisonBn}` : `Size: ${weekData.fruitComparisonEn}`}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl bg-navy-elevated text-xs text-text-muted">
              {language === 'bn'
                ? 'এই তারিখটি আপনার গর্ভকালের সময়সীমার বাইরে।'
                : 'This date falls outside your current active pregnancy timeline.'}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-navy-border text-xs text-text-muted">
          <p>
            {language === 'bn'
              ? 'ক্যালেন্ডারে যেকোনো দিন নির্বাচন করে ঐ দিনের গর্ভকালীন অগ্রগতি দেখতে পারেন।'
              : 'Tap any calendar date to project and view your exact gestational progress.'}
          </p>
        </div>
      </div>
    </div>
  );
}
