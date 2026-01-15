# Piano: Implementazione Mood Your Weather MVP

App mobile meteo-emotiva con onboarding, autenticazione mock, dashboard immersiva, mood entry canvas drag & drop, analisi mood, calendario storico. Tech stack: Expo Router, AsyncStorage, Reanimated, gesture handler, dati mock locali.

## Steps

### 1. Setup dipendenze e struttura

Installare `@react-native-async-storage/async-storage`, `react-native-gesture-handler`, `date-fns`, `@tanstack/react-query`. Creare struttura folder: [src/api/](src/api/) (funzioni fetch), [src/components/](src/components/){ui, onboarding, dashboard, mood, calendar}, [src/services/](src/services/){storage, mock-auth}, [src/types/](src/types/), [src/hooks/](src/hooks/){api, storage, ui}, [src/utils/](src/utils/). Definire types in [src/types/index.ts](src/types/index.ts) per `User`, `MoodEntry`, `OnboardingState`, `WeatherData`.

**Pattern API**: Scrivere funzioni `get`, `post`, `put`, `delete` con fetch nativo TypeScript in [src/api/](src/api/). Creare custom hooks in [src/hooks/api/](src/hooks/api/) che usano TanStack Query (`useQuery` per GET, `useMutation` per POST/PUT/DELETE). Usare gli hooks nelle schermate UI.

### 2. Onboarding flow (4 schermate)

Creare route group `(onboarding)` in [src/app/](src/app/). Implementare: splash screen con animazione meteo 2s in [splash.tsx](<src/app/(onboarding)/splash.tsx>), 3 schermate onboarding con carousel swipeable gesture-handler in [intro.tsx](<src/app/(onboarding)/intro.tsx>), tutorial drag & drop interattivo, pattern discovery calendario 30 giorni. Salvare stato completamento in AsyncStorage. Utilizzare Reanimated per transizioni smooth.

### 3. Autenticazione mock UI

Creare [src/app/(auth)/](<src/app/(auth)/>) con [login.tsx](<src/app/(auth)/login.tsx>) e [signup.tsx](<src/app/(auth)/signup.tsx>). Input email/password con validazione, bottoni social mock, background meteo. Service [src/services/mock-auth.ts](src/services/mock-auth.ts) ritorna user mock salvato in AsyncStorage. Redirezione a dashboard dopo login.

### 4. Dashboard hub centrale

Implementare [src/app/(tabs)/index.tsx](<src/app/(tabs)/index.tsx>) con background full-screen meteo dinamico basato su mood recente. Card glassmorphic scrollabili: Calendar, Statistics, Practices. Strip ultimi 7 giorni con mini weather scenes. FAB bottom-right per navigazione a mood entry canvas. Componenti in [src/components/dashboard/](src/components/dashboard/).

**API Pattern**: Creare [src/api/weather.api.ts](src/api/weather.api.ts) con `getWeatherByLocation(lat, lon)` usando fetch. Hook [src/hooks/api/useWeather.ts](src/hooks/api/useWeather.ts) con `useQuery(['weather', lat, lon], () => getWeatherByLocation(lat, lon))`. Usare `const { data, isLoading } = useWeather(lat, lon)` nel componente dashboard.

### 5. Mood Entry Canvas con drag & drop

Creare [src/app/mood-entry.tsx](src/app/mood-entry.tsx) full-screen. Emoji meteo orbitanti ai bordi con gesture-handler, drop zone centrale con ripple Reanimated, slider intensità 0-100%, area note collapsabile, analisi real-time con bolle galleggianti. Salvataggio entry in AsyncStorage via [src/services/storage.service.ts](src/services/storage.service.ts). Navigazione a mood analysis dopo conferma.

### 6. Mood Analysis e Calendar View

Implementare [src/app/mood-analysis.tsx](src/app/mood-analysis.tsx): hero scene meteo, breakdown emozionale, correlazioni mock, carousel attività suggerite, mini-grafico trend 7 giorni. Creare [src/app/(tabs)/calendar.tsx](<src/app/(tabs)/calendar.tsx>): griglia mensile con icone meteo per giorni loggati, background colorati per intensità, pattern outline glow simulati, swipe orizzontale mesi, modal dettaglio giorno con slide-up animation.

## Further Considerations

### 1. Navigazione gesture-based

Implementare swipe da sinistra/destra per Journal e Profile oppure utilizzare drawer navigation nascosto con gesture? Tab bar visibile o solo FAB e card navigation?

### 2. Libreria animazioni aggiuntive

Utilizzare solo Reanimated o aggiungere anche Moti/Skia per effetti particellari meteo (pioggia, nuvole) più realistici?

### 3. Mock data vs Firebase

Strutturare services con interfacce per facilitare migrazione futura? Implementare pattern Repository per astrarre storage layer?

### 4. Light/dark mode

Implementare tema con context React o utilizzare sistema OS nativo via `useColorScheme`? Definire palette colori meteo per entrambi i temi?

## Pattern API (TanStack Query + Fetch)

### Struttura Layer

```
src/
├── api/                      # Funzioni fetch pure
│   ├── weather.api.ts       # getWeather, getWeatherForecast
│   ├── mood.api.ts          # getMoodEntries, createMoodEntry (mock)
│   └── client.ts            # Base fetch wrapper con error handling
├── hooks/
│   └── api/                 # Custom hooks TanStack Query
│       ├── useWeather.ts    # useQuery per weather data
│       └── useMoodEntry.ts  # useMutation per create mood
└── app/                     # UI screens usano gli hooks
    └── (tabs)/index.tsx     # const { data } = useWeather()
```

### Esempio Implementazione

**1. Funzione API pura (src/api/weather.api.ts)**

```typescript
export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error("Weather API failed");
  return response.json();
}
```

**2. Custom Hook (src/hooks/api/useWeather.ts)**

```typescript
import { useQuery } from "@tanstack/react-query";
import { getWeather } from "@/api/weather.api";

export function useWeather(lat: number, lon: number) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeather(lat, lon),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}
```

**3. Uso in UI (src/app/(tabs)/index.tsx)**

```typescript
import { useWeather } from "@/hooks/api/useWeather";

export default function Dashboard() {
  const { data: weather, isLoading, error } = useWeather(lat, lon);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;

  return <WeatherCard data={weather} />;
}
```

### Vantaggi Pattern

- ✅ Separazione concerns (API logic, state management, UI)
- ✅ Caching automatico TanStack Query
- ✅ Retry e error handling built-in
- ✅ Facile testing (mock funzioni fetch)
- ✅ Type-safe end-to-end con TypeScript
