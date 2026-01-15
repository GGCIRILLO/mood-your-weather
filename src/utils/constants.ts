// ============================================
// APP CONSTANTS
// ============================================

/**
 * Weather emoji mapping with metadata
 */
export const MOOD_EMOJIS = [
  { emoji: "☀️", label: "Sunny", sentiment: 1.0, intensity: 80 },
  { emoji: "⛅", label: "Partly Cloudy", sentiment: 0.5, intensity: 60 },
  { emoji: "☁️", label: "Cloudy", sentiment: 0.0, intensity: 40 },
  { emoji: "🌧️", label: "Rainy", sentiment: -0.5, intensity: 50 },
  { emoji: "⛈️", label: "Stormy", sentiment: -0.8, intensity: 90 },
  { emoji: "🌈", label: "Rainbow", sentiment: 0.9, intensity: 70 },
  { emoji: "🌙", label: "Moon", sentiment: 0.3, intensity: 30 },
  { emoji: "⚡", label: "Lightning", sentiment: 0.6, intensity: 85 },
  { emoji: "❄️", label: "Snow", sentiment: -0.3, intensity: 45 },
  { emoji: "🌪️", label: "Tornado", sentiment: -0.9, intensity: 95 },
] as const;

/**
 * Onboarding slides content
 */
export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: "Weather Metaphor",
    description:
      "Le tue emozioni sono come il meteo—a volte soleggiate, a volte tempestose, sempre in cambiamento.",
    emoji: "🌦️",
    backgroundGradient: ["#87CEEB", "#FFA500"],
  },
  {
    id: 2,
    title: "Drag & Drop Tutorial",
    description:
      "Trascina le emoji meteo sulla canvas per esprimere come ti senti in questo momento.",
    emoji: "☀️",
    backgroundGradient: ["#FFD700", "#FF6347"],
  },
  {
    id: 3,
    title: "Pattern Discovery",
    description:
      "Scopri i pattern nelle tue emozioni nel tempo e impara a conoscere meglio te stesso.",
    emoji: "📊",
    backgroundGradient: ["#9370DB", "#4169E1"],
  },
] as const;

/**
 * Activity suggestions mock data
 */
export const ACTIVITY_SUGGESTIONS = [
  {
    id: "meditation-1",
    type: "meditation" as const,
    title: "Meditazione del Respiro",
    description:
      "Calma la mente con una pratica guidata di respirazione consapevole.",
    duration: 10,
    icon: "🧘",
  },
  {
    id: "exercise-1",
    type: "exercise" as const,
    title: "Camminata Energizzante",
    description: "Ricarica le energie con una breve passeggiata all'aperto.",
    duration: 20,
    icon: "🚶",
  },
  {
    id: "journaling-1",
    type: "journaling" as const,
    title: "Journaling Riflessivo",
    description: "Scrivi i tuoi pensieri e sentimenti per elaborarli meglio.",
    duration: 15,
    icon: "📝",
  },
  {
    id: "breathing-1",
    type: "breathing" as const,
    title: "Respirazione 4-7-8",
    description: "Tecnica di respirazione per ridurre stress e ansia.",
    duration: 5,
    icon: "🌬️",
  },
  {
    id: "social-1",
    type: "social" as const,
    title: "Contatta un Amico",
    description: "Condividi i tuoi pensieri con qualcuno di cui ti fidi.",
    duration: 30,
    icon: "💬",
  },
] as const;

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATION = {
  SPLASH: 2000,
  FADE: 300,
  SLIDE: 400,
  RIPPLE: 600,
  BOUNCE: 800,
} as const;

/**
 * API endpoints (mock for now)
 */
export const API_ENDPOINTS = {
  WEATHER: "https://api.openweathermap.org/data/2.5/weather",
  GEOCODING: "https://api.openweathermap.org/geo/1.0/direct",
} as const;

/**
 * Environment variables (to be moved to .env)
 */
export const ENV = {
  WEATHER_API_KEY: process.env.EXPO_PUBLIC_WEATHER_API_KEY || "demo-key",
} as const;

/**
 * Glassmorphism style constants
 */
export const GLASS_STYLE = {
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.2)",
} as const;
