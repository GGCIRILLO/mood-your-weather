import { View, Text, Pressable, StyleSheet } from "react-native";
import { memo, useMemo, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ShuffleIcon } from "phosphor-react-native";
import { format } from "date-fns";
import type { MoodEntry } from "@/types";
import {
  calculateAverageSentiment,
  findClosestEmojiType,
  EMOJI_TO_ICON,
  EMOJI_TO_COLOR,
} from "./utils";

interface DayData {
  date: Date;
  entries: MoodEntry[];
  isOutsideMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

interface DayCellProps {
  dayData: DayData;
  onPress: (date: Date, entries: MoodEntry[]) => void;
}

const DayCell = memo(({ dayData, onPress }: DayCellProps) => {
  const {
    date,
    entries,
    isOutsideMonth,
    isToday: isDayToday,
    isFuture,
  } = dayData;

  const displayType = useMemo(() => {
    if (entries.length === 0 || isOutsideMonth) return null;

    const allEmojiTypes = entries.flatMap((entry) => entry.emojis);
    const avgSentiment = calculateAverageSentiment(allEmojiTypes);
    return findClosestEmojiType(avgSentiment);
  }, [entries, isOutsideMonth]);

  const hasMultipleTypes = useMemo(() => {
    if (!entries.length) return false;
    const uniqueTypes = new Set(entries.flatMap((entry) => entry.emojis));
    return uniqueTypes.size > 1;
  }, [entries]);

  const Icon = useMemo(() => {
    if (!displayType) return null;
    return hasMultipleTypes ? ShuffleIcon : EMOJI_TO_ICON[displayType];
  }, [displayType, hasMultipleTypes]);

  const colors = useMemo(() => {
    if (!entries.length || !displayType) return null;
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

  const handlePress = useCallback(() => {
    if (!isOutsideMonth && entries.length > 0) {
      onPress(date, entries);
    }
  }, [date, entries, isOutsideMonth, onPress]);

  if (isOutsideMonth) {
    return <View className="w-[14.28%] aspect-square p-1" />;
  }

  const hasEntry = entries.length > 0;

  return (
    <View className="w-[14.28%] aspect-square p-1">
      {isDayToday && hasEntry && (
        <View style={styles.todayBanner}>
          <Text style={styles.todayBannerText}>TODAY</Text>
        </View>
      )}
      <Pressable
        onPress={handlePress}
        disabled={!hasEntry}
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          opacity: isFuture ? 0.4 : 1,
        }}
      >
        {hasEntry && Icon && colors ? (
          hasMultipleTypes && Array.isArray(colors) ? (
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientCell}
            >
              <Icon size={20} color="white" weight="fill" />
              <Text style={styles.dayNumber}>{format(date, "d")}</Text>
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.gradientCell,
                { backgroundColor: colors as string },
              ]}
            >
              <Icon size={20} color="white" weight="fill" />
              <Text style={styles.dayNumber}>{format(date, "d")}</Text>
            </View>
          )
        ) : isFuture ? (
          <View style={styles.futureCell}>
            <Text style={styles.futureCellText}>{format(date, "d")}</Text>
          </View>
        ) : (
          <View style={styles.emptyCell}>
            <Text style={styles.emptyCellText}>{format(date, "d")}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
});

DayCell.displayName = "DayCell";

const styles = StyleSheet.create({
  gradientCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  todayBanner: {
    position: "absolute",
    top: -6,
    left: "50%",
    transform: [{ translateX: -20 }],
    backgroundColor: "#135bec",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 10,
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  todayBannerText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
  },
  dayNumber: {
    position: "absolute",
    bottom: 4,
    right: 6,
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.9)",
  },
  futureCell: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  futureCellText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.3)",
  },
  emptyCell: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCellText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.4)",
  },
});

export default DayCell;
export type { DayData };
