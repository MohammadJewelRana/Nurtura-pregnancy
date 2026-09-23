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

// Key mappings supporting both current Nurtura keys and backward-compatible legacy keys
const STORAGE_KEYS = {
  VERSION: 'nurtura_storage_version',
  LEGACY_VERSION: 'motherly_storage_version',
  LANGUAGE: 'nurtura_language',
  LEGACY_LANGUAGE: 'motherly_language',
  PROFILE: 'nurtura_profile',
  LEGACY_PROFILE: 'motherly_profile',
  KICKS: 'nurtura_kick_sessions',
  LEGACY_KICKS: 'motherly_kick_sessions',
  WEIGHT: 'nurtura_weight_records',
  LEGACY_WEIGHT: 'motherly_weight_records',
  WATER: 'nurtura_water_logs',
  LEGACY_WATER: 'motherly_water_logs',
  MOOD: 'nurtura_mood_logs',
  LEGACY_MOOD: 'motherly_mood_logs',
  JOURNAL: 'nurtura_journal_entries',
  LEGACY_JOURNAL: 'motherly_journal_entries',
  APPOINTMENTS: 'nurtura_appointments',
  LEGACY_APPOINTMENTS: 'motherly_appointments',
  CHECKLISTS: 'nurtura_checklists',
  LEGACY_CHECKLISTS: 'motherly_checklists',
  HOSPITAL_BAG: 'nurtura_hospital_bag',
  LEGACY_HOSPITAL_BAG: 'motherly_hospital_bag',
  FAVORITE_NAMES: 'nurtura_fav_names',
  LEGACY_FAVORITE_NAMES: 'motherly_fav_names',
};

const CURRENT_VERSION = '1.1.0';

// In-memory fallback if localStorage is blocked by private mode or quota
const memoryStore = new Map<string, string>();

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

/**
 * Safely retrieves an item from localStorage with in-memory fallback
 * and backward-compatible legacy key inspection.
 */
function safeGetItem<T>(primaryKey: string, legacyKey: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  // 1. Try primary key from localStorage
  try {
    const raw = localStorage.getItem(primaryKey);
    if (raw !== null) {
      return JSON.parse(raw) as T;
    }
  } catch (error) {
    console.warn(`[Storage] Error reading localStorage key "${primaryKey}":`, error);
  }

  // 2. Try legacy key from localStorage if primary not found
  try {
    const legacyRaw = localStorage.getItem(legacyKey);
    if (legacyRaw !== null) {
      const parsed = JSON.parse(legacyRaw) as T;
      // Auto-migrate to primary key for future reads
      safeSetItem(primaryKey, legacyKey, parsed);
      return parsed;
    }
  } catch (error) {
    console.warn(`[Storage] Error reading legacy key "${legacyKey}":`, error);
  }

  // 3. Try in-memory fallback
  try {
    const memVal = memoryStore.get(primaryKey) || memoryStore.get(legacyKey);
    if (memVal !== undefined) {
      return JSON.parse(memVal) as T;
    }
  } catch {
    // Return default fallback
  }

  return fallback;
}

/**
 * Safely writes an item to localStorage and legacy key to maintain dual compatibility,
 * with graceful in-memory fallback if storage quota is exceeded or in private mode.
 */
function safeSetItem<T>(primaryKey: string, legacyKey: string, value: T): boolean {
  if (typeof window === 'undefined') return false;

  let stringified: string;
  try {
    stringified = JSON.stringify(value);
  } catch (err) {
    console.error(`[Storage] Failed to stringify value for key "${primaryKey}":`, err);
    return false;
  }

  // Save to memory store first as guarantee
  memoryStore.set(primaryKey, stringified);
  memoryStore.set(legacyKey, stringified);

  try {
    localStorage.setItem(primaryKey, stringified);
    // Also set legacy key for backward compatibility
    localStorage.setItem(legacyKey, stringified);
    return true;
  } catch (error) {
    // Handle QuotaExceededError or private browsing restrictions
    console.warn(`[Storage] LocalStorage unavailable or quota exceeded for "${primaryKey}". Using memory store.`, error);
    return false;
  }
}

/**
 * Migration helper to ensure user data remains safe across versions
 */
export function runStorageMigration(): void {
  if (typeof window === 'undefined') return;

  try {
    const storedVersion = safeGetItem<string>(
      STORAGE_KEYS.VERSION,
      STORAGE_KEYS.LEGACY_VERSION,
      '0.0.0'
    );

    if (storedVersion !== CURRENT_VERSION) {
      // Migrate all known legacy keys to primary keys
      const pairs = [
        [STORAGE_KEYS.PROFILE, STORAGE_KEYS.LEGACY_PROFILE],
        [STORAGE_KEYS.LANGUAGE, STORAGE_KEYS.LEGACY_LANGUAGE],
        [STORAGE_KEYS.KICKS, STORAGE_KEYS.LEGACY_KICKS],
        [STORAGE_KEYS.WEIGHT, STORAGE_KEYS.LEGACY_WEIGHT],
        [STORAGE_KEYS.WATER, STORAGE_KEYS.LEGACY_WATER],
        [STORAGE_KEYS.MOOD, STORAGE_KEYS.LEGACY_MOOD],
        [STORAGE_KEYS.JOURNAL, STORAGE_KEYS.LEGACY_JOURNAL],
        [STORAGE_KEYS.APPOINTMENTS, STORAGE_KEYS.LEGACY_APPOINTMENTS],
        [STORAGE_KEYS.CHECKLISTS, STORAGE_KEYS.LEGACY_CHECKLISTS],
        [STORAGE_KEYS.HOSPITAL_BAG, STORAGE_KEYS.LEGACY_HOSPITAL_BAG],
        [STORAGE_KEYS.FAVORITE_NAMES, STORAGE_KEYS.LEGACY_FAVORITE_NAMES],
      ];

      for (const [primary, legacy] of pairs) {
        try {
          const legacyVal = localStorage.getItem(legacy);
          const currentVal = localStorage.getItem(primary);
          if (legacyVal && !currentVal) {
            localStorage.setItem(primary, legacyVal);
          }
        } catch {
          // ignore error during migration
        }
      }

      // Mark version updated
      safeSetItem(STORAGE_KEYS.VERSION, STORAGE_KEYS.LEGACY_VERSION, CURRENT_VERSION);
    }
  } catch (error) {
    console.warn('[Storage] Migration warning:', error);
  }
}

// ----------------------------------------------------
// Public Accessors
// ----------------------------------------------------

// Language
export function getSavedLanguage(): Language {
  return safeGetItem<Language>(STORAGE_KEYS.LANGUAGE, STORAGE_KEYS.LEGACY_LANGUAGE, 'en');
}

export function saveLanguage(lang: Language): void {
  safeSetItem(STORAGE_KEYS.LANGUAGE, STORAGE_KEYS.LEGACY_LANGUAGE, lang);
}

// Profile
export function getSavedProfile(): PregnancyProfile | null {
  return safeGetItem<PregnancyProfile | null>(STORAGE_KEYS.PROFILE, STORAGE_KEYS.LEGACY_PROFILE, null);
}

export function saveProfile(profile: PregnancyProfile | null): void {
  safeSetItem(STORAGE_KEYS.PROFILE, STORAGE_KEYS.LEGACY_PROFILE, profile);
}

// Kicks
export function getSavedKicks(): KickSession[] {
  return safeGetItem<KickSession[]>(STORAGE_KEYS.KICKS, STORAGE_KEYS.LEGACY_KICKS, []);
}

export function saveKicks(kicks: KickSession[]): void {
  safeSetItem(STORAGE_KEYS.KICKS, STORAGE_KEYS.LEGACY_KICKS, kicks);
}

// Weight
export function getSavedWeight(): WeightRecord[] {
  return safeGetItem<WeightRecord[]>(STORAGE_KEYS.WEIGHT, STORAGE_KEYS.LEGACY_WEIGHT, []);
}

export function saveWeight(weights: WeightRecord[]): void {
  safeSetItem(STORAGE_KEYS.WEIGHT, STORAGE_KEYS.LEGACY_WEIGHT, weights);
}

// Water
export function getSavedWaterLogs(): Record<string, WaterLog> {
  return safeGetItem<Record<string, WaterLog>>(STORAGE_KEYS.WATER, STORAGE_KEYS.LEGACY_WATER, {});
}

export function saveWaterLogs(logs: Record<string, WaterLog>): void {
  safeSetItem(STORAGE_KEYS.WATER, STORAGE_KEYS.LEGACY_WATER, logs);
}

// Mood
export function getSavedMoods(): MoodLog[] {
  return safeGetItem<MoodLog[]>(STORAGE_KEYS.MOOD, STORAGE_KEYS.LEGACY_MOOD, []);
}

export function saveMoods(moods: MoodLog[]): void {
  safeSetItem(STORAGE_KEYS.MOOD, STORAGE_KEYS.LEGACY_MOOD, moods);
}

// Journal
export function getSavedJournal(): JournalEntry[] {
  return safeGetItem<JournalEntry[]>(STORAGE_KEYS.JOURNAL, STORAGE_KEYS.LEGACY_JOURNAL, []);
}

export function saveJournal(entries: JournalEntry[]): void {
  safeSetItem(STORAGE_KEYS.JOURNAL, STORAGE_KEYS.LEGACY_JOURNAL, entries);
}

// Appointments
export function getSavedAppointments(): Appointment[] {
  return safeGetItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, STORAGE_KEYS.LEGACY_APPOINTMENTS, []);
}

export function saveAppointments(appointments: Appointment[]): void {
  safeSetItem(STORAGE_KEYS.APPOINTMENTS, STORAGE_KEYS.LEGACY_APPOINTMENTS, appointments);
}

// Checklists
export function getSavedChecklists(): ChecklistItem[] {
  return safeGetItem<ChecklistItem[]>(STORAGE_KEYS.CHECKLISTS, STORAGE_KEYS.LEGACY_CHECKLISTS, []);
}

export function saveChecklists(items: ChecklistItem[]): void {
  safeSetItem(STORAGE_KEYS.CHECKLISTS, STORAGE_KEYS.LEGACY_CHECKLISTS, items);
}

// Hospital Bag
export function getSavedHospitalBag(): HospitalBagItem[] {
  return safeGetItem<HospitalBagItem[]>(STORAGE_KEYS.HOSPITAL_BAG, STORAGE_KEYS.LEGACY_HOSPITAL_BAG, []);
}

export function saveHospitalBag(items: HospitalBagItem[]): void {
  safeSetItem(STORAGE_KEYS.HOSPITAL_BAG, STORAGE_KEYS.LEGACY_HOSPITAL_BAG, items);
}

// Baby Name Favorites
export function getFavoriteNames(): string[] {
  return safeGetItem<string[]>(STORAGE_KEYS.FAVORITE_NAMES, STORAGE_KEYS.LEGACY_FAVORITE_NAMES, []);
}

export function saveFavoriteNames(names: string[]): void {
  safeSetItem(STORAGE_KEYS.FAVORITE_NAMES, STORAGE_KEYS.LEGACY_FAVORITE_NAMES, names);
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
    const currentLang = getSavedLanguage();

    const keysToRemove = [
      STORAGE_KEYS.PROFILE,
      STORAGE_KEYS.LEGACY_PROFILE,
      STORAGE_KEYS.KICKS,
      STORAGE_KEYS.LEGACY_KICKS,
      STORAGE_KEYS.WEIGHT,
      STORAGE_KEYS.LEGACY_WEIGHT,
      STORAGE_KEYS.WATER,
      STORAGE_KEYS.LEGACY_WATER,
      STORAGE_KEYS.MOOD,
      STORAGE_KEYS.LEGACY_MOOD,
      STORAGE_KEYS.JOURNAL,
      STORAGE_KEYS.LEGACY_JOURNAL,
      STORAGE_KEYS.APPOINTMENTS,
      STORAGE_KEYS.LEGACY_APPOINTMENTS,
      STORAGE_KEYS.CHECKLISTS,
      STORAGE_KEYS.LEGACY_CHECKLISTS,
      STORAGE_KEYS.HOSPITAL_BAG,
      STORAGE_KEYS.LEGACY_HOSPITAL_BAG,
      STORAGE_KEYS.FAVORITE_NAMES,
      STORAGE_KEYS.LEGACY_FAVORITE_NAMES,
    ];

    for (const key of keysToRemove) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
      memoryStore.delete(key);
    }

    saveLanguage(currentLang);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}
