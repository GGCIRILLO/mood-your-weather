import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { ChallengeCard } from "./ChallengeCard";
import type { Challenge } from "@/types/challenges";

interface ChallengesGridProps {
  challenges: Challenge[];
  loading: boolean;
}

export const ChallengesGrid = ({
  challenges,
  loading,
}: ChallengesGridProps) => {
  return (
    <View>
      <Text className="text-2xl font-bold text-white mb-4">Challenges</Text>

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <View className="flex-row gap-4">
          {/* Column 1 - odd indexed challenges */}
          <View className="flex-1 gap-4">
            {challenges
              .filter((_, index) => index % 2 === 0)
              .map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
          </View>

          {/* Column 2 - even indexed challenges with offset */}
          <View className="flex-1 gap-4 mt-8">
            {challenges
              .filter((_, index) => index % 2 === 1)
              .map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
          </View>
        </View>
      )}
    </View>
  );
};
