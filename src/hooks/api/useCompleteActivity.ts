import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeMindfulActivity } from "@/services/stats.service";

/**
 * Hook per completare un'attività mindful
 */
export const useCompleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await completeMindfulActivity();
    },
    onSuccess: () => {
      // Invalida le statistiche per ricaricare i dati aggiornati
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
    onError: (error: any) => {
      console.error("❌ Errore completamento attività:", error.message);
    },
  });
};
