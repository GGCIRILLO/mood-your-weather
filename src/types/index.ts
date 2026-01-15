// ============================================
// TYPE DEFINITIONS - MOOD YOUR WEATHER MVP
// ============================================

/**
 * User data structure
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string; // ISO timestamp
}

/**
 * Onboarding state stored in AsyncStorage
 */
export interface OnboardingState {
  completed: boolean;
  completedAt?: string; // ISO timestamp
}

/**
 * Weather emoji types for mood tracking
 */
export type MoodEmojiType =
  | "☀️" // Sunny - positive, energetic
  | "⛅" // Partly cloudy - neutral, balanced
  | "☁️" // Cloudy - calm, reflective
  | "🌧️" // Rainy - sad, melancholic
  | "⛈️" // Stormy - anxious, stressed
  | "🌈" // Rainbow - hopeful, optimistic
  | "🌙" // Moon - peaceful, restful
  | "⚡" // Lightning - energized, excited
  | "❄️" // Snow - cold, isolated
  | "🌪️"; // Tornado - chaotic, overwhelmed

/**
 * Single mood entry
 */
export interface MoodEntry {
  id: string;
  userId: string;
  timestamp: string; // ISO timestamp
  emojis: MoodEmojiType[];
  intensity: number; // 0-100
  note?: string;
  analysis?: MoodAnalysis;
}

/**
 * AI-generated mood analysis (mock for MVP)
 */
export interface MoodAnalysis {
  primaryEmotion: string;
  secondaryEmotions: string[];
  sentimentScore: number; // -1 to 1 (negative to positive)
  suggestions: ActivitySuggestion[];
  patterns?: string[]; // Detected patterns from history
}

/**
 * Suggested activity to improve mood
 */
export interface ActivitySuggestion {
  id: string;
  type: "meditation" | "exercise" | "journaling" | "breathing" | "social";
  title: string;
  description: string;
  duration: number; // minutes
  icon: string; // emoji
}

/**
 * Weather data from external API
 */
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  emoji: MoodEmojiType;
  humidity: number;
  windSpeed: number;
  timestamp: string; // ISO timestamp
}

/**
 * Calendar day with mood data
 */
export interface CalendarDay {
  date: string; // YYYY-MM-DD
  entries: MoodEntry[];
  averageIntensity?: number;
  dominantEmoji?: MoodEmojiType;
}

/**
 * Statistics data for dashboard
 */
export interface MoodStatistics {
  totalEntries: number;
  averageIntensity: number;
  mostFrequentEmoji: MoodEmojiType;
  currentStreak: number; // consecutive days with entries
  longestStreak: number;
  weeklyTrend: "improving" | "declining" | "stable";
}

/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
  ONBOARDING: "@mood_weather:onboarding",
  USER: "@mood_weather:user",
  MOOD_ENTRIES: "@mood_weather:mood_entries",
  AUTH_TOKEN: "@mood_weather:auth_token",
} as const;

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Form validation errors
 */
export interface ValidationErrors {
  [key: string]: string;
}
