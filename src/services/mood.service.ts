import { auth } from "../config/firebaseConfig";
import type { MoodEntry, MoodEmojiType } from "../types";
import { storageService } from "./storage.service";

// Base URL per le API
const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Helper per ottenere il token ID dell'utente corrente
 * Usa AsyncStorage come fallback se Firebase fallisce
 */
const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ Nessun utente autenticato");
    return null;
  }

  try {
    // Prova prima con Firebase
    const token = await user.getIdToken();
    console.log("✅ Token ottenuto da Firebase");
    // Aggiorna il token salvato
    await storageService.saveAuthToken(token);
    return token;
  } catch (error) {
    console.warn(
      "⚠️ Errore getIdToken da Firebase, uso fallback AsyncStorage:",
      error,
    );
    // Fallback: usa token salvato in AsyncStorage
    const savedToken = await storageService.getAuthToken();
    if (savedToken) {
      console.log("✅ Token recuperato da AsyncStorage (fallback)");
      return savedToken;
    }
    console.error("❌ Nessun token disponibile (né Firebase né AsyncStorage)");
    return null;
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
      timestamp: new Date().toISOString(),
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

  const response = await fetch(
    `${API_BASE_URL}/moods?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

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
    })),
    total: data.total,
    hasMore: data.hasMore,
  };
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
