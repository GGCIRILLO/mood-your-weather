import { useEffect, useState } from "react";
import { storageService } from "@/services/storage.service";
import type { User, MoodEntry, OnboardingState } from "@/types";

/**
 * Hook to manage onboarding state
 */
export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({ completed: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    setLoading(true);
    const onboardingState = await storageService.getOnboardingState();
    setState(onboardingState);
    setLoading(false);
  };

  const completeOnboarding = async () => {
    await storageService.setOnboardingCompleted();
    setState({ completed: true, completedAt: new Date().toISOString() });
  };

  const resetOnboarding = async () => {
    await storageService.resetOnboarding();
    setState({ completed: false });
  };

  return {
    onboarding: state,
    loading,
    completeOnboarding,
    resetOnboarding,
    isCompleted: state.completed,
  };
}

/**
 * Hook to manage current user
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    const currentUser = await storageService.getUser();
    setUser(currentUser);
    setLoading(false);
  };

  const saveUser = async (userData: User) => {
    await storageService.saveUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    await storageService.removeUser();
    await storageService.removeAuthToken();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    saveUser,
    logout,
    refreshUser: loadUser,
  };
}

/**
 * Hook to manage mood entries
 */
export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    const moodEntries = await storageService.getMoodEntries();
    setEntries(moodEntries);
    setLoading(false);
  };

  const addEntry = async (entry: MoodEntry) => {
    await storageService.saveMoodEntry(entry);
    await loadEntries();
  };

  const updateEntry = async (id: string, updates: Partial<MoodEntry>) => {
    await storageService.updateMoodEntry(id, updates);
    await loadEntries();
  };

  const deleteEntry = async (id: string) => {
    await storageService.deleteMoodEntry(id);
    await loadEntries();
  };

  const getRecentEntries = async (count: number = 7) => {
    return await storageService.getRecentMoodEntries(count);
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refreshEntries: loadEntries,
    getRecentEntries,
  };
}
