import { useState, useEffect, useCallback, useMemo } from "react";
import { getMoods } from "@/services/mood.service";
import type { MoodEntry } from "@/types";

/**
 * Hook per recuperare i mood entries dell'utente
 */
export const useMoods = (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
  autoFetch?: boolean;
}) => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchMoods = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMoods({
        startDate: params?.startDate,
        endDate: params?.endDate,
        limit: params?.limit || 50,
        offset: 0,
      });

      setMoods(result.items);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch moods");
      console.error("Fetch moods error:", err);
    } finally {
      setLoading(false);
    }
  }, [params?.startDate, params?.endDate, params?.limit]);

  useEffect(() => {
    if (params?.autoFetch !== false) {
      fetchMoods();
    }
  }, [fetchMoods, params?.autoFetch]);

  return {
    moods,
    loading,
    error,
    hasMore,
    total,
    refetch: fetchMoods,
  };
};

/**
 * Hook per recuperare i mood recenti (ultimi 7 giorni)
 */
export const useRecentMoods = (limit: number = 7) => {
  // Memoizza le date per evitare re-render continui
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []); // Solo al mount

  return useMoods({
    startDate,
    endDate,
    limit,
    autoFetch: false, // Disabilitato - usa refetch manualmente
  });
};
