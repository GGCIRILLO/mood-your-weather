import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "@/services/auth.service";
import { router } from "expo-router";

/**
 * Hook for user-related operations
 */
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await deleteAccount();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      router.replace("/(auth)/login");
    },
    onError: (error: Error) => {
      console.error("Delete account mutation failed:", error);
    },
  });
};
