import {
  formatTime,
  formatDurationForList,
  loadAudioDurations,
} from "../audioUtils";
import { Audio } from "expo-av";

// Mock expo-av
jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

describe("audioUtils", () => {
  describe("formatTime", () => {
    it("should return 00:00 for zero or null millis", () => {
      expect(formatTime(0)).toBe("00:00");
      expect(formatTime(null as any)).toBe("00:00");
    });

    it("should format short durations (MM:SS)", () => {
      expect(formatTime(65000)).toBe("01:05");
      expect(formatTime(9500)).toBe("00:09");
    });

    it("should format long durations (H:MM:SS)", () => {
      // 1 hour, 2 minutes, 5 seconds = (3600 + 120 + 5) * 1000 = 3725000
      expect(formatTime(3725000)).toBe("1:02:05");
      // 10 hours, 0 minutes, 9 seconds
      expect(formatTime(36000000 + 9000)).toBe("10:00:09");
    });
  });

  describe("formatDurationForList", () => {
    it("should return -- for zero or null millis", () => {
      expect(formatDurationForList(0)).toBe("--");
    });

    it("should format minutes only", () => {
      expect(formatDurationForList(60000)).toBe("1 min");
      expect(formatDurationForList(300000)).toBe("5 min");
    });

    it("should format hours and minutes", () => {
      expect(formatDurationForList(3600000)).toBe("1 hr 0 min");
      expect(formatDurationForList(3900000)).toBe("1 hr 5 min");
      expect(formatDurationForList(7200000 + 120000)).toBe("2 hr 2 min");
    });
  });

  describe("loadAudioDurations", () => {
    it("should load durations correctly", async () => {
      const mockSound = {
        getStatusAsync: jest.fn().mockResolvedValue({
          isLoaded: true,
          durationMillis: 120000,
        }),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
      };
      (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
        sound: mockSound,
      });

      const sources = [
        { id: 1, audio: "path/to/audio1.mp3" },
        { id: 2, audio: "path/to/audio2.mp3" },
      ];

      const result = await loadAudioDurations(sources);

      expect(result).toEqual({
        1: "2 min",
        2: "2 min",
      });
      expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(2);
      expect(mockSound.unloadAsync).toHaveBeenCalledTimes(2);
    });

    it("should handle errors gracefully", async () => {
      const consoleSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      (Audio.Sound.createAsync as jest.Mock).mockRejectedValue(
        new Error("Loading failed"),
      );

      const sources = [{ id: 1, audio: "bad/path.mp3" }];
      const result = await loadAudioDurations(sources);

      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error loading duration for id:",
        1,
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });

    it("should skip durations if status is not loaded", async () => {
      const mockSound = {
        getStatusAsync: jest.fn().mockResolvedValue({
          isLoaded: false,
        }),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
      };
      (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
        sound: mockSound,
      });

      const sources = [{ id: 1, audio: "path/to/audio.mp3" }];
      const result = await loadAudioDurations(sources);

      expect(result).toEqual({});
      expect(mockSound.unloadAsync).toHaveBeenCalled();
    });
  });
});
