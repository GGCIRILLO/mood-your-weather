/**
 * Weekly rhythm data structure
 */
export interface WeeklyRhythm {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

/**
 * Mood pattern data structure
 */
export interface MoodPattern {
  pattern_type: string; // "time_of_day", "weekday", "weather_correlation"
  description: string;
  confidence: number; // 0-1
  occurrences: number;
}

/**
 * User statistics response from backend
 */
export interface UserStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  dominantMood: string | null;
  averageIntensity: number;
  weeklyRhythm: WeeklyRhythm | null;
  patterns: MoodPattern[];
  mindfulMomentsCount: number;
  unlockedBadges: string[];
  lastUpdated: string; // ISO timestamp
}
