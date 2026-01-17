import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  Sliders,
  NotePencil,
  Microphone,
  CheckCircle,
} from "phosphor-react-native";
import Slider from "@react-native-community/slider";
import { useEffect } from "react";

interface BottomActionBarProps {
  intensity: number;
  onIntensityChange: (value: number) => void;
  showNoteInput: boolean;
  onToggleNoteInput: () => void;
  note: string;
  onNoteChange: (text: string) => void;
  onSave: () => void;
  saving: boolean;
  moodAnalysis: string;
  bottomInset: number;
}

export function BottomActionBar({
  intensity,
  onIntensityChange,
  showNoteInput,
  onToggleNoteInput,
  note,
  onNoteChange,
  onSave,
  saving,
  moodAnalysis,
  bottomInset,
}: BottomActionBarProps) {
  const noteInputHeight = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(showNoteInput ? 120 : 0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      opacity: withTiming(showNoteInput ? 1 : 0, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      marginTop: withTiming(showNoteInput ? 16 : 0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottomInset + 32,
          paddingTop: 24,
          paddingHorizontal: 24,
        },
      ]}
    >
      {/* Analysis Panel */}
      <View style={styles.analysisContainer}>
        <View style={styles.analysisContent}>
          <Text style={styles.analysisTitle}>Current Mood Analysis</Text>
          <Text style={styles.analysisText}>{moodAnalysis}</Text>
        </View>
      </View>

      {/* Intensity Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <View style={styles.sliderLabelContainer}>
            <Sliders size={16} color="white" weight="bold" />
            <Text style={styles.sliderLabel}>Intensity</Text>
          </View>
          <Text style={styles.intensityValue}>{intensity}%</Text>
        </View>
        <Slider
          value={intensity}
          onValueChange={onIntensityChange}
          minimumValue={0}
          maximumValue={100}
          step={5}
          minimumTrackTintColor="#135bec"
          maximumTrackTintColor="rgba(50, 68, 103, 0.4)"
          thumbTintColor="#ffffff"
          style={styles.slider}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable onPress={onToggleNoteInput} style={styles.iconButton}>
          <NotePencil size={24} color="white" weight="bold" />
        </Pressable>

        <Pressable style={styles.iconButton}>
          <Microphone size={24} color="white" weight="bold" />
        </Pressable>

        <Pressable
          onPress={onSave}
          disabled={saving}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>
            {saving ? "Saving..." : "Log Mood"}
          </Text>
          <CheckCircle size={20} color="white" weight="fill" />
        </Pressable>
      </View>

      {/* Collapsible Note Input */}
      <Animated.View style={[styles.noteInputContainer, noteInputHeight]}>
        <TextInput
          value={note}
          onChangeText={onNoteChange}
          placeholder="Write your thoughts..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          multiline
          numberOfLines={3}
          style={styles.noteInput}
          editable={showNoteInput}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(16, 22, 34, 0.6)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  analysisContainer: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  analysisContent: {
    flex: 1,
  },
  analysisTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 4,
  },
  analysisText: {
    color: "#92a4c9",
    fontSize: 14,
    lineHeight: 20,
  },
  sliderContainer: {
    marginBottom: 32,
  },
  sliderHeader: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sliderLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sliderLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  intensityValue: {
    color: "#135bec",
    fontSize: 14,
    fontWeight: "700",
  },
  slider: {
    height: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1e2738",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 9999,
    backgroundColor: "#135bec",
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  noteInputContainer: {
    backgroundColor: "#1e2738",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  noteInput: {
    color: "white",
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
});
