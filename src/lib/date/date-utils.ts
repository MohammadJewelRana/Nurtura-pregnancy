import {
  parseISO,
  format,
  isValid,
  differenceInCalendarDays,
  addDays,
  subDays,
  startOfDay,
} from 'date-fns';

const BANGLA_DIGITS: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const BANGLA_MONTHS: string[] = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

/**
 * Converts English digits in a string or number to Bengali digits.
 */
export function toBanglaDigits(num: number | string): string {
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => BANGLA_DIGITS[digit] || digit);
}

/**
 * Normalizes a date or date string into a local midnight Date object (00:00:00.000).
 * Prevents UTC timezone jumps when parsing 'YYYY-MM-DD'.
 */
export function parseLocalDate(dateInput: string | Date | null | undefined): Date | null {
  if (!dateInput) return null;

  if (typeof dateInput === 'string') {
    // If it's a YYYY-MM-DD string
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // 0-indexed
      const day = parseInt(match[3], 10);
      const date = new Date(year, month, day, 0, 0, 0, 0);
      return isValid(date) ? date : null;
    }

    const parsed = parseISO(dateInput);
    return isValid(parsed) ? startOfDay(parsed) : null;
  }

  if (dateInput instanceof Date && isValid(dateInput)) {
    return startOfDay(dateInput);
  }

  return null;
}

/**
 * Converts Date object to standard YYYY-MM-DD string.
 */
export function toDateString(date: Date | null | undefined): string {
  if (!date || !isValid(date)) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Gets today's local midnight date.
 */
export function getTodayDate(): Date {
  return startOfDay(new Date());
}

/**
 * Formats date into readable format: "15 Dec 2026" or "১৫ ডিসেম্বর ২০২৬"
 */
export function formatFriendlyDate(
  dateInput: string | Date | null | undefined,
  locale: 'en' | 'bn' = 'en',
  options: { includeYear?: boolean; shortMonth?: boolean } = { includeYear: true, shortMonth: false }
): string {
  const date = parseLocalDate(dateInput);
  if (!date) return '';

  const day = date.getDate();
  const monthIdx = date.getMonth();
  const year = date.getFullYear();

  if (locale === 'bn') {
    const bnDay = toBanglaDigits(day);
    const bnMonth = BANGLA_MONTHS[monthIdx];
    const bnYear = toBanglaDigits(year);
    return options.includeYear ? `${bnDay} ${bnMonth}, ${bnYear}` : `${bnDay} ${bnMonth}`;
  }

  const monthFormat = options.shortMonth ? 'MMM' : 'MMMM';
  const pattern = options.includeYear ? `d ${monthFormat} yyyy` : `d ${monthFormat}`;
  return format(date, pattern);
}

/**
 * Calculates calendar day difference (targetDate - baseDate).
 */
export function diffDays(targetDate: Date, baseDate: Date): number {
  return differenceInCalendarDays(startOfDay(targetDate), startOfDay(baseDate));
}

/**
 * Adds calendar days safely.
 */
export function addCalendarDays(baseDate: Date, days: number): Date {
  return addDays(startOfDay(baseDate), days);
}

/**
 * Subtracts calendar days safely.
 */
export function subCalendarDays(baseDate: Date, days: number): Date {
  return subDays(startOfDay(baseDate), days);
}
