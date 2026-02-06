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
  isEmpty?: boolean;
}

export function MoodSphere({
  mood = "sunny",
  size = 192,
  isEmpty = false,
}: MoodSphereProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);

  const moodColors = {
    sunny: { center: "#fbbf24", middle: "#f59e0b", edge: "#d97706" },
    partly: { center: "#ffffff", middle: "#f3f4f6", edge: "#d1d5db" },
    cloudy: { center: "#9ca3af", middle: "#6b7280", edge: "#4b5563" },
    rainy: { center: "#60a5fa", middle: "#3b82f6", edge: "#2563eb" },
    stormy: { center: "#a78bfa", middle: "#8b5cf6", edge: "#7c3aed" },
  } as const;

  const colors = moodColors[mood];
  const glowSize = size * 2;

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

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

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  // Separate glow style to apply only to the background glow
  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: isEmpty ? 0 : glowOpacity.value, // Hide glow when empty if desired, or keep soft
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          { width: glowSize, height: glowSize },
          animatedStyle,
          // Removed glowAnimatedStyle from here so the main sphere is not affected
        ]}
      >
        <Svg
          width={glowSize}
          height={glowSize}
          viewBox={`0 0 ${glowSize} ${glowSize}`}
        >
          <Defs>
            {/* Glow standard per i mood pieni */}
            <RadialGradient
              id={`moodGlow-${mood}`}
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor={colors.edge} stopOpacity="0" />
              <Stop offset="48%" stopColor={colors.edge} stopOpacity="0" />
              <Stop offset="50%" stopColor={colors.edge} stopOpacity="0.4" />
              <Stop offset="65%" stopColor={colors.edge} stopOpacity="0.25" />
              <Stop offset="80%" stopColor={colors.edge} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={colors.edge} stopOpacity="0" />
            </RadialGradient>

            {/* Glow specifico per empty: bianco molto soft */}
            <RadialGradient
              id="moodGlow-empty"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
              <Stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <Stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>

            {/* Sphere gradient per i mood pieni */}
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

            {/* Sphere "glass" per empty */}
            <RadialGradient
              id="moodSphere-empty"
              cx="30%"
              cy="30%"
              r="70%"
              fx="30%"
              fy="30%"
            >
              {/* zona alta un po' più bianca */}
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.48" />
              <Stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.30" />
              {/* verso il bordo sfuma */}
              <Stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
            </RadialGradient>
          </Defs>

          {/* Background glow - Pulsating */}
          <AnimatedCircle
            cx={glowSize / 2}
            cy={glowSize / 2}
            r={glowSize / 2}
            fill={`url(#${isEmpty ? "moodGlow-empty" : `moodGlow-${mood}`})`}
            animatedProps={glowStyle as any}
          />

          {/* Sphere - Solid and Opaque */}
          {isEmpty ? (
            <>
              {/* Riempimento quasi trasparente */}
              <Circle
                cx={glowSize / 2}
                cy={glowSize / 2}
                r={size / 2}
                fill="url(#moodSphere-empty)"
              />
              {/* Bordo vetroso */}
              <Circle
                cx={glowSize / 2}
                cy={glowSize / 2}
                r={size / 2}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={2}
              />
            </>
          ) : (
            <Circle
              cx={glowSize / 2}
              cy={glowSize / 2}
              r={size / 2}
              fill={`url(#${`moodSphere-${mood}`})`}
              opacity={1}
            />
          )}
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
