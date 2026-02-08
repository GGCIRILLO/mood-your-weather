import { useMutation } from "@tanstack/react-query";
import { exportToCSV, exportToGoogleSheets } from "@/services/export.service";

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

/**
 * Hook for exporting mood data to Google Sheets
 */
export const useExportToGoogleSheets = () => {
  return useMutation({
    mutationFn: async () => {
      return exportToGoogleSheets();
    },
    onError: (error: Error) => {
      console.error("Export to Google Sheets failed:", error);
    },
  });
};

