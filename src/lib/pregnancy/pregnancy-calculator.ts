import {
  PregnancyProfile,
  PregnancyCalculationResult,
  Trimester,
} from '@/types/pregnancy';
import {
  parseLocalDate,
  getTodayDate,
  diffDays,
  addCalendarDays,
  subCalendarDays,
  toDateString,
} from '../date/date-utils';

export const TOTAL_PREGNANCY_DAYS = 280; // 40 weeks * 7 days

/**
 * Calculates all pregnancy gestational metrics safely.
 */
export function calculatePregnancy(
  profile: PregnancyProfile | null | undefined,
  referenceDateInput?: Date | string
): PregnancyCalculationResult {
  const referenceDate = referenceDateInput
    ? parseLocalDate(referenceDateInput) || getTodayDate()
    : getTodayDate();

  const emptyResult: PregnancyCalculationResult = {
    hasProfile: false,
    hasLmp: false,
    hasDoctorEdd: false,
    primaryEdd: null,
    primaryEddString: null,
    calculatedEdd: null,
    calculatedEddString: null,
    doctorEdd: null,
    doctorEddString: null,
    isUsingDoctorEdd: false,
    datesDiffer: false,
    dateDifferenceDays: 0,
    gestationalDays: 0,
    currentWeek: 0,
    currentDay: 0,
    progressPercent: 0,
    daysRemaining: 0,
    isOverdue: false,
    overdueDays: 0,
    isDueToday: false,
    trimester: 1,
    trimesterName: 'First Trimester',
    approximateMonth: 1,
    currentWeekStart: null,
    currentWeekEnd: null,
    currentMilestoneKey: 'welcome',
    isValid: false,
    errorMessage: 'No pregnancy dates provided.',
  };

  if (!profile || (!profile.lmpDate && !profile.doctorEdd)) {
    return emptyResult;
  }

  const lmp = parseLocalDate(profile.lmpDate);
  const doctorEdd = parseLocalDate(profile.doctorEdd);

  // Validate LMP not in the future
  if (lmp && diffDays(lmp, referenceDate) > 0) {
    return {
      ...emptyResult,
      hasProfile: true,
      hasLmp: true,
      isValid: false,
      errorMessage: 'LMP date cannot be in the future.',
    };
  }

  // Calculate EDD from LMP
  const calculatedEdd = lmp ? addCalendarDays(lmp, TOTAL_PREGNANCY_DAYS) : null;

  // Determine Primary EDD: Doctor EDD is prioritized
  const isUsingDoctorEdd = Boolean(doctorEdd);
  const primaryEdd = doctorEdd || calculatedEdd;

  if (!primaryEdd) {
    return emptyResult;
  }

  // Check if dates differ
  let datesDiffer = false;
  let dateDifferenceDays = 0;
  if (doctorEdd && calculatedEdd) {
    dateDifferenceDays = diffDays(doctorEdd, calculatedEdd);
    datesDiffer = Math.abs(dateDifferenceDays) > 0;
  }

  // Determine gestational baseline (start date of pregnancy / Day 0)
  // If LMP exists, pregnancy started at LMP.
  // If only doctorEdd exists, assumed baseline is (doctorEdd - 280 days).
  const baselineStartDate = lmp ? lmp : subCalendarDays(primaryEdd, TOTAL_PREGNANCY_DAYS);

  // Calculate gestational days relative to reference date (today)
  const gestationalDays = Math.max(0, diffDays(referenceDate, baselineStartDate));

  // Current Week and Day
  const currentWeek = Math.floor(gestationalDays / 7);
  const currentDay = gestationalDays % 7;

  // Days remaining until primary EDD
  const daysRemaining = diffDays(primaryEdd, referenceDate);
  const isOverdue = daysRemaining < 0;
  const overdueDays = isOverdue ? Math.abs(daysRemaining) : 0;
  const isDueToday = daysRemaining === 0;

  // Progress percentage (0% to 100%)
  const rawProgress = (gestationalDays / TOTAL_PREGNANCY_DAYS) * 100;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawProgress)));

  // Trimester classification:
  // First: weeks 1-13 (days 0 to 90)
  // Second: weeks 14-27 (days 91 to 188)
  // Third: weeks 28-40+ (days 189+)
  let trimester: Trimester = 1;
  let trimesterName = 'First Trimester';
  if (currentWeek >= 28) {
    trimester = 3;
    trimesterName = 'Third Trimester';
  } else if (currentWeek >= 14) {
    trimester = 2;
    trimesterName = 'Second Trimester';
  }

  // Approximate pregnancy month (1 through 9+)
  const approximateMonth = Math.min(10, Math.max(1, Math.floor(gestationalDays / 30) + 1));

  // Week start and end
  const currentWeekStart = addCalendarDays(baselineStartDate, currentWeek * 7);
  const currentWeekEnd = addCalendarDays(currentWeekStart, 6);

  // Milestone identifier
  let currentMilestoneKey = 'early_stage';
  if (currentWeek >= 40) currentMilestoneKey = 'full_term_due';
  else if (currentWeek >= 37) currentMilestoneKey = 'early_term';
  else if (currentWeek >= 32) currentMilestoneKey = 'rapid_growth';
  else if (currentWeek >= 28) currentMilestoneKey = 'third_trimester_begins';
  else if (currentWeek >= 24) currentMilestoneKey = 'viability_milestone';
  else if (currentWeek >= 20) currentMilestoneKey = 'halfway_mark';
  else if (currentWeek >= 16) currentMilestoneKey = 'movement_sensations';
  else if (currentWeek >= 14) currentMilestoneKey = 'second_trimester_begins';
  else if (currentWeek >= 12) currentMilestoneKey = 'first_trimester_milestone';
  else if (currentWeek >= 8) currentMilestoneKey = 'heartbeat_formation';

  return {
    hasProfile: true,
    hasLmp: Boolean(lmp),
    hasDoctorEdd: Boolean(doctorEdd),
    primaryEdd,
    primaryEddString: toDateString(primaryEdd),
    calculatedEdd,
    calculatedEddString: toDateString(calculatedEdd),
    doctorEdd,
    doctorEddString: toDateString(doctorEdd),
    isUsingDoctorEdd,
    datesDiffer,
    dateDifferenceDays,
    gestationalDays,
    currentWeek,
    currentDay,
    progressPercent,
    daysRemaining,
    isOverdue,
    overdueDays,
    isDueToday,
    trimester,
    trimesterName,
    approximateMonth,
    currentWeekStart,
    currentWeekEnd,
    currentMilestoneKey,
    isValid: true,
  };
}

/**
 * Calculates pregnancy stats for a given target calendar date
 * based on user's existing pregnancy profile.
 */
export function calculateDateOnCalendar(
  profile: PregnancyProfile | null | undefined,
  targetDate: Date
): {
  week: number;
  day: number;
  trimester: Trimester;
  isPastDue: boolean;
} | null {
  if (!profile || (!profile.lmpDate && !profile.doctorEdd)) {
    return null;
  }
  const calc = calculatePregnancy(profile, targetDate);
  if (!calc.isValid) return null;

  return {
    week: calc.currentWeek,
    day: calc.currentDay,
    trimester: calc.trimester,
    isPastDue: calc.isOverdue,
  };
}
