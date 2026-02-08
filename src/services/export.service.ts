import { File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/api";

interface ExportResponse {
  success: boolean;
  url?: string;
  message: string;
}

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
 * Helper per gestire le risposte API
 */
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }
  if (response.status === 204) return null;
  return await response.json();
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
    await file.create();
    await file.write(csvContent);

    console.log("File saved to:", file.uri);

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

/**
 * Export to Google Sheets
 */
export async function exportToGoogleSheets(): Promise<ExportResponse> {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("User not authenticated");

    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User ID not found");

    const response = await fetch(`${API_BASE_URL}/export/google-sheets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Google Sheets Export error:", error);
    throw error;
  }
}

/**
 * Get supported export formats
 */
export async function getSupportedFormats() {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/export/supported-formats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching formats:", error);
    throw error;
  }
}


