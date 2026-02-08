import {
  createMood,
  getMoods,
  updateMood,
  deleteMood,
  getMood,
  getJournalMoods,
} from "../mood.service";
import { auth } from "../../config/firebaseConfig";
import { API_BASE_URL } from "../../config/api";

jest.mock("../../config/firebaseConfig", () => ({
  auth: {
    currentUser: {
      uid: "user-123",
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    },
  },
}));

global.fetch = jest.fn();

describe("MoodService", () => {
  const mockMoodData = {
    emojis: ["sunny"] as any,
    intensity: 8,
    note: "Great day!",
  };

  const mockApiResponse = {
    entryId: "entry-1",
    userId: "user-123",
    timestamp: "2024-01-01T12:00:00Z",
    emojis: ["sunny"],
    intensity: 8,
    note: "Great day!",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as any).currentUser = {
      uid: "user-123",
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    };
  });

  describe("createMood", () => {
    it("should create a mood entry successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await createMood(mockMoodData);

      expect(result.id).toBe("entry-1");
      expect(result.intensity).toBe(8);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/moods`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token",
          }),
        }),
      );
    });

    it("should throw error if not authenticated", async () => {
      (auth as any).currentUser = null;
      await expect(createMood(mockMoodData)).rejects.toThrow(
        "User not authenticated",
      );
    });
  });

  describe("getMoods", () => {
    it("should fetch moods with pagination and filters", async () => {
      const mockItems = [mockApiResponse];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          items: mockItems,
          total: 1,
          hasMore: false,
        }),
      });

      const result = await getMoods({
        limit: 10,
        startDate: "2024-01-01",
        endDate: "2024-01-02",
        offset: 0,
      });

      expect(result.items).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("startDate=2024-01-01"),
        expect.any(Object),
      );
    });

    it("should handle error in getMoods", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );
      await expect(getMoods()).rejects.toThrow("Network error");
    });
  });

  describe("getMood", () => {
    it("should fetch a single mood entry", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await getMood("entry-1");

      expect(result.id).toBe("entry-1");
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/moods/entry-1`,
        expect.any(Object),
      );
    });
  });

  describe("getJournalMoods", () => {
    it("should fetch journal moods with NLP", async () => {
      const mockJournalResponse = {
        items: [{ mood: mockApiResponse, nlp: {} }],
        summary: {},
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockJournalResponse),
      });

      const result = await getJournalMoods({ limit: 5 });

      expect(result).toEqual(mockJournalResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/moods/journal?limit=5"),
        expect.any(Object),
      );
    });

    it("should handle error in getJournalMoods", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Journal error"),
      );
      await expect(getJournalMoods()).rejects.toThrow("Journal error");
    });
  });

  describe("updateMood", () => {
    it("should update a mood entry", async () => {
      const updatedData = { intensity: 10 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ ...mockApiResponse, intensity: 10 }),
      });

      const result = await updateMood("1", updatedData);

      expect(result.intensity).toBe(10);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/moods/1`,
        expect.objectContaining({ method: "PUT" }),
      );
    });
  });

  describe("deleteMood", () => {
    it("should delete a mood entry", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: jest.fn().mockResolvedValue(null),
      });

      await deleteMood("1");

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/moods/1`,
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  describe("Error Handling & Helpers", () => {
    it("should throw error if getIdToken fails", async () => {
      // Re-mock currentUser for this specific test to ensure it fails
      const originalUser = auth.currentUser;
      (auth as any).currentUser = {
        uid: "user-123",
        getIdToken: jest.fn().mockRejectedValue(new Error("Token error")),
      };

      await expect(getMoods()).rejects.toThrow("Token error");

      // Cleanup
      (auth as any).currentUser = originalUser;
    });

    it("should handle API errors with detail message", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ detail: "Custom error message" }),
      });

      await expect(getMoods()).rejects.toThrow("Custom error message");
    });

    it("should handle API errors without detail message", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValue(new Error("Json parse error")),
      });

      await expect(getMoods()).rejects.toThrow("API Error: 500");
    });

    it("should throw error if userId is missing during creation", async () => {
      (auth as any).currentUser = {
        getIdToken: jest.fn().mockResolvedValue("mock-token"),
        uid: null,
      };
      await expect(createMood(mockMoodData)).rejects.toThrow(
        "User ID not found",
      );
    });
  });
});
