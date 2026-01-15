# 🌦️ Mood Your Weather - MVP

App mobile meteo-emotiva per tracciare le tue emozioni attraverso emoji meteo. Costruita con Expo React Native + TypeScript.

## ✨ Features Implementate

### 🎯 Core Flow

- ✅ **Onboarding** (4 schermate)
  - Splash screen con animazione meteo 2s
  - Carousel interattivo con 3 slide swipeable
  - Tutorial Weather Metaphor
- ✅ **Autenticazione Mock**
  - Login/Signup UI completa
  - Validazione form
  - Social sign-in simulato (Google, Apple)
  - Dati persistiti in AsyncStorage
- ✅ **Dashboard Hub**
  - Background immersivo
  - Quick actions cards (Calendar, Statistics, Practices)
  - Strip ultimi 7 giorni mood
  - FAB per creazione rapida mood entry
- ✅ **Mood Entry Canvas**
  - Selezione emoji meteo (max 3)
  - Drop zone animata con Reanimated
  - Slider intensità 0-100%
  - Note testuali collapsabili
  - Salvataggio locale AsyncStorage
- ✅ **Mood Analysis**
  - Hero section con emoji selezionate
  - Breakdown emozionale (sentiment, intensità)
  - Attività suggerite carousel
  - Trend placeholder (grafici futuri)
- ✅ **Calendar View**

  - Griglia mensile con emoji giorni loggati
  - Statistiche del mese
  - Background colorati per intensità

- ✅ **Profile & Settings**
  - Info utente
  - Reset onboarding
  - Clear data
  - Logout

## 🏗️ Architettura

```
src/
├── api/                    # API functions (future)
├── app/                    # Expo Router routes
│   ├── (onboarding)/      # Splash + Intro carousel
│   ├── (auth)/            # Login + Signup
│   ├── (tabs)/            # Dashboard + Calendar + Profile
│   ├── mood-entry.tsx     # Mood Canvas
│   └── mood-analysis.tsx  # Post-creation analysis
├── components/            # UI Components
│   ├── ui/                # Button, Input
│   └── ...
├── services/              # Business logic
│   ├── storage.service.ts # AsyncStorage wrapper
│   └── mock-auth.ts       # Mock authentication
├── hooks/                 # Custom hooks
│   ├── api/               # TanStack Query hooks (future)
│   └── storage/           # Storage hooks
├── types/                 # TypeScript types
├── utils/                 # Constants & helpers
└── global.css            # Tailwind CSS
```

## 🚀 Setup & Run

### Prerequisiti

- Node.js 18+
- Bun (package manager)
- Expo Go app (per testing su device fisico)
- iOS Simulator / Android Emulator (opzionale)

### Installazione

```bash
# Install dependencies
bun install

# Start Expo dev server
npx expo start
```

### Testing su Device

1. **iOS (Simulator)**: Premi `i` nel terminale Expo
2. **Android**: Premi `a` nel terminale Expo
3. **Web**: Premi `w` nel terminale Expo

## 🔐 Credenziali Mock

```
Email: luigi@example.com
Password: password123

Oppure:
Email: test@example.com
Password: test123
```

## 📦 Dipendenze Principali

- **Expo Router** (`~6.0.0`) - File-based routing
- **React Native Reanimated** (`~4.1.0`) - Animazioni
- **React Native Gesture Handler** (`~2.28.0`) - Gestures
- **TanStack Query** (`^5.90.17`) - State management
- **AsyncStorage** (`2.2.0`) - Persistent storage
- **date-fns** (`^4.1.0`) - Date formatting
- **NativeWind v5** - Tailwind CSS per RN

## 🎯 Roadmap

### MVP Completato ✅

- [x] Onboarding flow
- [x] Autenticazione mock
- [x] Dashboard
- [x] Mood Entry Canvas
- [x] Mood Analysis
- [x] Calendar View

### Next Steps 🚧

- [ ] API meteo reale
- [ ] Geolocalizzazione
- [ ] Grafici trend
- [ ] Dark mode
- [ ] Push notifications

---

**Made with ❤️ by Luigi Cirillo**

🌦️ _Le tue emozioni, visibili come il meteo_
