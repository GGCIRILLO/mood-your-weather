import {
  View,
  Text,
  Pressable,
  ImageBackground,
  Modal,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CaretDown, DotsThree, Pause, Play } from "phosphor-react-native";
import Slider from "@react-native-community/slider";
import { Practice } from "@/utils/practicesData";
import { formatTime } from "@/utils/audioUtils";
import { useEffect, useRef } from "react";
import { useCompleteActivity } from "@/hooks/api/useCompleteActivity";

interface PlayerModalProps {
  visible: boolean;
  practice: Practice | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  onClose: () => void;
  onTogglePlayback: () => void;
  onSeek: (position: number) => void;
}

export const PlayerModal = ({
  visible,
  practice,
  isPlaying,
  position,
  duration,
  onClose,
  onTogglePlayback,
  onSeek,
}: PlayerModalProps) => {
  const insets = useSafeAreaInsets();
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const { mutate: completeActivity } = useCompleteActivity();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.2,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [visible]);

  // Reset completion flag when modal closes or practice changes
  useEffect(() => {
    if (!visible || !practice) {
      hasCompletedRef.current = false;
    }
  }, [visible, practice]);

  // Auto-complete activity when audio finishes
  useEffect(() => {
    // Check if audio has finished (with 500ms tolerance)
    if (
      duration > 0 &&
      position >= duration - 500 &&
      !hasCompletedRef.current
    ) {
      hasCompletedRef.current = true;
      completeActivity();
    }
  }, [position, duration, completeActivity]);

  if (!practice) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={{ flex: 1, backgroundColor: "#0b1121" }}>
        <ImageBackground
          source={{ uri: practice.image }}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(11,17,33,0.6)",
            }}
          />

          <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 24,
                marginBottom: 40,
              }}
            >
              <Pressable
                onPress={onClose}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(25, 34, 51, 0.6)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.05)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CaretDown size={20} color="rgba(255,255,255,0.7)" />
              </Pressable>
              <View
                style={{
                  backgroundColor: "rgba(25, 34, 51, 0.6)",
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.05)",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#ef4444",
                  }}
                />
                <Text
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 12,
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Live Session
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Animated.View style={{ transform: [{ scale: breatheAnim }] }}>
                <View
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 64,
                    backgroundColor: practice.color,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: practice.color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 60,
                  }}
                >
                  <practice.icon size={48} color="white" weight="fill" />
                </View>
              </Animated.View>
              <Text
                style={{
                  marginTop: 48,
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 14,
                  fontWeight: "500",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                {practice.tag === "Breathwork"
                  ? "Breathe In"
                  : "Immerse Yourself"}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 24,
                paddingBottom: insets.bottom + 24,
                gap: 24,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                >
                  {practice.title}
                </Text>
                <Text
                  style={{ color: "#135bec", fontSize: 14, fontWeight: "500" }}
                >
                  {practice.tag} • {practice.type}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  height: 48,
                }}
              >
                {[3, 5, 8, 4, 6, 10, 7, 4, 8, 5, 3].map((height, i) => (
                  <View
                    key={i}
                    style={{
                      width: 4,
                      height: height * 4,
                      borderRadius: 2,
                      backgroundColor:
                        i >= 4 && i <= 7 ? "#135bec" : "rgba(255,255,255,0.3)",
                    }}
                  />
                ))}
              </View>

              <View style={{ gap: 8 }}>
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0}
                  maximumValue={duration}
                  value={position}
                  minimumTrackTintColor="#135bec"
                  maximumTrackTintColor="rgba(255,255,255,0.1)"
                  thumbTintColor="white"
                  onSlidingComplete={onSeek}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    marginTop: -10,
                  }}
                >
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {formatTime(position)}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {formatTime(duration)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 16,
                  paddingBottom: 20,
                }}
              >
                <Pressable
                  onPress={onTogglePlayback}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "white",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 30,
                  }}
                >
                  {isPlaying ? (
                    <Pause size={48} color="#0b1121" weight="fill" />
                  ) : (
                    <Play size={48} color="#0b1121" weight="fill" />
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};
