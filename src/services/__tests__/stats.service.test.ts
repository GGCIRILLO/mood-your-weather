import { getUserStats } from "../stats.service";
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

describe("StatsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user stats correctly", async () => {
    const mockStats = {
      totalEntries: 42,
      currentStreak: 5,
      dominantMood: "sunny",
      patterns: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockStats),
    });

    const result = await getUserStats();

    expect(result).toEqual(mockStats);
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/stats/user/user-123`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      }),
    );
  });

  it("should propagate error on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({ detail: "Stats not found" }),
    });

    await expect(getUserStats()).rejects.toThrow("Stats not found");
  });

  it("should handle handleApiResponse error without details", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockRejectedValue(new Error()),
    });

    await expect(getUserStats()).rejects.toThrow("API Error: 500");
  });

  it("should throw if user not logged in", async () => {
    const originalUser = auth.currentUser;
    (auth as any).currentUser = null;
    await expect(getUserStats()).rejects.toThrow("User not authenticated");
    (auth as any).currentUser = originalUser;
  });

  it("should throw if userId is missing", async () => {
    const originalUser = auth.currentUser;
    (auth as any).currentUser = {
      uid: null,
      getIdToken: jest.fn().mockResolvedValue("token"),
    };
    await expect(getUserStats()).rejects.toThrow("User ID not found");
    (auth as any).currentUser = originalUser;
  });

  it("should handle getIdToken error", async () => {
    const originalUser = auth.currentUser;
    (auth as any).currentUser = {
      uid: "123",
      getIdToken: jest.fn().mockRejectedValue(new Error("Token error")),
    };
    await expect(getUserStats()).rejects.toThrow("Token error");
    (auth as any).currentUser = originalUser;
  });
});
