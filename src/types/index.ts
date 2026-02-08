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
 * Weather types for mood tracking
 */
export type MoodEmojiType =
  | "sunny" // Sunny - positive, energetic
  | "partly" // Partly cloudy - neutral, balanced
  | "cloudy" // Cloudy - calm, reflective
  | "rainy" // Rainy - sad, melancholic
  | "stormy"; // Stormy - anxious, stressed

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
  externalWeather?: {
    temp: number;
    feels_like: number;
    humidity: number;
    weather_main: string;
    weather_description: string;
    icon: string;
  };
  location?: {
    lat: number;
    lon: number;
  };
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

/**
 * NLP Analysis response from backend
 */
export interface NLPAnalyzeResponse {
  sentiment: "positive" | "negative" | "neutral";
  score: number; // -1 to 1
  magnitude: number;
  emojis_suggested: string[];
}

/**
 * Mood entry with NLP analysis
 */
export interface MoodEntryWithNLP {
  mood: MoodEntry;
  nlpAnalysis: NLPAnalyzeResponse;
}

/**
 * Paginated list of mood entries with NLP analysis
 */
export interface MoodListWithNLP {
  items: MoodEntryWithNLP[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Export challenges types
export * from "./challenges";
