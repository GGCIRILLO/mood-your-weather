import { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MoodEntry } from "@/types";
import {
  SunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudSunIcon,
  LightningIcon,
  MoonIcon,
  WindIcon,
  ArrowLeftIcon,
} from "phosphor-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { images, analysis_forecast } from "../../../assets";
import moodDataRaw from "@/utils/moodAnalysis.json";

// Map matching emojis to Phosphor Icons
const MOOD_ICON_MAP: Record<string, any> = {
  sunny: SunIcon,
  partly: CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRainIcon,
  stormy: LightningIcon,
  windy: WindIcon,
  clear: MoonIcon, // Night fallback
};

const MOOD_COLORS: Record<string, string> = {
  sunny: "#F59E0B", // amber-500
  partly: "#3B82F6", // blue-500
  cloudy: "#64748B", // slate-500
  rainy: "#3B82F6", // blue-500
  stormy: "#6366F1", // indigo-500
};

export default function MoodAnalysisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { entry: entryParam } = useLocalSearchParams<{ entry: string }>();
  const [entry, setEntry] = useState<MoodEntry | null>(null);

  const componentAnims = useRef(
    Array(3)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const animations = componentAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(60, animations).start();
  }, [componentAnims]);

  useEffect(() => {
    if (entryParam) {
      try {
        const parsedEntry = JSON.parse(entryParam);
        setEntry(parsedEntry);
      } catch (e) {
        console.error("Failed to parse mood entry", e);
      }
    }
  }, [entryParam]);

  // Find matching mood data from JSON
  const currentMoodData = useMemo(() => {
    if (!entry) return null;

    // Normalize and sort user emojis for comparison
    const userEmojis = [...entry.emojis].sort();

    // Find matching mood definition
    const moodDef = moodDataRaw.mood_data.find((m) => {
      const defEmojis = [...m.emojis].sort();
      return (
        userEmojis.length === defEmojis.length &&
        userEmojis.every((e, i) => e === defEmojis[i])
      );
    });

    if (!moodDef) return null;

    // Find matching intensity level
    const level = moodDef.intensity_levels.find(
      (l) => entry.intensity >= l.range[0] && entry.intensity <= l.range[1],
    );

    return {
      moodDef,
      level: level || moodDef.intensity_levels[0], // fallback
    };
  }, [entry]);

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0A0F1E]">
        <Text className="text-gray-400">Loading forecast...</Text>
      </View>
    );
  }

  const { moodDef, level } = currentMoodData || {};

  // If no match found
  if (!moodDef || !level) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0A0F1E]">
        <Pressable onPress={() => router.back()} className="p-4">
          <Text className="text-white">
            Analysis Data Unavailable. Go Back.
          </Text>
        </Pressable>
      </View>
    );
  }

  // Resolve hero image
  const heroImage =
    (analysis_forecast as any)[(moodDef as any).image_key] ||
    (images as any)[(moodDef as any).image_key];

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        {/* Background Blur Blobs */}
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />

        <ScrollView
          className="flex-1 pb-24"
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
            <Pressable
              onPress={() => router.push("/(tabs)")}
              className="w-12 h-12 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            >
              <ArrowLeftIcon size={24} color="#FFF" />
            </Pressable>

            <Text className="text-sm font-bold uppercase tracking-widest text-slate-400">
              YOUR FORECAST
            </Text>

            <View className="w-12 h-12" />
          </View>

          <View className="px-4 gap-6 pt-2">
            {/* Hero Section */}
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
              className="relative w-full rounded-4xl overflow-hidden bg-slate-900 group"
            >
              <ImageBackground
                source={heroImage}
                style={{ width: "100%", height: 350 }}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.4)", "#101622"]}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                />

                <View className="flex-1 justify-end p-6 pb-8">
                  <View className="mb-4 flex-row self-start items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
                    {entry.emojis.slice(0, 3).map((e, i) => {
                      const Icon = MOOD_ICON_MAP[e] || SunIcon;
                      return (
                        <Icon key={i} size={16} color="white" weight="fill" />
                      );
                    })}
                    <Text className="text-xs font-bold text-white">
                      Current Mood
                    </Text>
                  </View>

                  <Text className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                    {level.title}
                  </Text>
                  <Text className="mt-2 text-lg font-medium text-slate-200/90 leading-snug">
                    {level.description}
                  </Text>
                </View>
              </ImageBackground>
            </Animated.View>

            {/* Emotional Composition */}
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
              <Text className="mb-4 text-xl font-bold tracking-tight text-white px-1">
                Emotional Composition
              </Text>

              <View className="flex-row gap-3">
                {/* Mood Cards */}
                {entry.emojis.map((emoji, index) => {
                  const Icon = MOOD_ICON_MAP[emoji] || SunIcon;
                  const color = MOOD_COLORS[emoji] || "#64748B"; // slate-500
                  const moodName =
                    emoji.charAt(0).toUpperCase() + emoji.slice(1);

                  return (
                    <View
                      key={index}
                      className="flex-1 h-32 relative overflow-hidden bg-[#192233] p-5 rounded-3xl border border-slate-800 justify-end"
                    >
                      {/* Background Icon */}
                      <View className="absolute -right-4 -bottom-4 opacity-10">
                        <Icon size={100} color={color} weight="fill" />
                      </View>

                      <View className="z-10">
                        <Text className="text-lg font-bold text-white leading-tight">
                          {moodName}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                {/* Intensity Card */}
                <View className="flex-1 h-32 relative overflow-hidden bg-[#192233] p-5 rounded-3xl border border-slate-800 justify-end">
                  {/* Background Number */}
                  <View className="absolute -right-2 -bottom-6 opacity-10">
                    <Text className="text-[100px] font-black text-white">
                      {entry.intensity}
                    </Text>
                  </View>

                  <View className="z-10">
                    <Text className="text-3xl font-bold text-white">
                      {entry.intensity}%
                    </Text>
                    <Text className="text-sm font-medium text-slate-400">
                      Intensity
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Suggested Activities */}
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
              className="mb-8"
            >
              <View className="flex-row items-center justify-between px-1 mb-4">
                <Text className="text-xl font-bold tracking-tight text-white">
                  Suggested Activities
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4, gap: 16 }}
                className="-mx-4 px-4 pb-4"
              >
                {level.activities.map((act, idx) => {
                  return (
                    <View
                      key={act.id}
                      className="w-50 bg-[#192233] p-4 rounded-2xl border border-slate-800 shadow-sm"
                    >
                      <View className="h-28 w-full rounded-xl overflow-hidden bg-slate-200 mb-3">
                        <Image
                          source={{ uri: (act as any).image_url }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      </View>
                      <Text className="font-bold text-white text-lg">
                        {act.name}
                      </Text>
                      <Text className="text-xs text-slate-400 mt-1 leading-4">
                        {act.description}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
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
