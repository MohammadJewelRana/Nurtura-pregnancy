'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PregnancyProfile, PregnancyCalculationResult } from '@/types/pregnancy';
import { getSavedProfile, saveProfile } from '@/lib/storage/local-storage';
import { calculatePregnancy } from '@/lib/pregnancy/pregnancy-calculator';

interface PregnancyContextProps {
  profile: PregnancyProfile | null;
  calculation: PregnancyCalculationResult;
  isInitialized: boolean;
  updateProfile: (profile: PregnancyProfile) => void;
  clearProfile: () => void;
  refreshData: () => void;
}

const PregnancyContext = createContext<PregnancyContextProps | undefined>(undefined);

export function PregnancyProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadData = useCallback(() => {
    const saved = getSavedProfile();
    setProfile(saved);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateProfile = (newProfile: PregnancyProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const clearProfile = () => {
    setProfile(null);
    saveProfile(null);
  };

  const calculation = calculatePregnancy(profile);

  return (
    <PregnancyContext.Provider
      value={{
        profile,
        calculation,
        isInitialized,
        updateProfile,
        clearProfile,
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
