import { auth } from "../config/firebaseConfig";
import type { MoodEntry, MoodEmojiType, MoodListWithNLP } from "../types";
import { API_BASE_URL } from "../config/api";

/**
 * Helper per ottenere il token ID dell'utente corrente
 * Usa AsyncStorage come fallback se Firebase fallisce
 */
const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  try {
    // Try to get cached token first (forceRefresh = false)
    // This avoids network calls if the token is still valid
    const token = await user.getIdToken(false);
    return token;
  } catch (error: any) {
    console.error("Error getting ID token:", error.code, error.message);
    throw error;
  }
};

/**
 * Helper per gestire le risposte API
 */
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }
  if (response.status === 204) return null;
  return await response.json();
};

// ============================================
// MOOD API CALLS
// ============================================

/**
 * Crea nuovo mood entry
 */
export const createMood = async (moodData: {
  emojis: MoodEmojiType[];
  intensity: number;
  note?: string;
  location?: { lat: number; lon: number };
}): Promise<MoodEntry> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User ID not found");

  const response = await fetch(`${API_BASE_URL}/moods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      emojis: moodData.emojis,
      intensity: moodData.intensity,
      note: moodData.note,
      location: moodData.location,
    }),
  });

  const data = await handleApiResponse(response);

  // Converti formato backend a frontend
  return {
    id: data.entryId,
    userId: data.userId,
    timestamp: data.timestamp,
    emojis: data.emojis,
    intensity: data.intensity,
    note: data.note,
    externalWeather: data.externalWeather,
    location: data.location,
  };
};

/**
 * Recupera lista mood entries con filtri
 */
export const getMoods = async (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: MoodEntry[]; total: number; hasMore: boolean }> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());

  const url = `${API_BASE_URL}/moods?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await handleApiResponse(response);

    // Converti formato backend a frontend
    return {
      items: data.items.map((item: any) => ({
        id: item.entryId,
        userId: item.userId,
        timestamp: item.timestamp,
        emojis: item.emojis,
        intensity: item.intensity,
        note: item.note,
        externalWeather: item.externalWeather,
        location: item.location,
      })),
      total: data.total,
      hasMore: data.hasMore,
    };
  } catch (error: any) {
    console.error("Error fetching moods:", error.message);
    throw error;
  }
};

/**
 * Recupera mood entries con analisi NLP per la schermata Journal
 */
export const getJournalMoods = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<MoodListWithNLP> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());

  const url = `${API_BASE_URL}/moods/journal?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await handleApiResponse(response);

    // Mappa i dati per assicurare che mood.id sia presente (mappa entryId -> id)
    return {
      items: data.items.map((item: any) => ({
        mood: {
          id: item.mood.entryId || item.mood.id,
          userId: item.mood.userId,
          timestamp: item.mood.timestamp,
          emojis: item.mood.emojis,
          intensity: item.mood.intensity,
          note: item.mood.note,
          externalWeather: item.mood.externalWeather,
          location: item.mood.location,
        },
        nlpAnalysis: item.nlpAnalysis,
      })),
      total: data.total,
      limit: data.limit,
      offset: data.offset,
      hasMore: data.hasMore,
    };
  } catch (error: any) {
    console.error("Error fetching journal moods:", error.message);
    throw error;
  }
};

/**
 * Recupera singolo mood entry
 */
export const getMood = async (entryId: string): Promise<MoodEntry> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/moods/${entryId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleApiResponse(response);

  return {
    id: data.entryId,
    userId: data.userId,
    timestamp: data.timestamp,
    emojis: data.emojis,
    intensity: data.intensity,
    note: data.note,
    externalWeather: data.externalWeather,
    location: data.location,
  };
};

/**
 * Aggiorna mood entry esistente
 */
export const updateMood = async (
  entryId: string,
  updateData: {
    emojis?: MoodEmojiType[];
    intensity?: number;
    note?: string;
  },
): Promise<MoodEntry> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/moods/${entryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  const data = await handleApiResponse(response);

  return {
    id: data.entryId,
    userId: data.userId,
    timestamp: data.timestamp,
    emojis: data.emojis,
    intensity: data.intensity,
    note: data.note,
    externalWeather: data.externalWeather,
    location: data.location,
  };
};

/**
 * Elimina mood entry
 */
export const deleteMood = async (entryId: string): Promise<void> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/moods/${entryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await handleApiResponse(response);
};
