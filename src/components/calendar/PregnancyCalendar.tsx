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
      <div className="p-8 text-center bg-white dark:bg-[#1E1722] rounded-3xl border border-[#EFE8DE] dark:border-[#332537] shadow-subtle">
        <AlertCircle className="w-10 h-10 text-dustyRose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-plum-950 dark:text-white mb-1">
          {t.setup.welcomeTitle}
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 max-w-md mx-auto">
          {t.setup.welcomeSubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid Section */}
      <div className="lg:col-span-2 p-5 sm:p-7 bg-white dark:bg-[#1E1722] rounded-3xl border border-[#EFE8DE] dark:border-[#332537] shadow-subtle">
        {/* Month Header & Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700 bg-ivory-50 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-plum-50 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base sm:text-lg font-bold text-plum-950 dark:text-white px-2">
              {formatDate(currentMonth, { includeYear: true, shortMonth: false })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-[#EFE8DE] dark:border-charcoal-700 bg-ivory-50 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-plum-50 transition"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3.5 py-1.5 rounded-xl bg-plum-100/70 dark:bg-plum-950/60 text-plum-800 dark:text-dustyRose-300 hover:bg-plum-200/80 text-xs font-semibold transition"
          >
            {t.calendar.todayBtn}
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-bold text-charcoal-400 uppercase tracking-wider">
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
                className={`relative min-h-[52px] sm:min-h-[64px] p-1.5 rounded-2xl flex flex-col justify-between items-center transition text-xs ${
                  isSelected
                    ? 'bg-plum-700 text-white font-bold shadow-subtle'
                    : isToday
                    ? 'bg-plum-50 dark:bg-plum-950/40 border border-plum-300 dark:border-plum-800 text-plum-800 dark:text-plum-300 font-semibold'
                    : isCurrentM
                    ? 'bg-ivory-50/70 dark:bg-charcoal-800/30 text-charcoal-800 dark:text-charcoal-200 hover:bg-plum-50/60 dark:hover:bg-charcoal-800'
                    : 'text-charcoal-300 dark:text-charcoal-600 opacity-40'
                }`}
              >
                <span className="text-xs sm:text-sm">
                  {formatNumber(day.getDate())}
                </span>

                {/* Gestational indicator pill */}
                {dayStats && dayStats.week >= 1 && dayStats.week <= 42 && isCurrentM && (
                  <span
                    className={`text-[9px] px-1 py-0.5 rounded-md truncate max-w-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isEdd
                        ? 'bg-champagne-300 text-plum-950 font-extrabold'
                        : 'text-plum-700 dark:text-dustyRose-400 font-medium'
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
      <div className="p-6 bg-white dark:bg-[#1E1722] rounded-3xl border border-[#EFE8DE] dark:border-[#332537] shadow-subtle flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center space-x-2 text-plum-700 dark:text-dustyRose-400 mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.calendar.selectedDate}
            </span>
          </div>

          <h3 className="text-xl font-bold text-plum-950 dark:text-white">
            {formatDate(selectedDate)}
          </h3>

          {selectedDateStats ? (
            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-ivory-100/80 dark:bg-charcoal-800/50 border border-ivory-300 dark:border-charcoal-700">
                <span className="text-charcoal-400 block mb-0.5">{t.calendar.gestationalAgeOnDate}</span>
                <span className="text-base font-extrabold text-plum-950 dark:text-white">
                  {formatNumber(selectedDateStats.week)} {t.common.weeks} {formatNumber(selectedDateStats.day)} {t.common.days}
                </span>
                <span className="block mt-1 text-[11px] text-dustyRose-600 dark:text-dustyRose-400 font-semibold">
                  {selectedDateStats.trimester === 1
                    ? t.common.firstTrimester
                    : selectedDateStats.trimester === 2
                    ? t.common.secondTrimester
                    : t.common.thirdTrimester}
                </span>
              </div>

              {weekData && (
                <div className="p-4 rounded-2xl bg-champagne-50/70 dark:bg-charcoal-800/40 border border-champagne-200/60 dark:border-charcoal-700">
                  <span className="text-champagne-800 dark:text-champagne-400 block mb-1 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-champagne-500" />
                    {t.calendar.milestoneNotice}
                  </span>
                  <p className="text-charcoal-700 dark:text-charcoal-300 font-medium leading-relaxed">
                    {language === 'bn' ? weekData.milestoneBn : weekData.milestoneEn}
                  </p>
                  <p className="mt-2 text-[11px] text-plum-800 dark:text-dustyRose-300 font-bold">
                    {language === 'bn' ? `তুলনা: ${weekData.fruitComparisonBn}` : `Size: ${weekData.fruitComparisonEn}`}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-2xl bg-ivory-100 dark:bg-charcoal-800/40 text-xs text-charcoal-500">
              {language === 'bn'
                ? 'এই তারিখটি আপনার গর্ভকালের সময়সীমার বাইরে।'
                : 'This date falls outside your current active pregnancy timeline.'}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#EFE8DE] dark:border-charcoal-800 text-xs text-charcoal-500 dark:text-charcoal-400">
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
