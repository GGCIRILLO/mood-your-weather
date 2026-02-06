import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShuffleIcon, QuestionIcon } from "phosphor-react-native";
import { router } from "expo-router";
import { MoodEntry } from "@/types";
import { EMOJI_TO_ICON, EMOJI_TO_COLOR } from "./constants";

interface RecentPatternsProps {
  moods: MoodEntry[];
  loading: boolean;
}

export const RecentPatterns = ({ moods, loading }: RecentPatternsProps) => {
  // Helpers
  const generateLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getDayLabel = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const handleMoodPress = (mood: MoodEntry) => {
    // Pass the serialized mood entry as `entry` so mood-analysis can parse it
    router.push({
      pathname: "/mood-analysis",
      params: { entry: JSON.stringify(mood) },
    });
  };

  const last7Days = generateLast7Days();

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
        ) : (
          last7Days.map((date, index) => {
            const today = isSameDay(date, new Date());

            // Find all moods for this specific day
            const dayMoods = moods.filter((m) =>
              isSameDay(new Date(m.timestamp), date),
            );

            // If multiple moods in same day, get the latest one
            const mood = dayMoods.length > 0
              ? dayMoods.sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime(),
                )[0]
              : null;

            if (mood) {
              const hasMultipleEmojis = mood.emojis.length > 1;
              const Icon = hasMultipleEmojis
                ? ShuffleIcon
                : EMOJI_TO_ICON[mood.emojis[0]];

              return (
                <Pressable
                  key={`mood-${index}`}
                  onPress={() => handleMoodPress(mood)}
                  className="items-center gap-2"
                >
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
                      today
                        ? "text-white font-bold"
                        : "text-white/80 font-medium"
                    }`}
                  >
                    {today ? "Today" : getDayLabel(date)}
                  </Text>
                </Pressable>
              );
            } else {
              // Empty state (Glass effect)
              return (
                <View key={`empty-${index}`} className="items-center gap-2">
                  <View
                    style={[
                      styles.dayCircle,
                      styles.glassCircle,
                      today && styles.todayRing,
                    ]}
                  >
                    {/* Optional Gradient to match card style more closely if needed, 
                             though backgroundColor + mix from parent might work. 
                             Let's replicate the structure if we want exact match, 
                             but for a small circle, simple style might suffice.
                             Using LinearGradient overlay for shine.
                         */}
                    <LinearGradient
                      colors={["rgba(255,255,255,0.2)", "transparent"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                      pointerEvents="none"
                    />
                    <QuestionIcon
                      size={28}
                      color="rgba(255,255,255,0.5)"
                      weight="bold"
                    />
                  </View>
                  <Text
                    className={`text-xs ${
                      today
                        ? "text-white font-bold"
                        : "text-white/50 font-medium"
                    }`}
                  >
                    {today ? "Today" : getDayLabel(date)}
                  </Text>
                </View>
              );
            }
          })
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
    overflow: "hidden", // Needed for gradient overlay in glass circle
  },
  glassCircle: {
    backgroundColor: "rgba(255,255,255,0.1)", // More transparent base
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
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
