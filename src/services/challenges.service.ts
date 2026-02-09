import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/api";
import type { ChallengesResponse, Challenge } from "../types/challenges";

/**
 * Helper to get the current user's auth token
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
 * Helper to handle API responses
 */
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }
  if (response.status === 204) return null;
  return await response.json();
};

// ============================================
// CHALLENGES API CALLS
// ============================================

/**
 * Get user's challenges progress
 * This includes current streak and unlocked badges
 */
export const getChallenges = async (): Promise<ChallengesResponse | undefined> => {
  const token = await getAuthToken();
  if (!token) throw new Error("User not authenticated");

  try {
    const response = await fetch(`${API_BASE_URL}/challenges`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await handleApiResponse(response);

    return {
      currentStreak: data.currentStreak || 0,
      unlockedBadges: data.unlockedBadges || [],
      challenges: data.challenges || [],
    };
  } catch (error: any) {
    console.error("Error fetching challenges:", error.message);
    return undefined;
  }
};
