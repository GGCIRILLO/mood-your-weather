import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/services/stats.service";
import type { UserStats } from "@/services/stats.service";

/**
 * Hook per recuperare le statistiche dell'utente
 *
 * - Fetcha stats dal backend con autenticazione
 * - Cache di 5 minuti (le stats cambiano poco frequentemente)
 * - Auto-refetch quando l'app torna in foreground
 */
export const useUserStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery<UserStats>({
    queryKey: ["userStats"],
    queryFn: async () => {
      return await getUserStats();
    },
    staleTime: 5 * 60 * 1000, // 5 minuti - stats non cambiano frequentemente
    gcTime: 10 * 60 * 1000, // 10 minuti garbage collection
    retry: 2,
  });

  return {
    stats,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
};
