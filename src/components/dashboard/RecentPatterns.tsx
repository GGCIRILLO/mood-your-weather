
import React from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShuffleIcon } from "phosphor-react-native";
import { MoodEntry } from "@/types";
import { EMOJI_TO_ICON, EMOJI_TO_COLOR } from "./constants";

interface RecentPatternsProps {
  moods: MoodEntry[];
  loading: boolean;
}

export const RecentPatterns = ({ moods, loading }: RecentPatternsProps) => {
  // Helpers
  const getDayLabel = (index: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const moodDate = new Date(moods[index].timestamp);
    return days[moodDate.getDay()];
  };

  const isToday = (index: number) => {
    if (!moods[index]) return false;
    const today = new Date();
    const moodDate = new Date(moods[index].timestamp);
    return (
      today.getDate() === moodDate.getDate() &&
      today.getMonth() === moodDate.getMonth() &&
      today.getFullYear() === moodDate.getFullYear()
    );
  };

  return (
    <View className="flex-col gap-3 pl-6 mb-6">
      <Text className="text-white text-lg font-bold leading-tight pr-6">
        Recent Patterns
      </Text>

      {/* Horizontal Scroll Container */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24, gap: 16 }}
        className="pb-4"
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : moods.length > 0 ? (
          // Inverti l'ordine per mostrare dal più vecchio (sinistra) al più recente (destra)
          [...moods].reverse().map((mood, index) => {
            const hasMultipleEmojis = mood.emojis.length > 1;
            const Icon = hasMultipleEmojis
              ? ShuffleIcon
              : EMOJI_TO_ICON[mood.emojis[0]];
            const originalIndex = moods.length - 1 - index;
            const dayLabel = getDayLabel(originalIndex);
            const today = isToday(originalIndex);

            return (
              <View key={mood.id} className="items-center gap-2">
                {hasMultipleEmojis ? (
                  <LinearGradient
                    colors={[
                      EMOJI_TO_COLOR[mood.emojis[0]],
                      EMOJI_TO_COLOR[mood.emojis[1]],
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.dayCircle, today && styles.todayRing]}
                  >
                    <Icon size={28} color="white" weight="fill" />
                  </LinearGradient>
                ) : (
                  <View
                    style={[
                      styles.dayCircle,
                      { backgroundColor: EMOJI_TO_COLOR[mood.emojis[0]] },
                      today && styles.todayRing,
                    ]}
                  >
                    <Icon size={28} color="white" weight="fill" />
                  </View>
                )}
                <Text
                  className={`text-xs ${
                    today ? "text-white font-bold" : "text-white/80 font-medium"
                  }`}
                >
                  {today ? "Today" : dayLabel}
                </Text>
              </View>
            );
          })
        ) : (
          <View className="items-center gap-2">
            <View
              style={[
                styles.dayCircle,
                { backgroundColor: "rgba(255,255,255,0.05)" },
              ]}
              className="border-2 border-white/10"
            >
              <Text className="text-white/30 text-xl">?</Text>
            </View>
            <Text className="text-xs text-white/50 font-medium">
              No moods yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dayCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  todayRing: {
    borderWidth: 2,
    borderColor: "rgba(19, 91, 236, 0.5)",
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
});
