import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { MoodSphere } from "./MoodSphere";
import { MoodEmojiType } from "@/types";

interface MoodSphereSectionProps {
  loading: boolean;
  error: string | null;
  user: any;
  currentMoodEmoji: MoodEmojiType;
  isEmpty?: boolean;
}

export const MoodSphereSection = ({
  loading,
  error,
  user,
  currentMoodEmoji,
  isEmpty = false,
}: MoodSphereSectionProps) => {
  return (
    <View className="items-center justify-center">
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : error ? (
        <View className="items-center px-6">
          <Text className="text-red-400 text-lg font-bold mb-2">
            Error loading moods
          </Text>
          <Text className="text-white/70 text-sm text-center">{error}</Text>
          {!user && (
            <Text className="text-yellow-400 text-sm text-center mt-2">
              Please make sure you're logged in
            </Text>
          )}
        </View>
      ) : (
        <MoodSphere mood={currentMoodEmoji} size={192} isEmpty={isEmpty} />
      )}
    </View>
  );
};
