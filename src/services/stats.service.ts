import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/api";
import { UserStats } from "@/types/stats";

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
  return await response.json();
};

/**
 * Fetch user statistics from backend
 *
 * GET /stats/user/{userId}
 * Requires authentication
 */
export const getUserStats = async (): Promise<UserStats> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User ID not found");

  const url = `${API_BASE_URL}/stats/user/${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error: any) {
    console.error("❌ Error fetching user stats:", error.message);
    throw error;
  }
};

/**
 * Complete a mindful activity
 *
 * POST /challenges/mindful
 * Requires authentication
 */
export const completeMindfulActivity = async (): Promise<{
  success: boolean;
}> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const url = `${API_BASE_URL}/challenges/mindful`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error: any) {
    console.error("❌ Error completing mindful activity:", error.message);
    throw error;
  }
};
