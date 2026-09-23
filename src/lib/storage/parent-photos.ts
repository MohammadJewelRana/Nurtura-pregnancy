import { get, set, del } from 'idb-keyval';

export type ParentPhotoType = 'mother' | 'father';

const DB_KEY_MOTHER = 'nurtura_parent_photo_mother';
const DB_KEY_FATHER = 'nurtura_parent_photo_father';

// In-memory fallback in case IndexedDB is unavailable or restricted
const inMemoryCache = new Map<ParentPhotoType, string | null>();

function getDbKey(type: ParentPhotoType): string {
  return type === 'mother' ? DB_KEY_MOTHER : DB_KEY_FATHER;
}

export function hasCachedParentPhoto(type: ParentPhotoType): boolean {
  return Boolean(inMemoryCache.get(type));
}

/**
 * Compresses an image file on the client using an offscreen canvas.
 * Restricts maximum dimension to 600px and exports at 85% JPEG quality.
 */
export async function compressImage(
  file: File | Blob,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return resolve('');
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image file'));
      img.onload = () => {
        try {
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to uncompressed dataUrl if canvas 2D context fails
            return resolve(reader.result as string);
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as compressed JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('[ParentPhoto] Compression error, using original:', err);
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Saves a parent photo to IndexedDB with in-memory fallback.
 */
export async function saveParentPhoto(
  type: ParentPhotoType,
  dataUrl: string
): Promise<boolean> {
  inMemoryCache.set(type, dataUrl);

  if (typeof window === 'undefined') return true;

  try {
    await set(getDbKey(type), dataUrl);
    return true;
  } catch (error) {
    console.warn(`[IndexedDB] Failed to save ${type} photo to IndexedDB:`, error);
    return true;
  }
}

/**
 * Retrieves a parent photo from IndexedDB with in-memory fallback.
 */
export async function getParentPhoto(type: ParentPhotoType): Promise<string | null> {
  if (inMemoryCache.has(type)) {
    const cached = inMemoryCache.get(type);
    if (cached) return cached;
  }

  if (typeof window === 'undefined') return null;

  try {
    const data = await get<string>(getDbKey(type));
    if (data) {
      inMemoryCache.set(type, data);
      return data;
    }
    return null;
  } catch (error) {
    console.warn(`[IndexedDB] Failed to get ${type} photo from IndexedDB:`, error);
    return inMemoryCache.get(type) || null;
  }
}

/**
 * Deletes a parent photo from IndexedDB and memory.
 */
export async function deleteParentPhoto(type: ParentPhotoType): Promise<boolean> {
  inMemoryCache.delete(type);

  if (typeof window === 'undefined') return true;

  try {
    await del(getDbKey(type));
    return true;
  } catch (error) {
    console.warn(`[IndexedDB] Failed to delete ${type} photo from IndexedDB:`, error);
    return true;
  }
}

/**
 * Clears all parent photos from IndexedDB and memory.
 */
export async function clearAllParentPhotos(): Promise<boolean> {
  inMemoryCache.clear();

  if (typeof window === 'undefined') return true;

  try {
    await Promise.allSettled([
      del(DB_KEY_MOTHER),
      del(DB_KEY_FATHER),
    ]);
    return true;
  } catch (error) {
    console.warn('[IndexedDB] Failed to clear all parent photos:', error);
    return true;
  }
}
