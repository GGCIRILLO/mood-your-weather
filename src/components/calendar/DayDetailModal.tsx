import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import { memo, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { XIcon, ShuffleIcon } from "phosphor-react-native";
import { format, isToday } from "date-fns";
import type { MoodEntry } from "@/types";
import {
  calculateAverageSentiment,
  findClosestEmojiType,
  getMoodLabel,
  EMOJI_TO_ICON,
  EMOJI_TO_COLOR,
} from "./utils";

interface DayDetailModalProps {
  visible: boolean;
  date: Date | null;
  entries: MoodEntry[];
  onClose: () => void;
}

const DayDetailModal = memo(
  ({ visible, date, entries, onClose }: DayDetailModalProps) => {
    if (!date) return null;

    const displayType = useMemo(() => {
      if (entries.length === 0) return "cloudy";
      const allEmojiTypes = entries.flatMap((entry) => entry.emojis);
      const avgSentiment = calculateAverageSentiment(allEmojiTypes);
      return findClosestEmojiType(avgSentiment);
    }, [entries]);

    const hasMultipleTypes = useMemo(() => {
      if (!entries.length) return false;
      const uniqueTypes = new Set(entries.flatMap((entry) => entry.emojis));
      return uniqueTypes.size > 1;
    }, [entries]);

    const Icon = useMemo(() => {
      return hasMultipleTypes ? ShuffleIcon : EMOJI_TO_ICON[displayType];
    }, [displayType, hasMultipleTypes]);

    const colors = useMemo(() => {
      if (hasMultipleTypes) {
        const uniqueTypes = Array.from(
          new Set(entries.flatMap((entry) => entry.emojis)),
        );
        return [
          EMOJI_TO_COLOR[uniqueTypes[0]],
          EMOJI_TO_COLOR[uniqueTypes[1] || uniqueTypes[0]],
        ];
      }
      return EMOJI_TO_COLOR[displayType];
    }, [entries, displayType, hasMultipleTypes]);

    const moodLabel = useMemo(() => getMoodLabel(displayType), [displayType]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
          <Pressable
            className="bg-[#0B1121] rounded-t-3xl border-t border-white/10 max-h-[80%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <View className="w-full items-center pt-3 pb-1">
              <View className="h-1.5 w-12 rounded-full bg-white/20" />
            </View>

            <View className="px-6 pt-2 pb-6">
              {/* Header */}
              <View className="flex-row items-start justify-between mb-4">
                <View>
                  <Text className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide">
                    {isToday(date) ? "Today" : format(date, "EEEE")}
                  </Text>
                  <Text className="text-3xl font-bold text-white mt-1">
                    {format(date, "MMM d")}
                  </Text>
                </View>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <XIcon size={24} color="#94A3B8" />
                </Pressable>
              </View>

              {/* Main Mood Card */}
              {hasMultipleTypes && Array.isArray(colors) ? (
                <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.moodCard}
                >
                  <View style={styles.emojiBackground}>
                    <Icon
                      size={100}
                      color="rgba(255,255,255,0.2)"
                      weight="fill"
                    />
                  </View>
                  <View style={styles.moodContent}>
                    <View style={styles.emojiCircle}>
                      <Icon size={32} color="white" weight="fill" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.moodTitle}>{moodLabel}</Text>
                    </View>
                  </View>

                  {/* Notes */}
                  {entries.some((e) => e.note) && (
                    <View style={styles.notesContainer}>
                      {entries.map((entry, idx) => {
                        if (!entry.note) return null;
                        return (
                          <Text
                            key={entry.id}
                            style={{
                              fontSize: 14,
                              lineHeight: 20,
                              color: "rgba(255,255,255,0.9)",
                              fontStyle: "italic",
                              marginBottom: idx < entries.length - 1 ? 8 : 0,
                            }}
                          >
                            "{entry.note}"
                          </Text>
                        );
                      })}
                    </View>
                  )}
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.moodCard,
                    { backgroundColor: colors as string },
                  ]}
                >
                  <View style={styles.emojiBackground}>
                    <Icon
                      size={100}
                      color="rgba(255,255,255,0.2)"
                      weight="fill"
                    />
                  </View>
                  <View style={styles.moodContent}>
                    <View style={styles.emojiCircle}>
                      <Icon size={32} color="white" weight="fill" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.moodTitle}>{moodLabel}</Text>
                    </View>
                  </View>

                  {/* Notes */}
                  {entries.some((e) => e.note) && (
                    <View style={styles.notesContainer}>
                      {entries.map((entry, idx) => {
                        if (!entry.note) return null;
                        return (
                          <Text
                            key={entry.id}
                            style={{
                              fontSize: 14,
                              lineHeight: 20,
                              color: "rgba(255,255,255,0.9)",
                              fontStyle: "italic",
                              marginBottom: idx < entries.length - 1 ? 8 : 0,
                            }}
                          >
                            "{entry.note}"
                          </Text>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {/* Weather Context Card */}
              <View style={styles.weatherCard}>
                <View style={styles.weatherCardGradient} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherLabel}>Weather Context</Text>
                  <Text style={styles.weatherInfo}>Coming soon...</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  },
);

DayDetailModal.displayName = "DayDetailModal";

const styles = StyleSheet.create({
  moodCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emojiBackground: {
    position: "absolute",
    right: -16,
    top: -16,
    opacity: 0.3,
  },
  moodContent: {
    position: "relative",
    zIndex: 10,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  emojiCircle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  moodTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  moodSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  notesContainer: {
    position: "relative",
    zIndex: 10,
    marginTop: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  weatherCard: {
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    position: "relative",
  },
  weatherCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  weatherContent: {
    position: "relative",
    zIndex: 1,
  },
  weatherLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  weatherInfo: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default DayDetailModal;
