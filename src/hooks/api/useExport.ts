import { useMutation } from "@tanstack/react-query";
import { exportToCSV } from "@/services/export.service";

/**
 * Hook for exporting mood data to CSV
 */
export const useExportToCSV = () => {
  return useMutation({
    mutationFn: async () => {
      return exportToCSV();
    },
    onError: (error: Error) => {
      console.error("Export to CSV failed:", error);
    },
  });
};
