# 🌦️ Mood Your Weather - AI Coding Guidelines

## Architettura Overview

**Stack**: Expo (React Native 0.81) + TypeScript + NativeWind + TanStack Query + Firebase Auth

```
src/app/                    # Expo Router (file-based routing)
├── (onboarding)/          # Splash + Intro carousel
├── (auth)/                # Login/Signup screens
├── (tabs)/                # Main tab navigation (Dashboard, Calendar, Profile)
├── mood-entry.tsx         # Mood creation canvas
└── mood-analysis.tsx      # Post-creation analysis

src/services/              # Business logic & API integration
src/contexts/              # React Context providers (AuthContext)
src/hooks/                 # Custom hooks (useMoods, useStorage)
src/components/            # UI components organized by feature
```

## Critical Patterns

### 1. Routing & Navigation

- **File-based routing via Expo Router**: Routes mirror `src/app/` structure
- **Route groups**: Use `(folder)` for layout grouping without URL segments (e.g., `(auth)`, `(tabs)`)
- **Navigation**: Import `router` from `expo-router` and use `router.push()`, `router.replace()`, `router.back()`
- **Protected routes**: Check `useAuth()` hook in layouts to guard authenticated screens

### 2. State Management

- **Global state**: React Context for auth (`AuthProvider` in `src/app/_layout.tsx`)
- **Server state**: TanStack Query configured with 5min staleTime, 2 retries (see `src/app/_layout.tsx`)
- **Local persistence**: AsyncStorage via `StorageService` (typed wrapper in `src/services/storage.service.ts`)
- **Mood data**: Custom hooks like `useMoods()` for standardized data fetching

### 3. Styling System

- **NativeWind v5**: Use Tailwind classes via `className` prop (NOT `style`)
- **Animations**: Reanimated v4 for complex animations (see `WeatherDisplay.tsx`)
- **Custom Tailwind**: Extend via `postcss.config.mjs` (Tailwind v4 uses PostCSS config)
- **Icons**: `phosphor-react-native` for all icons (NOT expo-vector-icons)

### 4. Type System

- **Centralized types**: All interfaces in `src/types/index.ts`
- **Weather emojis**: Use `MoodEmojiType` union type (`"sunny" | "partly" | "cloudy" | "rainy" | "stormy"`)
- **Path aliases**: `@/*` resolves to `src/*` (configured in `tsconfig.json`)

### 5. Backend Integration & Auth Token Management

- **API base URL**: `http://127.0.0.1:8000` (change for production)
- **Auth flow**: Custom token signup via API → Firebase `signInWithCustomToken()` (see `auth.service.ts`)
- **Token persistence**: Firebase tokens saved to AsyncStorage after login/signup for offline/fallback access
- **Token fallback strategy**: `getAuthToken()` tries Firebase `getIdToken()` first, falls back to AsyncStorage if network fails
- **Mood operations**: All mood CRUD in `mood.service.ts` with Firebase token headers
- **Error handling**: Use `handleApiResponse()` helper for consistent API error parsing

## Key Files Reference

- **[src/types/index.ts](../src/types/index.ts)**: Master type definitions (MoodEntry, User, MoodAnalysis)
- **[src/services/storage.service.ts](../src/services/storage.service.ts)**: AsyncStorage wrapper with typed methods
- **[src/services/auth.service.ts](../src/services/auth.service.ts)**: Firebase auth + custom token registration
- **[src/services/mood.service.ts](../src/services/mood.service.ts)**: Mood API client (create, get, update, delete)
- **[src/utils/constants.ts](../src/utils/constants.ts)**: Weather emoji mappings, sentiment scores
- **[src/contexts/authContext.tsx](../src/contexts/authContext.tsx)**: Auth state provider with `useAuth()` hook

## Developer Commands

```bash
# Start dev server
npx expo start

# Run on platforms (press in terminal)
i  # iOS Simulator
a  # Android Emulator
w  # Web browser

# Dependencies
bun install              # Install packages (Bun is project's package manager)

# TypeScript check
npx tsc --noEmit        # Type check without compilation
```

## Project-Specific Conventions

1. **Component organization**: Index files export components (`components/dashboard/index.ts`)
2. **Service pattern**: All API/storage logic in `services/`, never in components
3. **Hook naming**: Prefix with `use`, place in `hooks/api/` or `hooks/storage/`
4. **Emoji weather**: Internally use string types (`"sunny"`), display via `WEATHER_TYPE_TO_EMOJI` constant
5. **Timestamps**: Always ISO 8601 strings (`new Date().toISOString()`)
6. **AsyncStorage keys**: Use `STORAGE_KEYS` enum from `types/index.ts`

## Common Gotchas

- **NativeWind**: Must use `className`, not `style` (except for dynamic styles)
- **Expo Router**: Files named `_layout.tsx` are layout wrappers, `index.tsx` are default routes
- **Firebase paths**: Custom path in `tsconfig.json` for `@firebase/auth` React Native compatibility
- **Firebase auth persistence**: Firebase auto-persists auth in AsyncStorage. On network errors, `signIn()` checks `auth.currentUser` first before re-authenticating
- **Firebase token handling**: Always save tokens to AsyncStorage after auth operations. Use fallback pattern in `mood.service.ts` for network-resilient token retrieval
- **Image optimization**: Use `expo-image` component (already imported in project) instead of React Native's Image
- **Development API**: Backend at `127.0.0.1:8000` requires running local server. Check token logs (✅/⚠️/❌ emojis) for auth debugging
- **Image optimization**: Use `expo-image` component (already imported in project) instead of React Native's Image
- **Development API**: Backend at `127.0.0.1:8000` requires running local server. Check token logs (✅/⚠️/❌ emojis) for auth debugging
