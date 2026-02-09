import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/hooks/storage/useStorage";
import { storageService } from "@/services/storage.service";
import { useAuth } from "@/contexts/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { CloudRainIcon, CloudIcon, SunIcon } from "phosphor-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  withRepeat,
} from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const { onboarding, loading: onboardingLoading } = useOnboarding();
  const { user, loading: authLoading } = useAuth();
  const [resetting, setResetting] = useState(false);

  // Animation values
  const rainOpacity = useSharedValue(1);
  const cloudOpacity = useSharedValue(0);
  const sunOpacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Start animation sequence on mount
    startWeatherTransition();
  }, []);

  useEffect(() => {
    if (!onboardingLoading && !authLoading) {
      handleNavigation();
    }
  }, [onboarding, user, onboardingLoading, authLoading]);

  const startWeatherTransition = () => {
    // Scale in animation
    scale.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    // Weather transition: rain → clouds → sun (loop)
    rainOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 400 }),
      ),
      -1,
      false,
    );

    cloudOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 600 }),
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 400 }),
      ),
      -1,
      false,
    );

    sunOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1400 }),
        withTiming(1, { duration: 400 }),
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
  };

  const handleNavigation = () => {
    // Check onboarding first
    if (!onboarding.completed) {
      router.replace("/(onboarding)/splash");
      return;
    }

    // Check authentication
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    // User is onboarded and authenticated
    router.replace("/(tabs)/");
  };

  const handleResetStorage = async () => {
    Alert.alert(
      "Reset Storage",
      "Vuoi cancellare tutti i dati e rifare l'onboarding?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setResetting(true);
            await storageService.clearAll();
            // Force reload by navigating to splash
            router.replace("/(onboarding)/splash");
          },
        },
      ],
    );
  };

  const rainStyle = useAnimatedStyle(() => ({
    opacity: rainOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  const cloudStyle = useAnimatedStyle(() => ({
    opacity: cloudOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  const sunStyle = useAnimatedStyle(() => ({
    opacity: sunOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Atmospheric Background */}
      <LinearGradient
        colors={["#1a2533", "#243342", "#135bec4D"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Decorative Cloud Elements */}
      <View style={[styles.cloudDecor, { top: -80, left: -80 }]} />
      <View
        style={[
          styles.cloudDecor,
          { top: "33%", right: -80, width: 384, height: 384, opacity: 0.3 },
        ]}
      />
      <View
        style={[
          styles.cloudDecor,
          { bottom: 0, left: 40, width: 256, height: 256, opacity: 0.2 },
        ]}
      />

      <View className="flex-1 items-center justify-center">
        {/* Weather icon animation stack */}
        <View
          className="relative items-center justify-center"
          style={{ width: 120, height: 120 }}
        >
          <Animated.View style={[rainStyle, { position: "absolute" }]}>
            <CloudRainIcon size={120} color="#60a5fa" weight="fill" />
          </Animated.View>
          <Animated.View style={[cloudStyle, { position: "absolute" }]}>
            <CloudIcon size={120} color="#fff" weight="fill" />
          </Animated.View>
          <Animated.View style={[sunStyle, { position: "absolute" }]}>
            <SunIcon size={120} color="#fbbf24" weight="fill" />
          </Animated.View>
        </View>

        {/* App name */}
        <Text className="font-semibold text-[30px] text-white tracking-tighter mt-12">
          Mood Your Weather
        </Text>
        <Text className="font-light text-white/70 mt-2 text-sm">
          {resetting ? "Resetting..." : "Aligning your emotional horizon"}
        </Text>
      </View>

      {/* Dev Reset Button - Long press per mostrare */}
      <Pressable
        onLongPress={handleResetStorage}
        className="absolute bottom-12 self-center px-6 py-3 bg-red-500/20 rounded-full active:bg-red-500/30"
      >
        <Text className="text-red-300 text-sm font-medium">
          🔄 Reset Storage (long press)
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2533",
  },
  cloudDecor: {
    position: "absolute",
    width: 320,
    height: 320,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
    opacity: 0.4,
  },
});
