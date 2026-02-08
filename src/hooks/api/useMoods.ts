import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMoods,
  createMood,
  updateMood,
  deleteMood,
} from "@/services/mood.service";
import type { MoodEmojiType } from "@/types";

/**
 * Hook per recuperare i mood entries dell'utente
 */
export const useMoods = (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
  autoFetch?: boolean;
}) => {
  const { startDate, endDate, limit = 50, autoFetch = true } = params || {};

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["moods", { startDate, endDate, limit }],
    queryFn: async () => {
      const result = await getMoods({
        startDate,
        endDate,
        limit,
        offset: 0,
      });
      return result;
    },
    enabled: autoFetch,
    staleTime: 2 * 60 * 1000, // 2 minuti - moods possono essere cached
    gcTime: 5 * 60 * 1000, // 5 minuti garbage collection
  });

  return {
    moods: data?.items || [],
    loading: isLoading,
    error: error?.message || null,
    hasMore: data?.hasMore || false,
    total: data?.total || 0,
    refetch,
  };
};

/**
 * Hook per recuperare i mood recenti (ultimi 7 giorni)
 */
export const useRecentMoods = (limit: number = 7) => {
  const { startDate, endDate } = useMemo(() => {
    // Arrotonda alla fine del giorno corrente in timezone locale
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // 7 giorni fa, inizio giornata
    const start = new Date(end);
    start.setDate(start.getDate() - 6); // -6 per includere oggi
    start.setHours(0, 0, 0, 0);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [
    // Ricalcola solo quando cambia il giorno
    new Date().toDateString(),
  ]);
  return useMoods({
    startDate,
    endDate,
    limit,
    autoFetch: true, // Con useQuery il fetching è gestito meglio
  });
};

/**
 * Hook per creare un nuovo mood entry
 */
export const useCreateMood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moodData: {
      emojis: MoodEmojiType[];
      intensity: number;
      note?: string;
      location?: { lat: number; lon: number };
    }) => {
      return await createMood(moodData);
    },
    onSuccess: () => {
      // Invalida tutte le query moods per ricaricare i dati aggiornati
      queryClient.invalidateQueries({ queryKey: ["moods"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
    onError: (error: any) => {
      console.error("❌ Errore creazione mood:", error.message);
    },
  });
};

/**
 * Hook per aggiornare un mood entry esistente
 */
export const useUpdateMood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entryId,
      updateData,
    }: {
      entryId: string;
      updateData: {
        emojis?: MoodEmojiType[];
        intensity?: number;
        note?: string;
      };
    }) => {
      return await updateMood(entryId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
    },
    onError: (error: any) => {
      console.error("❌ Errore aggiornamento mood:", error.message);
    },
  });
};

/**
 * Hook per eliminare un mood entry
 */
export const useDeleteMood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      return await deleteMood(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
      console.log("✅ Mood eliminato con successo");
    },
    onError: (error: any) => {
      console.error("❌ Errore eliminazione mood:", error.message);
    },
  });
};
