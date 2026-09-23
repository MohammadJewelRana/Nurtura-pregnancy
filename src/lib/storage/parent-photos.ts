import { get, set, del } from 'idb-keyval';

export type ParentPhotoType = 'mother' | 'father';

const DB_KEY_MOTHER = 'nurtura_parent_photo_mother';
const DB_KEY_FATHER = 'nurtura_parent_photo_father';

// Active displayable URLs (Object URLs or Data URLs) mapped by type
const activeUrls = new Map<ParentPhotoType, string>();

function getDbKey(type: ParentPhotoType): string {
  return type === 'mother' ? DB_KEY_MOTHER : DB_KEY_FATHER;
}

export function hasCachedParentPhoto(type: ParentPhotoType): boolean {
  return Boolean(activeUrls.get(type));
}

/**
 * Compresses an image file on the client using an offscreen canvas.
 * Returns both a binary JPEG Blob (for IndexedDB) and a Data URL (for instant preview).
 */
export async function compressImageToBlob(
  file: File | Blob,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window not available'));
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
            const rawDataUrl = reader.result as string;
            return resolve({
              blob: file instanceof Blob ? file : new Blob([]),
              dataUrl: rawDataUrl,
            });
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);

          canvas.toBlob(
            (b) => {
              if (b) {
                resolve({ blob: b, dataUrl });
              } else {
                fetch(dataUrl)
                  .then((res) => res.blob())
                  .then((blob) => resolve({ blob, dataUrl }))
                  .catch(() => resolve({ blob: file as Blob, dataUrl }));
              }
            },
            'image/jpeg',
            quality
          );
        } catch (err) {
          console.warn('[ParentPhoto] Canvas compression error:', err);
          const rawDataUrl = reader.result as string;
          resolve({
            blob: file as Blob,
            dataUrl: rawDataUrl,
          });
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Saves a parent photo into IndexedDB as a Blob.
 * Returns a displayable URL (Object URL or Data URL).
 */
export async function saveParentPhoto(
  type: ParentPhotoType,
  photoInput: Blob | File | string
): Promise<string> {
  if (typeof window === 'undefined') return '';

  // Revoke previous Object URL if one existed
  const previousUrl = activeUrls.get(type);
  if (previousUrl && previousUrl.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(previousUrl);
    } catch {
      // ignore
    }
  }

  let finalBlob: Blob;
  let displayUrl: string;

  if (photoInput instanceof Blob) {
    finalBlob = photoInput;
    displayUrl = URL.createObjectURL(photoInput);
  } else if (typeof photoInput === 'string' && photoInput.startsWith('data:')) {
    try {
      const res = await fetch(photoInput);
      finalBlob = await res.blob();
      displayUrl = photoInput;
    } catch {
      finalBlob = new Blob([photoInput], { type: 'text/plain' });
      displayUrl = photoInput;
    }
  } else {
    displayUrl = String(photoInput);
    finalBlob = new Blob([displayUrl], { type: 'text/plain' });
  }

  activeUrls.set(type, displayUrl);

  try {
    await set(getDbKey(type), finalBlob);
  } catch (error) {
    console.warn(`[IndexedDB] Failed to save ${type} photo to IndexedDB:`, error);
  }

  return displayUrl;
}

/**
 * Retrieves a parent photo from IndexedDB.
 * If stored as a Blob, converts it to an Object URL for direct <img> usage.
 */
export async function getParentPhoto(type: ParentPhotoType): Promise<string | null> {
  // If we already have an active displayable URL, return it
  if (activeUrls.has(type)) {
    const cached = activeUrls.get(type);
    if (cached) return cached;
  }

  if (typeof window === 'undefined') return null;

  try {
    const data = await get<Blob | string>(getDbKey(type));
    if (!data) return null;

    if (data instanceof Blob) {
      const objectUrl = URL.createObjectURL(data);
      activeUrls.set(type, objectUrl);
      return objectUrl;
    }

    if (typeof data === 'string' && data.length > 0) {
      activeUrls.set(type, data);
      return data;
    }

    return null;
  } catch (error) {
    console.warn(`[IndexedDB] Failed to get ${type} photo from IndexedDB:`, error);
    return activeUrls.get(type) || null;
  }
}

/**
 * Deletes a parent photo from IndexedDB and cleans up active Object URLs.
 */
export async function deleteParentPhoto(type: ParentPhotoType): Promise<boolean> {
  const previousUrl = activeUrls.get(type);
  if (previousUrl && previousUrl.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(previousUrl);
    } catch {
      // ignore
    }
  }
  activeUrls.delete(type);

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
 * Clears all parent photos from IndexedDB and cleans up all active Object URLs.
 */
export async function clearAllParentPhotos(): Promise<boolean> {
  activeUrls.forEach((url) => {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    }
  });
  activeUrls.clear();

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
