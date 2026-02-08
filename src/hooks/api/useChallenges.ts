import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "@/services/challenges.service";

/**
 * Hook to fetch user's challenges progress
 */
export const useChallenges = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      return await getChallenges();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - challenges don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  return {
    currentStreak: data?.currentStreak || 0,
    unlockedBadges: data?.unlockedBadges || [],
    challenges: data?.challenges || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
};
