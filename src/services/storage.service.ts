import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  User,
  OnboardingState,
  MoodEntry,
  STORAGE_KEYS as StorageKeysType,
} from "@/types";
import { STORAGE_KEYS } from "@/types";

/**
 * Generic storage operations
 */
class StorageService {
  /**
   * Save data to AsyncStorage
   */
  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  }

  /**
   * Get data from AsyncStorage
   */
  private async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  private async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw new Error(`Failed to remove ${key}`);
    }
  }

  /**
   * Clear all app data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw new Error("Failed to clear storage");
    }
  }

  // ============================================
  // ONBOARDING
  // ============================================

  async getOnboardingState(): Promise<OnboardingState> {
    const state = await this.getItem<OnboardingState>(STORAGE_KEYS.ONBOARDING);
    return state || { completed: false };
  }

  async setOnboardingCompleted(): Promise<void> {
    const state: OnboardingState = {
      completed: true,
      completedAt: new Date().toISOString(),
    };
    await this.setItem(STORAGE_KEYS.ONBOARDING, state);
  }

  async resetOnboarding(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.ONBOARDING);
  }

  // ============================================
  // USER
  // ============================================

  async getUser(): Promise<User | null> {
    return await this.getItem<User>(STORAGE_KEYS.USER);
  }

  async saveUser(user: User): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER, user);
  }

  async removeUser(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.USER);
  }

  // ============================================
  // MOOD ENTRIES
  // ============================================

  async getMoodEntries(): Promise<MoodEntry[]> {
    const entries = await this.getItem<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES);
    return entries || [];
  }

  async saveMoodEntry(entry: MoodEntry): Promise<void> {
    const entries = await this.getMoodEntries();
    const updatedEntries = [entry, ...entries]; // Newest first
    await this.setItem(STORAGE_KEYS.MOOD_ENTRIES, updatedEntries);
  }

  async updateMoodEntry(
    id: string,
    updates: Partial<MoodEntry>
  ): Promise<void> {
    const entries = await this.getMoodEntries();
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, ...updates } : entry
    );
    await this.setItem(STORAGE_KEYS.MOOD_ENTRIES, updatedEntries);
  }

  async deleteMoodEntry(id: string): Promise<void> {
    const entries = await this.getMoodEntries();
    const filteredEntries = entries.filter((entry) => entry.id !== id);
    await this.setItem(STORAGE_KEYS.MOOD_ENTRIES, filteredEntries);
  }

  async getMoodEntryById(id: string): Promise<MoodEntry | null> {
    const entries = await this.getMoodEntries();
    return entries.find((entry) => entry.id === id) || null;
  }

  /**
   * Get mood entries for a specific date range
   */
  async getMoodEntriesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<MoodEntry[]> {
    const entries = await this.getMoodEntries();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  /**
   * Get last N mood entries
   */
  async getRecentMoodEntries(count: number = 7): Promise<MoodEntry[]> {
    const entries = await this.getMoodEntries();
    return entries.slice(0, count);
  }

  // ============================================
  // AUTH TOKEN (for future API integration)
  // ============================================

  async getAuthToken(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  async saveAuthToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async removeAuthToken(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
}

// Export singleton instance
export const storageService = new StorageService();
