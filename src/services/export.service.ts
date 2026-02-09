import { File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/api";

/**
 * Helper per ottenere il token ID dell'utente corrente
 */
const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken(false);
    return token;
  } catch (error: any) {
    console.error("Error getting ID token:", error.code, error.message);
    throw error;
  }
};

/**
 * Export mood data to CSV file (Expo SDK 54+)
 */
export async function exportToCSV(): Promise<void> {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("User not authenticated");

    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User ID not found");

    const filename = `mood_export_${new Date().toISOString().split("T")[0]}.csv`;

    // Make the API request
    const response = await fetch(`${API_BASE_URL}/export/csv`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Export failed with status ${response.status}`);
    }

    // Get CSV content as text
    const csvContent = await response.text();

    // Create file using new API
    const file = new File(Paths.cache, filename);
    file.create();
    file.write(csvContent);

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      // Share the file
      await Sharing.shareAsync(file.uri, {
        mimeType: "text/csv",
        dialogTitle: "Export Mood Data",
        UTI: "public.comma-separated-values-text",
      });
    } else {
      throw new Error("Sharing is not available on this device");
    }
  } catch (error) {
    console.error("CSV Export error:", error);
    throw error;
  }
}
