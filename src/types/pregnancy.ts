export type Language = 'en' | 'bn';

export type Trimester = 1 | 2 | 3;

export interface PregnancyProfile {
  id: string;
  name?: string;
  lmpDate?: string; // YYYY-MM-DD
  doctorEdd?: string; // YYYY-MM-DD
  cycleLengthDays?: number; // default 28
  firstTimeMother?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PregnancyCalculationResult {
  hasProfile: boolean;
  hasLmp: boolean;
  hasDoctorEdd: boolean;
  primaryEdd: Date | null;
  primaryEddString: string | null;
  calculatedEdd: Date | null;
  calculatedEddString: string | null;
  doctorEdd: Date | null;
  doctorEddString: string | null;
  isUsingDoctorEdd: boolean;
  datesDiffer: boolean;
  dateDifferenceDays: number;
  
  // Gestational age
  gestationalDays: number;
  currentWeek: number;
  currentDay: number;
  
  // Progress
  progressPercent: number;
  daysRemaining: number;
  isOverdue: boolean;
  overdueDays: number;
  isDueToday: boolean;
  
  // Stages
  trimester: Trimester;
  trimesterName: string;
  approximateMonth: number;
  
  // Week range
  currentWeekStart: Date | null;
  currentWeekEnd: Date | null;
  
  // Milestone
  currentMilestoneKey: string;
  
  // Status check
  isValid: boolean;
  errorMessage?: string;
}

export interface WeekContent {
  week: number;
  babySizeEn: string;
  babySizeBn: string;
  fruitComparisonEn: string;
  fruitComparisonBn: string;
  approxLengthCm: number;
  approxWeightGrams: number;
  babyDevelopmentEn: string;
  babyDevelopmentBn: string;
  motherChangesEn: string;
  motherChangesBn: string;
  wellnessTipEn: string;
  wellnessTipBn: string;
  milestoneEn: string;
  milestoneBn: string;
  prepSuggestionEn: string;
  prepSuggestionBn: string;
}

export interface KickSession {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO
  count: number;
  durationMinutes?: number;
  notes?: string;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  glasses: number; // 250ml per glass
  goalGlasses: number; // default 8
}

export type MoodType = 'great' | 'good' | 'okay' | 'low' | 'difficult';

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  symptoms?: string[];
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  weekNumber?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  doctorName: string;
  providerOrClinic?: string;
  location?: string;
  notes?: string;
  weekNumber?: number;
  isCompleted?: boolean;
}

export interface ChecklistItem {
  id: string;
  category: 'first-trimester' | 'second-trimester' | 'third-trimester' | 'hospital' | 'baby' | 'documents';
  titleEn: string;
  titleBn: string;
  isCompleted: boolean;
  isCustom?: boolean;
}

export interface HospitalBagItem {
  id: string;
  category: 'mother' | 'baby' | 'documents' | 'personal';
  titleEn: string;
  titleBn: string;
  isPacked: boolean;
  isCustom?: boolean;
}

export interface MemoryPhoto {
  id: string;
  weekNumber: number;
  date: string;
  caption: string;
  imageDataUrl: string; // stored in IndexedDB
}

export interface BabyName {
  id: string;
  name: string;
  banglaName: string;
  meaningEn: string;
  meaningBn: string;
  gender: 'boy' | 'girl' | 'unisex';
  origin: string;
}

export interface FaqItem {
  id: string;
  category: string;
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
}
