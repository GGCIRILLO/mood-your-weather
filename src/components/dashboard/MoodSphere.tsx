// ============================================
// MOOD SPHERE - Animated 3D sphere with glow
// ============================================

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";

interface MoodSphereProps {
  mood?: "sunny" | "cloudy" | "rainy" | "stormy" | "partly";
  size?: number;
}

export function MoodSphere({ mood = "sunny", size = 192 }: MoodSphereProps) {
  // Animation values
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);

  const moodColors = {
    sunny: {
      center: "#ffd700",
      middle: "#ffb700",
      edge: "#ff8c00",
    },
    cloudy: {
      center: "#b0c4de",
      middle: "#87a0b8",
      edge: "#6c8199",
    },
    rainy: {
      center: "#4a90e2",
      middle: "#357abd",
      edge: "#2563a8",
    },
    stormy: {
      center: "#4b5563",
      middle: "#374151",
      edge: "#1f2937",
    },
    partly: {
      center: "#fbbf24",
      middle: "#f59e0b",
      edge: "#d97706",
    },
  };

  const colors = moodColors[mood];

  useEffect(() => {
    // Pulse animation (scale)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    // Float animation (translateY)
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    // Glow pulse
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ] as any,
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      opacity: glowOpacity.value,
    };
  });

  // Expanded size for glow effect
  const glowSize = size * 2;

  return (
    <View style={styles.container}>
      {/* The animated sphere with glow effect */}
      <Animated.View
        style={[{ width: glowSize, height: glowSize }, animatedStyle]}
      >
        <Svg
          width={glowSize}
          height={glowSize}
          viewBox={`0 0 ${glowSize} ${glowSize}`}
        >
          <Defs>
            {/* Glow gradient - outer halo */}
            <RadialGradient
              id={`moodGlow-${mood}`}
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              {/* Center - Transparent to let sphere show through */}
              <Stop offset="0%" stopColor={colors.edge} stopOpacity="0" />
              <Stop offset="48%" stopColor={colors.edge} stopOpacity="0" />

              {/* Start of glow - around the sphere edge */}
              <Stop offset="50%" stopColor={colors.edge} stopOpacity="0.4" />

              {/* Glow area - Gradual fade to transparent */}
              <Stop offset="65%" stopColor={colors.edge} stopOpacity="0.25" />
              <Stop offset="80%" stopColor={colors.edge} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={colors.edge} stopOpacity="0" />
            </RadialGradient>

            {/* Sphere gradient - 3D effect */}
            <RadialGradient
              id={`moodSphere-${mood}`}
              cx="30%"
              cy="30%"
              r="70%"
              fx="30%"
              fy="30%"
            >
              <Stop offset="0%" stopColor={colors.center} stopOpacity="1" />
              <Stop offset="50%" stopColor={colors.middle} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.edge} stopOpacity="1" />
            </RadialGradient>
          </Defs>

          {/* Background glow circle - larger */}
          <Circle
            cx={glowSize / 2}
            cy={glowSize / 2}
            r={glowSize / 2}
            fill={`url(#moodGlow-${mood})`}
          />

          {/* Foreground sphere circle - centered, original size with 3D effect */}
          <Circle
            cx={glowSize / 2}
            cy={glowSize / 2}
            r={size / 2}
            fill={`url(#moodSphere-${mood})`}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
