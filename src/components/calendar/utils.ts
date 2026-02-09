import {
  SunIcon,
  CloudSunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudLightningIcon,
} from "phosphor-react-native";
import type { MoodEmojiType } from "@/types";

// Use the same mappings as RecentPatterns
export const EMOJI_TO_ICON: Record<MoodEmojiType, any> = {
  sunny: SunIcon,
  partly: CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRainIcon,
  stormy: CloudLightningIcon,
};

export const EMOJI_TO_COLOR: Record<MoodEmojiType, string> = {
  sunny: "#fbbf24", // Amber 400
  partly: "#e5e7eb", // Gray 200 - Light gray for readability
  cloudy: "#9ca3af", // Gray 400
  rainy: "#60a5fa", // Blue 400
  stormy: "#a78bfa", // Purple 400
};

const SENTIMENT_MAP: Record<MoodEmojiType, number> = {
  sunny: 1.0,
  partly: 0.5,
  cloudy: 0.0,
  rainy: -0.5,
  stormy: -0.8,
};

export const calculateAverageSentiment = (
  emojiTypes: MoodEmojiType[],
): number => {
  if (!emojiTypes?.length) return 0;
  const total = emojiTypes.reduce(
    (acc, type) => acc + (SENTIMENT_MAP[type] ?? 0),
    0,
  );
  return total / emojiTypes.length;
};

export const findClosestEmojiType = (sentiment: number): MoodEmojiType => {
  let closest: MoodEmojiType = "cloudy";
  let minDist = Infinity;
  for (const [type, emojiSentiment] of Object.entries(SENTIMENT_MAP)) {
    const dist = Math.abs(emojiSentiment - sentiment);
    if (dist < minDist) {
      minDist = dist;
      closest = type as MoodEmojiType;
    }
  }
  return closest;
};

export const getMoodLabel = (type: MoodEmojiType): string => {
  const labels: Record<MoodEmojiType, string> = {
    sunny: "Sunny & Energetic",
    partly: "Partly Cloudy",
    cloudy: "Cloudy & Reflective",
    rainy: "Rainy & Melancholic",
    stormy: "Stormy & Intense",
  };
  return labels[type] || "Mixed Feelings";
};
