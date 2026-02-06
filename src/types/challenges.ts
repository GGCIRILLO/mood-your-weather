export type ChallengeStatus = "locked" | "completed";

export interface Challenge {
  id: string;
  name: string;
  description: string;
  goal: string;
  icon: string; // Icon name from phosphor-react-native
  status: ChallengeStatus;
  progress?: number; // 0-100
  currentValue?: number;
  targetValue?: number;
}

export interface ChallengesResponse {
  currentStreak: number;
  unlockedBadges: string[]; // Array of challenge IDs that are unlocked
  challenges: Challenge[];
}
