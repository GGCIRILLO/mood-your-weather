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
    }, [refetch, user])
  );

  // Ottieni il mood più recente
  const latestMood = moods[0];
  
  // Check if latest mood is from today
  const isLatestMoodToday = latestMood ? (() => {
    const today = new Date();
    const moodDate = new Date(latestMood.timestamp); // Assuming ISO string
    return (
      today.getDate() === moodDate.getDate() &&
      today.getMonth() === moodDate.getMonth() &&
      today.getFullYear() === moodDate.getFullYear()
    );
  })() : false;

  const currentMoodEmoji = (latestMood?.emojis[0] || "sunny") as MoodEmojiType;
  
  const bgSource = !isLatestMoodToday ? MOOD_BACKGROUNDS.partly : MOOD_BACKGROUNDS[currentMoodEmoji];

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
              className="bg-black/40 border border-white/10 flex-row items-center justify-center py-3 px-4 rounded-full shadow-lg"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
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
