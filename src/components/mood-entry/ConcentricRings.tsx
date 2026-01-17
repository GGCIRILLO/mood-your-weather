import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";

interface ConcentricRingsProps {
  ring1Opacity: SharedValue<number>;
}

export function ConcentricRings({ ring1Opacity }: ConcentricRingsProps) {
  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1Opacity.value,
  }));

  return (
    <>
      <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />
      <View style={[styles.ring, styles.ring2]} />
      <View style={[styles.ring, styles.ring3]} />
    </>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  ring1: {
    width: 288,
    height: 288,
  },
  ring2: {
    width: 224,
    height: 224,
    opacity: 0.5,
  },
  ring3: {
    width: 160,
    height: 160,
    opacity: 0.8,
  },
});
