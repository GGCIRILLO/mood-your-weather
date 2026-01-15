// ============================================
// SPLASH SCREEN - Animazione meteo 2 secondi
// ============================================

import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const rainOpacity = useSharedValue(1);
  const cloudOpacity = useSharedValue(0);
  const sunOpacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Start animation sequence
    startWeatherTransition();
  }, []);

  const startWeatherTransition = () => {
    // Scale in animation
    scale.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    // Weather transition: rain → clouds → sun
    rainOpacity.value = withSequence(
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 400 })
    );

    cloudOpacity.value = withSequence(
      withTiming(0, { duration: 600 }),
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 400 })
    );

    sunOpacity.value = withSequence(
      withTiming(0, { duration: 1400 }),
      withTiming(1, { duration: 400 }, () => {
        // Navigate after animation completes
        runOnJS(navigateNext)();
      })
    );
  };

  const navigateNext = () => {
    setTimeout(() => {
      router.replace("/(onboarding)/intro");
    }, 200);
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
    <View className="flex-1 items-center justify-center bg-linear-to-b from-blue-400 to-blue-600">
      {/* Weather emoji animation stack */}
      <View className="relative items-center justify-center">
        <Animated.Text
          style={[rainStyle, { position: "absolute", fontSize: 120 }]}
        >
          🌧️
        </Animated.Text>
        <Animated.Text
          style={[cloudStyle, { position: "absolute", fontSize: 120 }]}
        >
          ☁️
        </Animated.Text>
        <Animated.Text
          style={[sunStyle, { position: "absolute", fontSize: 120 }]}
        >
          ☀️
        </Animated.Text>
      </View>

      {/* App name */}
      <Text className="text-white text-3xl font-bold mt-12 tracking-wider">
        Mood Your Weather
      </Text>
      <Text className="text-blue-100 text-base mt-2">
        Le tue emozioni, visibili come il meteo
      </Text>
    </View>
  );
}
