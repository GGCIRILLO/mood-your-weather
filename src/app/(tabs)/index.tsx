// ============================================
// DASHBOARD HUB - Main immersive screen
// ============================================

import { useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  User,
  Gear,
  Sun,
  ThermometerSimple,
  PlusCircle,
  NotePencil,
  ChartLineUp,
  CloudRain,
  Cloud,
  CloudSun,
  CloudLightning,
  UserIcon,
  GearIcon,
  ThermometerSimpleIcon,
  PlusCircleIcon,
  NotePencilIcon,
  ChartLineUpIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudIcon,
  SunIcon,
  Shuffle,
  Medal,
  Moon,
} from "phosphor-react-native";
import { MoodSphere } from "@/components/dashboard/MoodSphere";
import { images } from "assets";
import { router } from "expo-router";
import { useRecentMoods } from "@/hooks/api/useMoods";
import type { MoodEmojiType } from "@/types";
import { useAuth } from "@/contexts/authContext";

// Mappa emoji a icone
const EMOJI_TO_ICON: Record<MoodEmojiType, any> = {
  sunny: SunIcon,
  partly: CloudSun,
  cloudy: CloudIcon,
  rainy: CloudRainIcon,
  stormy: CloudLightningIcon,
};

// Mappa emoji a colori
const EMOJI_TO_COLOR: Record<MoodEmojiType, string> = {
  sunny: "#fbbf24",
  partly: "#94a3b8",
  cloudy: "#6b7280",
  rainy: "#3b82f6",
  stormy: "#4b5563",
};

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { moods, loading, error, refetch } = useRecentMoods(7);

  // Nome utente - extract first name intelligently
  const extractFirstName = (email: string | undefined) => {
    if (!email) return "Friend";
    const username = email.split("@")[0];
    // Take only text before first dot or number
    const firstName = username.split(/[\.0-9]/)[0];
    // Capitalize first letter
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  };
  const userName = user?.displayName || extractFirstName(user?.email);
  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";

  // Ricarica i mood solo quando la schermata diventa visibile
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Ottieni il mood più recente
  const latestMood = moods[0];
  const currentMoodEmoji = (latestMood?.emojis[0] || "sunny") as
    | "sunny"
    | "partly"
    | "cloudy"
    | "rainy"
    | "stormy";

  // Giorni della settimana
  const getDayLabel = (index: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
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
    <View className="flex-1 bg-[#111722]">
      {/* Background Weather Layer */}
      <ImageBackground
        // "sunny" | "cloudy" | "rainy" | "stormy" | "partly"
        source={images.db_bg_sunny}
        className="absolute inset-0"
        resizeMode="cover"
      >
        {/* Gradient Overlay for readability */}
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </ImageBackground>

      {/* Content Layer */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar */}
        <View
          style={{
            paddingTop: insets.top + 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingBottom: 16,
          }}
        >
          <View className="flex-row items-center gap-3">
            {/* Profile Avatar */}
            <Pressable
              onPress={() => router.push("/profile")}
              className="size-10 rounded-full bg-white/10 items-center justify-center"
            >
              <UserIcon size={24} color="white" weight="bold" />
            </Pressable>
          </View>

          {/* Settings Button */}
          <Pressable className="size-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20">
            <GearIcon size={24} color="white" weight="bold" />
          </Pressable>
        </View>

        {/* Greeting */}
        <View className="px-6 pt-2 pb-4">
          <Text
            style={{
              textShadowColor: "rgba(0,0,0,0.3)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
              fontSize: 32,
              fontWeight: "bold",
              lineHeight: 38,
              letterSpacing: -0.5,
              color: "white",
              zIndex: 10,
            }}
          >
            {greeting}, {userName}
          </Text>
          <Text
            style={{
              textShadowColor: "rgba(0,0,0,0.3)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
              fontSize: 18,
              fontWeight: "500",
              color: "white",
              zIndex: 10,
            }}
          >
            The sky is clearing up.
          </Text>
        </View>

        {/* 3D Mood Sphere Area */}
        <View className="flex-1 items-center justify-center py-8">
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <MoodSphere mood={currentMoodEmoji} size={192} />
          )}
        </View>

        {/* Today's Emotional Forecast Card */}
        <View className="px-4 mb-6">
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.3)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            {/* Glass shine effect */}
            <LinearGradient
              colors={["rgba(255,255,255,0.1)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="absolute inset-0"
              pointerEvents="none"
            />
            <View className="p-5">
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
            </View>
          </View>
        </View>

        {/* Quick Action Floaters */}
        <View className="px-4 mb-8">
          <View className="flex-row gap-3">
            <Pressable
              style={{
                backgroundColor: "rgba(19, 91, 236, 0.8)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                shadowColor: "#135bec",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 9999,
                flex: 1,
              }}
              onPress={() => router.push("mood-entry")}
            >
              <PlusCircleIcon size={20} color="white" weight="bold" />
              <Text className="text-white font-bold ml-1">Log Mood</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/mood-entry")}
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 9999,
                flex: 1,
              }}
            >
              <NotePencilIcon size={20} color="white" weight="bold" />
              <Text className="text-white font-bold ml-1">Journal</Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 9999,
              }}
            >
              <ChartLineUpIcon size={20} color="white" weight="bold" />
              <Text className="text-white font-bold ml-1">Insights</Text>
            </Pressable>
          </View>
        </View>

        {/* Goals & Practice Buttons - Same Row */}
        <View className="px-4 mb-6">
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.push("/challenges-gamification")}
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 9999,
              }}
            >
              <Medal size={20} color="white" weight="bold" />
              <Text className="text-white font-bold ml-1">Goals</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/guided-practices")}
              style={{
                backgroundColor: "rgba(19,91,236,0.2)",
                borderWidth: 1,
                borderColor: "rgba(19,91,236,0.3)",
                shadowColor: "#135bec",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 15,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 9999,
              }}
            >
              <Moon size={20} color="#135bec" weight="fill" />
              <Text style={{ color: "#135bec", fontWeight: "bold", marginLeft: 4 }}>Practice</Text>
            </Pressable>
          </View>
        </View>

        {/* Recent Patterns Strip */}
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
                  ? Shuffle
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
                      className={`text-xs ${today ? "text-white font-bold" : "text-white/80 font-medium"}`}
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
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  warmTint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    mixBlendMode: "overlay",
  },
  avatar: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  textShadow: {
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  primaryButton: {
    backgroundColor: "rgba(19, 91, 236, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  secondaryButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
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
