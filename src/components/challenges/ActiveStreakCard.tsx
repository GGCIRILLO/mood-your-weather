import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DropIcon } from "phosphor-react-native";
import type { Challenge } from "@/types/challenges";

interface ActiveStreakCardProps {
  currentStreak: number;
  streakChallenge?: Challenge;
  streakProgress: number;
}

export const ActiveStreakCard = ({
  currentStreak,
  streakChallenge,
  streakProgress,
}: ActiveStreakCardProps) => {
  return (
    <View className="relative w-full rounded-3xl overflow-hidden bg-[#192233] min-h-45 border border-[#1e293b]">
      <LinearGradient
        colors={["#0A0F1E", "rgba(10, 15, 30, 0.4)", "transparent"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View className="p-5 flex-col justify-between min-h-45">
        <View className="flex-row justify-between items-start">
          <View className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 flex-row items-center gap-1">
            <DropIcon size={18} color="#3B82F6" weight="fill" />
            <Text className="text-blue-500 text-xs font-bold uppercase">
              Active Streak
            </Text>
          </View>
          <Text className="text-white font-bold text-2xl">
            {currentStreak}
            <Text className="text-base font-normal text-white/70">/7 Days</Text>
          </Text>
        </View>
        <View className="gap-3 mt-4">
          <Text className="text-white text-2xl font-bold">7-Day Streak</Text>
          <Text className="text-slate-400 text-sm">
            {streakChallenge?.description ||
              "Build a consistent habit to unlock your weekly emotional weather report."}
          </Text>
          <View className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <View
              style={{
                width: `${streakProgress}%`,
                height: "100%",
                borderRadius: 9999,
                backgroundColor: "#3B82F6",
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
