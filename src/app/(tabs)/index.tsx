// ============================================
// DASHBOARD HUB - Main immersive screen
// ============================================

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
} from "phosphor-react-native";
import { MoodSphere } from "@/components/dashboard/MoodSphere";
import { images } from "assets";

export default function Dashboard() {
  const insets = useSafeAreaInsets();

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
            <View className="size-10 rounded-full bg-white/10 items-center justify-center">
              <UserIcon size={24} color="white" weight="bold" />
            </View>
          </View>

          {/* Settings Button */}
          <Pressable className="size-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20">
            <GearIcon size={24} color="white" weight="bold" />
          </Pressable>
        </View>

        {/* Greeting */}
        <View className="px-6 pt-2 pb-4">
          <Text
            //className="text-white text-[32px] font-bold leading-tight tracking-tight"
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
            Good Morning, Alex
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
          <MoodSphere mood="sunny" size={192} />
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
                    Radiant Clarity
                  </Text>
                </View>
                <Sun size={32} color="#fbbf24" weight="fill" />
              </View>

              {/* Details */}
              <View className="gap-3">
                <View className="flex-row items-center gap-2">
                  <ThermometerSimpleIcon
                    size={20}
                    color="rgba(255,255,255,0.7)"
                    weight="bold"
                  />
                  <Text className="text-white text-lg font-medium">
                    28°C • UV Index High
                  </Text>
                </View>

                <View className="h-px w-full bg-white/10" />

                <Text className="text-white/90 text-base font-medium leading-relaxed italic">
                  "You are shining bright today. Hold onto this warmth and let
                  it guide you."
                </Text>
              </View>
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
                paddingHorizontal: 16,
                borderRadius: 9999,
              }}
            >
              <PlusCircleIcon size={20} color="white" weight="bold" />
              <Text className="text-white font-bold ml-1">Log Mood</Text>
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
            {/* Day 1 - Stormy */}
            <View className="items-center gap-2">
              <View style={[styles.dayCircle, { backgroundColor: "#4b5563" }]}>
                <CloudLightningIcon size={28} color="white" weight="fill" />
              </View>
              <Text className="text-xs text-white/80 font-medium">Mon</Text>
            </View>

            {/* Day 2 - Rainy */}
            <View className="items-center gap-2">
              <View style={[styles.dayCircle, { backgroundColor: "#3b82f6" }]}>
                <CloudRainIcon size={28} color="white" weight="fill" />
              </View>
              <Text className="text-xs text-white/80 font-medium">Tue</Text>
            </View>

            {/* Day 3 - Cloudy */}
            <View className="items-center gap-2">
              <View style={[styles.dayCircle, { backgroundColor: "#6b7280" }]}>
                <CloudIcon size={28} color="white" weight="fill" />
              </View>
              <Text className="text-xs text-white/80 font-medium">Wed</Text>
            </View>

            {/* Day 4 - Today (Sunny) with ring */}
            <View className="items-center gap-2">
              <View
                style={[
                  styles.dayCircle,
                  styles.todayRing,
                  { backgroundColor: "#fbbf24" },
                ]}
              >
                <SunIcon size={28} color="white" weight="fill" />
              </View>
              <Text className="text-xs text-white font-bold">Today</Text>
            </View>

            {/* Day 5 - Partly cloudy */}
            <View className="items-center gap-2 opacity-60">
              <View style={[styles.dayCircle, { backgroundColor: "#94a3b8" }]}>
                <CloudSun size={28} color="white" weight="fill" />
              </View>
              <Text className="text-xs text-white/50 font-medium">Fri</Text>
            </View>

            {/* Day 6 - Future empty */}
            <View className="items-center gap-2 opacity-60">
              <View
                style={[
                  styles.dayCircle,
                  { backgroundColor: "rgba(255,255,255,0.05)" },
                ]}
                className="border-2 border-white/10"
              >
                <Text className="text-white/30 text-xl">?</Text>
              </View>
              <Text className="text-xs text-white/50 font-medium">Sat</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
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
