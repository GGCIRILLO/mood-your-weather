import { useCallback, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/contexts/authContext";
import { useRecentMoods } from "@/hooks/api/useMoods";
import type { MoodEmojiType } from "@/types";

// Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { WeatherLocationCard } from "@/components/dashboard/WeatherLocationCard";
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

  // Animazioni per i componenti (8 elementi)
  const componentAnims = useRef(
    Array(8)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current;

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

  // Trigger animazioni quando la schermata si monta
  useEffect(() => {
    const animations = componentAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(50, animations).start();
  }, [componentAnims]);

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
          <DashboardHeader />
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
          <DashboardGreeting userName={userName} />
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
          <WeatherLocationCard />
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
          <MoodSphereSection
            loading={loading}
            error={error}
            user={user}
            currentMoodEmoji={currentMoodEmoji}
            isEmpty={!isLatestMoodToday}
          />
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
          <EmotionalForecastCard
            latestMood={latestMood}
            isEmpty={!isLatestMoodToday}
          />
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
          <QuickActionButtons />
        </Animated.View>

        <Animated.View
          style={{
            opacity: componentAnims[6],
            transform: [
              {
                translateY: componentAnims[6].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <RecentPatterns moods={moods} loading={loading} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: componentAnims[7],
            transform: [
              {
                translateY: componentAnims[7].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <SecondaryActionButtons />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
