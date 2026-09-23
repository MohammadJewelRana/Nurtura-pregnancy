import { get, set, del, entries } from 'idb-keyval';
import { MemoryPhoto } from '@/types/pregnancy';

const MEMORY_PREFIX = 'memory_week_';

export async function saveMemoryPhoto(photo: MemoryPhoto): Promise<boolean> {
  try {
    await set(`${MEMORY_PREFIX}${photo.id}`, photo);
    return true;
  } catch (error) {
    console.error('Failed to save photo to IndexedDB:', error);
    return false;
  }
}

export async function getMemoryPhotos(): Promise<MemoryPhoto[]> {
  try {
    const allEntries = await entries();
    const photos: MemoryPhoto[] = [];
    for (const [key, value] of allEntries) {
      if (typeof key === 'string' && key.startsWith(MEMORY_PREFIX)) {
        photos.push(value as MemoryPhoto);
      }
    }
    return photos.sort((a, b) => b.weekNumber - a.weekNumber);
  } catch (error) {
    console.warn('Failed to load photos from IndexedDB:', error);
    return [];
  }
}

export async function deleteMemoryPhoto(id: string): Promise<boolean> {
  try {
    await del(`${MEMORY_PREFIX}${id}`);
    return true;
  } catch (error) {
    console.error('Failed to delete photo from IndexedDB:', error);
    return false;
  }
}
