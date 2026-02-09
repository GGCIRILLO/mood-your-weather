import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { CloudRainIcon, CloudIcon, SunIcon } from "phosphor-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

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
        scheduleOnRN(navigateNext);
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
    <View className="flex-1 bg-[#1a2533]">
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
          Aligning your emotional horizon
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cloudDecor: {
    position: "absolute",
    width: 320,
    height: 320,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
    opacity: 0.4,
  },
});
