import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThermometerSimpleIcon } from "phosphor-react-native";
import { MoodEntry } from "@/types";
import { EMOJI_TO_ICON, EMOJI_TO_COLOR } from "./constants";

interface EmotionalForecastCardProps {
  latestMood?: MoodEntry;
  isEmpty?: boolean;
}

export const EmotionalForecastCard = ({
  latestMood,
  isEmpty = false,
}: EmotionalForecastCardProps) => {
  return (
    <View className="px-6 mb-6">
      <LinearGradient
        colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
          overflow: "hidden",
        }}
      >
        <View style={{ padding: 20 }}>
          {isEmpty ? (
            <View className="items-center py-4">
              <Text className="text-white text-lg font-medium text-center leading-relaxed italic opacity-90">
                Your emotional sky is a blank canvas. Tap below to share your
                current inner weather.
              </Text>
            </View>
          ) : (
            <>
              {/* Header */}
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-orange-200 text-xs font-semibold uppercase tracking-wider mb-1">
                    Current Mood
                  </Text>
                  <Text className="text-white text-2xl font-bold leading-tight">
                    {latestMood
                      ? latestMood.emojis
                          .map((emoji, i) => {
                            return (
                              (i > 0 ? " + " : "") +
                              `${emoji.charAt(0).toUpperCase()}${emoji.slice(1)}`
                            );
                          })
                          .join("")
                      : "No mood logged yet"}
                  </Text>
                </View>
                {latestMood && (
                  <View className="flex-row gap-2">
                    {latestMood.emojis.map((emoji, i) => {
                      const Icon = EMOJI_TO_ICON[emoji];
                      return (
                        <Icon
                          key={i}
                          size={32}
                          color={EMOJI_TO_COLOR[emoji]}
                          weight="fill"
                        />
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Details */}
              {latestMood && (
                <View className="gap-3">
                  <View className="flex-row items-center gap-2">
                    <ThermometerSimpleIcon
                      size={20}
                      color="rgba(255,255,255,0.7)"
                      weight="bold"
                    />
                    <Text className="text-white text-lg font-medium">
                      Intensity: {latestMood.intensity}%
                    </Text>
                  </View>

                  {latestMood.note && (
                    <>
                      <View className="h-px w-full bg-white/10" />
                      <Text className="text-white/90 text-base font-medium leading-relaxed italic">
                        "{latestMood.note}"
                      </Text>
                    </>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};
