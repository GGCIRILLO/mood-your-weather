import { WEATHER_TYPE_TO_EMOJI } from "../utils/constants";
import {
  calculateAverageSentiment,
  findClosestEmojiType,
  getMoodLabel,
} from "../components/calendar/utils";

describe("Utility Logic", () => {
  describe("WEATHER_TYPE_TO_EMOJI", () => {
    it("should map types to correct emojis", () => {
      expect(WEATHER_TYPE_TO_EMOJI.sunny).toBe("☀️");
      expect(WEATHER_TYPE_TO_EMOJI.stormy).toBe("⛈️");
    });
  });

  describe("Calendar Utils - sentiment", () => {
    it("should calculate average sentiment correctly", () => {
      expect(calculateAverageSentiment(["sunny", "sunny"] as any)).toBe(1.0);
      expect(calculateAverageSentiment(["sunny", "cloudy"] as any)).toBe(0.5);
      expect(calculateAverageSentiment(["rainy", "stormy"] as any)).toBeCloseTo(
        -0.65,
      );
      expect(calculateAverageSentiment([])).toBe(0);
    });

    it("should find closest emoji type for sentiment", () => {
      expect(findClosestEmojiType(0.9)).toBe("sunny");
      expect(findClosestEmojiType(0.1)).toBe("cloudy");
      expect(findClosestEmojiType(-0.4)).toBe("rainy");
      expect(findClosestEmojiType(-0.9)).toBe("stormy");
    });

    it("should return correct labels", () => {
      expect(getMoodLabel("sunny")).toBe("Sunny & Energetic");
      expect(getMoodLabel("stormy")).toBe("Stormy & Intense");
      expect(getMoodLabel("unknown" as any)).toBe("Mixed Feelings");
    });
  });
});
