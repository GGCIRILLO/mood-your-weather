import { useCallback } from "react";
import { View, ScrollView, ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/contexts/authContext";
import { useRecentMoods } from "@/hooks/api/useMoods";
import type { MoodEmojiType } from "@/types";

// Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { MoodSphereSection } from "@/components/dashboard/MoodSphereSection";
import { EmotionalForecastCard } from "@/components/dashboard/EmotionalForecastCard";
import { QuickActionButtons } from "@/components/dashboard/QuickActionButtons";
import { RecentPatterns } from "@/components/dashboard/RecentPatterns";
import { SecondaryActionButtons } from "@/components/dashboard/SecondaryActionButtons";
import { MOOD_BACKGROUNDS } from "@/components/dashboard/constants";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { moods, loading, error, refetch } = useRecentMoods(7);

  // Nome utente
  const userName = user?.displayName || user?.email?.split("@")[0] || "Alex";

  // Ricarica i mood solo quando la schermata diventa visibile E l'utente è autenticato
  useFocusEffect(
    useCallback(() => {
      if (user) {
        refetch();
      }
    }, [refetch, user]),
  );

  // Ottieni il mood più recente
  const latestMood = moods[0];

  // Check if latest mood is from today
  const isLatestMoodToday = latestMood
    ? (() => {
        const today = new Date();
        const moodDate = new Date(latestMood.timestamp); // Assuming ISO string
        return (
          today.getDate() === moodDate.getDate() &&
          today.getMonth() === moodDate.getMonth() &&
          today.getFullYear() === moodDate.getFullYear()
        );
      })()
    : false;

  const currentMoodEmoji = (latestMood?.emojis[0] || "sunny") as MoodEmojiType;

  const bgSource = !isLatestMoodToday
    ? MOOD_BACKGROUNDS.partly
    : MOOD_BACKGROUNDS[currentMoodEmoji];

  return (
    <View className="flex-1 bg-[#111722]">
      {/* Background Weather Layer - Synced with mood */}
      <ImageBackground
        source={bgSource}
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
        <DashboardHeader />

        <DashboardGreeting userName={userName} />

        <MoodSphereSection
          loading={loading}
          error={error}
          user={user}
          currentMoodEmoji={currentMoodEmoji}
          isEmpty={!isLatestMoodToday}
        />

        <EmotionalForecastCard
          latestMood={latestMood}
          isEmpty={!isLatestMoodToday}
        />

        <QuickActionButtons latestMood={latestMood} />

        <RecentPatterns moods={moods} loading={loading} />

        <SecondaryActionButtons />
      </ScrollView>
    </View>
  );
}
