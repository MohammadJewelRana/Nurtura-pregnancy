'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PregnancyProfile, PregnancyCalculationResult } from '@/types/pregnancy';
import { getSavedProfile, saveProfile } from '@/lib/storage/local-storage';
import { calculatePregnancy } from '@/lib/pregnancy/pregnancy-calculator';
import {
  getParentPhoto,
  saveParentPhoto,
  deleteParentPhoto,
  clearAllParentPhotos,
  ParentPhotoType,
} from '@/lib/storage/parent-photos';

export interface ParentPhotosState {
  mother: string | null;
  father: string | null;
}

interface PregnancyContextProps {
  profile: PregnancyProfile | null;
  calculation: PregnancyCalculationResult;
  isInitialized: boolean;
  parentPhotos: ParentPhotosState;
  updateProfile: (profile: PregnancyProfile) => void;
  clearProfile: () => void;
  updateParentPhoto: (type: ParentPhotoType, photoInput: Blob | string) => Promise<void>;
  removeParentPhoto: (type: ParentPhotoType) => Promise<void>;
  refreshData: () => void;
}

const PregnancyContext = createContext<PregnancyContextProps | undefined>(undefined);

export function PregnancyProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const [parentPhotos, setParentPhotos] = useState<ParentPhotosState>({
    mother: null,
    father: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const loadData = useCallback(() => {
    // 1. Synchronously/locally read profile from localStorage
    try {
      const saved = getSavedProfile();
      setProfile(saved);
    } catch (err) {
      console.warn('[PregnancyContext] Load profile error:', err);
    } finally {
      setIsInitialized(true);
    }

    // 2. Asynchronously load parent photos from IndexedDB without blocking the UI
    if (typeof window !== 'undefined') {
      Promise.allSettled([
        getParentPhoto('mother'),
        getParentPhoto('father'),
      ]).then(([motherRes, fatherRes]) => {
        setParentPhotos({
          mother: motherRes.status === 'fulfilled' ? motherRes.value : null,
          father: fatherRes.status === 'fulfilled' ? fatherRes.value : null,
        });
      });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateProfile = (newProfile: PregnancyProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const clearProfile = async () => {
    setProfile(null);
    saveProfile(null);
    setParentPhotos({ mother: null, father: null });
    await clearAllParentPhotos();
  };

  const updateParentPhoto = async (type: ParentPhotoType, photoInput: Blob | string) => {
    // Persist to IndexedDB and get displayable URL
    const displayUrl = await saveParentPhoto(type, photoInput);
    // Update React state immediately
    setParentPhotos((prev) => ({
      ...prev,
      [type]: displayUrl,
    }));
  };

  const removeParentPhoto = async (type: ParentPhotoType) => {
    // Immediate optimistic state update
    setParentPhotos((prev) => ({
      ...prev,
      [type]: null,
    }));
    // Delete from IndexedDB
    await deleteParentPhoto(type);
  };

  const calculation = calculatePregnancy(profile);

  return (
    <PregnancyContext.Provider
      value={{
        profile,
        calculation,
        isInitialized,
        parentPhotos,
        updateProfile,
        clearProfile,
        updateParentPhoto,
        removeParentPhoto,
        refreshData: loadData,
      }}
    >
      {children}
    </PregnancyContext.Provider>
  );
}

export function usePregnancy() {
  const context = useContext(PregnancyContext);
  if (!context) {
    throw new Error('usePregnancy must be used within a PregnancyProvider');
  }
  return context;
}
