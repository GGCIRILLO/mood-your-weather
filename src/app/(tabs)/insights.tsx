import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useUserStats } from "@/hooks/api/useStats";
import { ArrowLeftIcon } from "phosphor-react-native";

// Components
import { StatsGrid } from "@/components/insights/StatsGrid";
import { DominantMoodCard } from "@/components/insights/DominantMoodCard";
import { WeeklyRhythmCard } from "@/components/insights/WeeklyRhythmCard";
import { MindfulMomentsCard } from "@/components/insights/MindfulMomentsCard";
import { UnlockedBadgesCard } from "@/components/insights/UnlockedBadgesCard";
import { PatternAnalysisCard } from "@/components/insights/PatternAnalysisCard";

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { stats, loading, error } = useUserStats();

  const componentAnims = useRef(
    Array(6).fill(0).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = componentAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, animations).start();
  }, [componentAnims]);

  // Show loading or error state
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-white text-lg">Loading your insights...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
            }}
          >
            <Text className="text-white text-lg mb-2">
              Unable to load insights
            </Text>
            <Text className="text-slate-400 text-center">{error}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        {/* Background Blur Blobs */}
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              paddingTop: insets.top + 16,
              paddingBottom: 16,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeftIcon size={24} color="#FFF" />
            </Pressable>

            <Text className="text-sm font-bold uppercase tracking-widest text-slate-400">
              INSIGHTS
            </Text>

            <View style={styles.placeholderButton} />
          </View>

          <View className="px-5 gap-4">
            <Animated.View
              style={{
                opacity: componentAnims[0],
                transform: [
                  {
                    translateY: componentAnims[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <StatsGrid stats={stats} />
            </Animated.View>

            <Animated.View
              style={{
                opacity: componentAnims[1],
                transform: [
                  {
                    translateY: componentAnims[1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <DominantMoodCard dominantMood={stats?.dominantMood} />
            </Animated.View>

            <Animated.View
              style={{
                opacity: componentAnims[2],
                transform: [
                  {
                    translateY: componentAnims[2].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <WeeklyRhythmCard weeklyRhythm={stats?.weeklyRhythm} />
            </Animated.View>

            <Animated.View
              style={{
                opacity: componentAnims[3],
                transform: [
                  {
                    translateY: componentAnims[3].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <MindfulMomentsCard count={stats?.mindfulMomentsCount} />
            </Animated.View>

            <Animated.View
              style={{
                opacity: componentAnims[4],
                transform: [
                  {
                    translateY: componentAnims[4].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <UnlockedBadgesCard badges={stats?.unlockedBadges} />
            </Animated.View>

            <Animated.View
              style={{
                opacity: componentAnims[5],
                transform: [
                  {
                    translateY: componentAnims[5].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <PatternAnalysisCard />
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  backButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  placeholderButton: {
    width: 48,
    height: 48,
  },
  blueBlob: {
    position: "absolute",
    top: "20%",
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: "rgba(19, 91, 236, 0.15)",
    borderRadius: 9999,
  },
  purpleBlob: {
    position: "absolute",
    bottom: "33%",
    left: -40,
    width: 320,
    height: 320,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderRadius: 9999,
  },
});
