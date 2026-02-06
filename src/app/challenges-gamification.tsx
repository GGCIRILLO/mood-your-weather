import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useChallenges } from "@/hooks/api/useChallenges";
import { ChallengesHeader } from "@/components/challenges/ChallengesHeader";
import { ActiveStreakCard } from "@/components/challenges/ActiveStreakCard";
import { ChallengesGrid } from "@/components/challenges/ChallengesGrid";

export default function ChallengesScreen() {
  const { currentStreak, challenges, loading } = useChallenges();

  // Find the 7-day streak challenge for the progress card
  const streakChallenge = challenges.find((c) => c.id === "7_day_streak");
  const streakProgress = streakChallenge
    ? (streakChallenge.currentValue / streakChallenge.targetValue) * 100
    : 0;

  return (
    <View className="flex-1">
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={{ flex: 1 }}>
        {/* Background Blur Blobs */}
        <View className="absolute top-[20%] -right-20 w-64 h-64 bg-blue-600/15 rounded-full" />
        <View className="absolute bottom-[33%] -left-10 w-80 h-80 bg-purple-500/10 rounded-full" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <ChallengesHeader />

          <View className="flex-col gap-6 px-4 pt-2">
            {/* Active Streak Card */}
            <ActiveStreakCard
              currentStreak={currentStreak}
              streakChallenge={streakChallenge}
              streakProgress={streakProgress}
            />

            {/* Challenges Grid */}
            <ChallengesGrid challenges={challenges} loading={loading} />
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
