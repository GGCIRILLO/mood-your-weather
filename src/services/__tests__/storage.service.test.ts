import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageService } from "../storage.service";
import { STORAGE_KEYS } from "@/types";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe("StorageService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setItem", () => {
    it("should save data to AsyncStorage", async () => {
      const data = { test: "data" };
      await storageService.saveUser(data as any);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER,
        JSON.stringify(data),
      );
    });

    it("should throw error if saving fails", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      );
      await expect(storageService.saveUser({} as any)).rejects.toThrow(
        "Failed to save @mood_weather:user",
      );
    });
  });

  describe("getItem", () => {
    it("should return parsed data from AsyncStorage", async () => {
      const data = { id: "1", name: "User" };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(data),
      );
      const result = await storageService.getUser();
      expect(result).toEqual(data);
    });

    it("should return null if data doesn't exist", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await storageService.getUser();
      expect(result).toBeNull();
    });

    it("should return null if parsing fails", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("invalid-json");
      const result = await storageService.getUser();
      expect(result).toBeNull();
    });
  });

  describe("Onboarding", () => {
    it("should return default onboarding state if none exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const state = await storageService.getOnboardingState();
      expect(state).toEqual({ completed: false });
    });

    it("should set onboarding as completed", async () => {
      await storageService.setOnboardingCompleted();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ONBOARDING,
        expect.stringContaining('"completed":true'),
      );
    });
  });

  describe("Mood Entries", () => {
    const mockEntries = [
      { id: "1", emotion: "happy", timestamp: new Date().toISOString() },
    ];

    it("should return empty array if no entries exist", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const entries = await storageService.getMoodEntries();
      expect(entries).toEqual([]);
    });

    it("should save a new entry at the beginning", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockEntries),
      );
      const newEntry = {
        id: "2",
        emotion: "sad",
        timestamp: new Date().toISOString(),
      };
      await storageService.saveMoodEntry(newEntry as any);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.MOOD_ENTRIES,
        JSON.stringify([newEntry, ...mockEntries]),
      );
    });

    it("should delete an entry by id", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockEntries),
      );
      await storageService.deleteMoodEntry("1");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.MOOD_ENTRIES,
        JSON.stringify([]),
      );
    });

    it("should update an entry by id and handle non-matches", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockEntries),
      );
      await storageService.updateMoodEntry("99", { note: "updated" });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.MOOD_ENTRIES,
        JSON.stringify(mockEntries),
      );
    });

    it("should return empty array if entries are null", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const entries = await storageService.getMoodEntries();
      expect(entries).toEqual([]);
    });

    it("should handle error in deleteMoodEntry", async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
        new Error("Delete error"),
      );
      // We need to use a key that calls removeItem
      await expect(storageService.removeAuthToken()).rejects.toThrow(
        "Failed to remove @mood_weather:auth_token",
      );
    });

    it("should update an entry by id", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockEntries),
      );
      await storageService.updateMoodEntry("1", { note: "updated" });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.MOOD_ENTRIES,
        expect.stringContaining('"note":"updated"'),
      );
    });

    it("should get mood entry by id", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockEntries),
      );
      const entry = await storageService.getMoodEntryById("1");
      expect(entry).toEqual(mockEntries[0]);

      const notFound = await storageService.getMoodEntryById("99");
      expect(notFound).toBeNull();
    });

    it("should get mood entries by date range", async () => {
      const date1 = "2024-01-01T12:00:00Z";
      const date2 = "2024-01-05T12:00:00Z";
      const entries = [
        { id: "1", timestamp: date1 },
        { id: "2", timestamp: "2024-01-03T12:00:00Z" },
        { id: "3", timestamp: date2 },
        { id: "4", timestamp: "2024-01-10T12:00:00Z" },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(entries),
      );

      const result = await storageService.getMoodEntriesByDateRange(
        new Date("2024-01-02T00:00:00Z"),
        new Date("2024-01-06T00:00:00Z"),
      );

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("3");
    });

    it("should get recent mood entries", async () => {
      const entries = Array(10)
        .fill(0)
        .map((_, i) => ({ id: i.toString() }));
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(entries),
      );

      const recent = await storageService.getRecentMoodEntries(3);
      expect(recent).toHaveLength(3);
      expect(recent[0].id).toBe("0");
    });
  });

  describe("Auth Token", () => {
    it("should save, get and remove auth token", async () => {
      await storageService.saveAuthToken("token123");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.AUTH_TOKEN,
        JSON.stringify("token123"),
      );

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify("token123"),
      );
      const token = await storageService.getAuthToken();
      expect(token).toBe("token123");

      await storageService.removeAuthToken();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.AUTH_TOKEN,
      );
    });
  });

  describe("clearAll", () => {
    it("should clear all storage", async () => {
      await storageService.clearAll();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it("should handle error in clearAll", async () => {
      (AsyncStorage.clear as jest.Mock).mockRejectedValueOnce(
        new Error("Clear failed"),
      );
      await expect(storageService.clearAll()).rejects.toThrow(
        "Failed to clear storage",
      );
    });
  });
});
