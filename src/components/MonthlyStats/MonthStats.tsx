import { format, startOfDay, subDays, startOfMonth, endOfMonth } from "date-fns";
import { WEATHER_TYPE_TO_EMOJI } from "@/utils/constants";
import type { MoodEntry } from "@/types";

export const SENTIMENT_MAP: Record<string, number> = {
  "☀️": 1.0,
  "⛅": 0.5,
  "☁️": 0.0,
  "🌧️": -0.5,
  "⛈️": -0.8,
  "🌈": 0.9,
  "🌙": 0.3,
  "⚡": 0.6,
  "❄️": -0.3,
  "🌪️": -0.9,
};

export function calculateAverageSentiment(emojis: string[]): number {
  if (!emojis.length) return 0;
  return (
    emojis.reduce((acc, e) => acc + (SENTIMENT_MAP[e] ?? 0), 0) / emojis.length
  );
}

export function findClosestEmoji(sentiment: number): string {
  let closest = "☁️";
  let minDist = Infinity;

  for (const [emoji, value] of Object.entries(SENTIMENT_MAP)) {
    const dist = Math.abs(value - sentiment);
    if (dist < minDist) {
      minDist = dist;
      closest = emoji;
    }
  }
  return closest;
}

export function getMonthEntries(
  moods: MoodEntry[],
  date: Date
): MoodEntry[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return moods.filter((m) => {
    const d = new Date(m.timestamp);
    return d >= start && d <= end;
  });
}

export function calculateStreak(moods: MoodEntry[]): number {
  const days = new Set(
    moods.map((m) => format(new Date(m.timestamp), "yyyy-MM-dd"))
  );

  let streak = 0;
  let cursor = startOfDay(new Date());

  while (days.has(format(cursor, "yyyy-MM-dd"))) {
    streak++;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

export function calculatePositivePercent(
  monthMoods: MoodEntry[],
  weatherTypeToEmoji: Record<string, string>
): number {
  const emojis = monthMoods.flatMap((entry) =>
    (entry.emojis || []).map((type) => weatherTypeToEmoji[type] || "☁️")
  );

  const avg = calculateAverageSentiment(emojis);
  return Math.round(((avg + 1) / 2) * 100);
}
