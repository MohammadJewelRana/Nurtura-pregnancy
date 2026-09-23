import {
  PregnancyProfile,
  KickSession,
  WeightRecord,
  WaterLog,
  MoodLog,
  JournalEntry,
  Appointment,
  ChecklistItem,
  HospitalBagItem,
  Language,
} from '@/types/pregnancy';

const STORAGE_KEYS = {
  VERSION: 'motherly_storage_version',
  LANGUAGE: 'motherly_language',
  PROFILE: 'motherly_profile',
  KICKS: 'motherly_kick_sessions',
  WEIGHT: 'motherly_weight_records',
  WATER: 'motherly_water_logs',
  MOOD: 'motherly_mood_logs',
  JOURNAL: 'motherly_journal_entries',
  APPOINTMENTS: 'motherly_appointments',
  CHECKLISTS: 'motherly_checklists',
  HOSPITAL_BAG: 'motherly_hospital_bag',
  FAVORITE_NAMES: 'motherly_fav_names',
};

const CURRENT_VERSION = '1.0.0';

export interface AppExportData {
  version: string;
  exportedAt: string;
  language: Language;
  profile: PregnancyProfile | null;
  kicks: KickSession[];
  weight: WeightRecord[];
  water: Record<string, WaterLog>;
  mood: MoodLog[];
  journal: JournalEntry[];
  appointments: Appointment[];
  checklists: ChecklistItem[];
  hospitalBag: HospitalBagItem[];
  favoriteNames: string[];
}

function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving localStorage key "${key}":`, error);
    return false;
  }
}

// Language
export function getSavedLanguage(): Language {
  return safeGetItem<Language>(STORAGE_KEYS.LANGUAGE, 'en');
}

export function saveLanguage(lang: Language): void {
  safeSetItem(STORAGE_KEYS.LANGUAGE, lang);
}

// Profile
export function getSavedProfile(): PregnancyProfile | null {
  return safeGetItem<PregnancyProfile | null>(STORAGE_KEYS.PROFILE, null);
}

export function saveProfile(profile: PregnancyProfile | null): void {
  safeSetItem(STORAGE_KEYS.PROFILE, profile);
}

// Kicks
export function getSavedKicks(): KickSession[] {
  return safeGetItem<KickSession[]>(STORAGE_KEYS.KICKS, []);
}

export function saveKicks(kicks: KickSession[]): void {
  safeSetItem(STORAGE_KEYS.KICKS, kicks);
}

// Weight
export function getSavedWeight(): WeightRecord[] {
  return safeGetItem<WeightRecord[]>(STORAGE_KEYS.WEIGHT, []);
}

export function saveWeight(weights: WeightRecord[]): void {
  safeSetItem(STORAGE_KEYS.WEIGHT, weights);
}

// Water
export function getSavedWaterLogs(): Record<string, WaterLog> {
  return safeGetItem<Record<string, WaterLog>>(STORAGE_KEYS.WATER, {});
}

export function saveWaterLogs(logs: Record<string, WaterLog>): void {
  safeSetItem(STORAGE_KEYS.WATER, logs);
}

// Mood
export function getSavedMoods(): MoodLog[] {
  return safeGetItem<MoodLog[]>(STORAGE_KEYS.MOOD, []);
}

export function saveMoods(moods: MoodLog[]): void {
  safeSetItem(STORAGE_KEYS.MOOD, moods);
}

// Journal
export function getSavedJournal(): JournalEntry[] {
  return safeGetItem<JournalEntry[]>(STORAGE_KEYS.JOURNAL, []);
}

export function saveJournal(entries: JournalEntry[]): void {
  safeSetItem(STORAGE_KEYS.JOURNAL, entries);
}

// Appointments
export function getSavedAppointments(): Appointment[] {
  return safeGetItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
}

export function saveAppointments(appointments: Appointment[]): void {
  safeSetItem(STORAGE_KEYS.APPOINTMENTS, appointments);
}

// Checklists
export function getSavedChecklists(): ChecklistItem[] {
  return safeGetItem<ChecklistItem[]>(STORAGE_KEYS.CHECKLISTS, []);
}

export function saveChecklists(items: ChecklistItem[]): void {
  safeSetItem(STORAGE_KEYS.CHECKLISTS, items);
}

// Hospital Bag
export function getSavedHospitalBag(): HospitalBagItem[] {
  return safeGetItem<HospitalBagItem[]>(STORAGE_KEYS.HOSPITAL_BAG, []);
}

export function saveHospitalBag(items: HospitalBagItem[]): void {
  safeSetItem(STORAGE_KEYS.HOSPITAL_BAG, items);
}

// Baby Name Favorites
export function getFavoriteNames(): string[] {
  return safeGetItem<string[]>(STORAGE_KEYS.FAVORITE_NAMES, []);
}

export function saveFavoriteNames(names: string[]): void {
  safeSetItem(STORAGE_KEYS.FAVORITE_NAMES, names);
}

// Export All Data
export function exportAllData(): AppExportData {
  return {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    language: getSavedLanguage(),
    profile: getSavedProfile(),
    kicks: getSavedKicks(),
    weight: getSavedWeight(),
    water: getSavedWaterLogs(),
    mood: getSavedMoods(),
    journal: getSavedJournal(),
    appointments: getSavedAppointments(),
    checklists: getSavedChecklists(),
    hospitalBag: getSavedHospitalBag(),
    favoriteNames: getFavoriteNames(),
  };
}

// Import All Data
export function importAllData(data: unknown): { success: boolean; message: string } {
  try {
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Invalid data format: Expected JSON object.' };
    }

    const payload = data as Partial<AppExportData>;

    if (payload.profile !== undefined) saveProfile(payload.profile);
    if (payload.language && (payload.language === 'en' || payload.language === 'bn')) {
      saveLanguage(payload.language);
    }
    if (Array.isArray(payload.kicks)) saveKicks(payload.kicks);
    if (Array.isArray(payload.weight)) saveWeight(payload.weight);
    if (payload.water && typeof payload.water === 'object') saveWaterLogs(payload.water);
    if (Array.isArray(payload.mood)) saveMoods(payload.mood);
    if (Array.isArray(payload.journal)) saveJournal(payload.journal);
    if (Array.isArray(payload.appointments)) saveAppointments(payload.appointments);
    if (Array.isArray(payload.checklists)) saveChecklists(payload.checklists);
    if (Array.isArray(payload.hospitalBag)) saveHospitalBag(payload.hospitalBag);
    if (Array.isArray(payload.favoriteNames)) saveFavoriteNames(payload.favoriteNames);

    return { success: true, message: 'Data imported successfully!' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown import error',
    };
  }
}

// Clear All Data
export function clearAllLocalData(): void {
  if (typeof window === 'undefined') return;
  try {
    const keysToPreserve = [STORAGE_KEYS.LANGUAGE];
    const currentLang = getSavedLanguage();

    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.KICKS);
    localStorage.removeItem(STORAGE_KEYS.WEIGHT);
    localStorage.removeItem(STORAGE_KEYS.WATER);
    localStorage.removeItem(STORAGE_KEYS.MOOD);
    localStorage.removeItem(STORAGE_KEYS.JOURNAL);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.CHECKLISTS);
    localStorage.removeItem(STORAGE_KEYS.HOSPITAL_BAG);
    localStorage.removeItem(STORAGE_KEYS.FAVORITE_NAMES);

    saveLanguage(currentLang);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}
