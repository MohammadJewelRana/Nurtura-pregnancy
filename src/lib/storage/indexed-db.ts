import { get, set, del, entries } from 'idb-keyval';
import { MemoryPhoto } from '@/types/pregnancy';

const MEMORY_PREFIX = 'nurtura_memory_week_';
const LEGACY_PREFIX = 'memory_week_';

// In-memory fallback if IndexedDB is blocked or throws QuotaExceededError
const inMemoryPhotos = new Map<string, MemoryPhoto>();

export async function saveMemoryPhoto(photo: MemoryPhoto): Promise<boolean> {
  // Always keep in-memory copy
  inMemoryPhotos.set(photo.id, photo);

  if (typeof window === 'undefined') return true;

  try {
    await set(`${MEMORY_PREFIX}${photo.id}`, photo);
    return true;
  } catch (error) {
    console.warn('[IndexedDB] Failed to save photo to IndexedDB. Kept in memory fallback:', error);
    return true; // Still report success since inMemoryPhotos holds it
  }
}

export async function getMemoryPhotos(): Promise<MemoryPhoto[]> {
  const photoMap = new Map<string, MemoryPhoto>();

  // Add in-memory items first
  inMemoryPhotos.forEach((photo, id) => {
    photoMap.set(id, photo);
  });

  if (typeof window !== 'undefined') {
    try {
      const allEntries = await entries();
      for (const [key, value] of allEntries) {
        if (typeof key === 'string' && (key.startsWith(MEMORY_PREFIX) || key.startsWith(LEGACY_PREFIX))) {
          const photo = value as MemoryPhoto;
          if (photo && photo.id) {
            photoMap.set(photo.id, photo);
          }
        }
      }
    } catch (error) {
      console.warn('[IndexedDB] Failed to load photos from IndexedDB. Using in-memory fallback:', error);
    }
  }

  const photosList: MemoryPhoto[] = [];
  photoMap.forEach((photo) => {
    photosList.push(photo);
  });

  return photosList.sort((a, b) => b.weekNumber - a.weekNumber);
}

export async function deleteMemoryPhoto(id: string): Promise<boolean> {
  inMemoryPhotos.delete(id);

  if (typeof window === 'undefined') return true;

  try {
    await del(`${MEMORY_PREFIX}${id}`);
    await del(`${LEGACY_PREFIX}${id}`);
    return true;
  } catch (error) {
    console.warn('[IndexedDB] Failed to delete photo from IndexedDB:', error);
    return true;
  }
}
