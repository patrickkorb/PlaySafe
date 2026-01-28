'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RechnerData, RechnerContextType } from './types';
import { STORAGE_KEY, EXPIRATION_DAYS } from './constants';

const INITIAL_DATA: RechnerData = {
  step: 1,
  insuranceFor: '',
  gender: '',
  sport: '',
  frequency: '',
  birthDate: '',
  name: '',
  email: '',
  phone: '',
  completedAt: null,
  lastUpdated: new Date().toISOString(),
};

const RechnerContext = createContext<RechnerContextType | null>(null);

function isDataExpired(lastUpdated: string): boolean {
  const lastDate = new Date(lastUpdated);
  const now = new Date();
  const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > EXPIRATION_DAYS;
}

function loadFromStorage(): RechnerData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as RechnerData;

    if (isDataExpired(parsed.lastUpdated)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveToStorage(data: RechnerData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save rechner data:', error);
  }
}

export function RechnerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RechnerData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = loadFromStorage();

    if (stored && stored.completedAt) {
      setData({ ...stored, step: 7 });
    }

    setIsLoading(false);
  }, []);

  const updateData = useCallback((updates: Partial<RechnerData>) => {
    setData(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const saveData = useCallback((updates?: Partial<RechnerData>) => {
    const dataToSave = updates
      ? { ...data, ...updates, lastUpdated: new Date().toISOString() }
      : data;

    if (updates) {
      setData(dataToSave);
    }

    saveToStorage(dataToSave);
  }, [data]);

  const nextStep = useCallback(() => {
    setData(prev => ({
      ...prev,
      step: prev.step + 1,
      lastUpdated: new Date().toISOString(),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToStep = useCallback((step: number) => {
    setData(prev => ({
      ...prev,
      step,
      lastUpdated: new Date().toISOString(),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetRechner = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData({ ...INITIAL_DATA, lastUpdated: new Date().toISOString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <RechnerContext.Provider value={{ data, updateData, nextStep, goToStep, resetRechner, saveData, isLoading }}>
      {children}
    </RechnerContext.Provider>
  );
}

export function useRechner(): RechnerContextType {
  const context = useContext(RechnerContext);

  if (!context) {
    throw new Error('useRechner must be used within a RechnerProvider');
  }

  return context;
}
