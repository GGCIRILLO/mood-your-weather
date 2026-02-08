import { useQuery } from "@tanstack/react-query";
import { getJournalMoods } from "@/services/mood.service";

/**
 * Hook per recuperare i mood entries con analisi NLP per il Journal
 */
export const useJournalMoods = (params?: {
  limit?: number;
  offset?: number;
  autoFetch?: boolean;
}) => {
  const { limit = 20, offset = 0, autoFetch = true } = params || {};

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["journal-moods", { limit, offset }],
    queryFn: async () => {
      const result = await getJournalMoods({
        limit,
        offset,
      });
      return result;
    },
    enabled: autoFetch,
    staleTime: 2 * 60 * 1000, // 2 minuti - journal entries possono essere cached
    gcTime: 5 * 60 * 1000, // 5 minuti garbage collection
  });

  return {
    entries: data?.items || [],
    loading: isLoading,
    fetching: isFetching,
    error: error?.message || null,
    hasMore: data?.hasMore || false,
    total: data?.total || 0,
    limit: data?.limit || limit,
    offset: data?.offset || offset,
    refetch,
  };
};
