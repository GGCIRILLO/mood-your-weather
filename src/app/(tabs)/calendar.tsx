import { View, ScrollView, StyleSheet } from "react-native";
import { useState, useMemo, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  isToday,
} from "date-fns";
import { useMoods } from "@/hooks/api/useMoods";
import type { MoodEntry } from "@/types";
import {
  CalendarHeader,
  CalendarGrid,
  DayDetailModal,
  type DayData,
} from "@/components/calendar";

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<MoodEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const { moods = [] } = useMoods({ limit: 100 });

  // Month boundaries
  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate]);

  // Navigation handlers
  const handlePrevMonth = useCallback(() => {
    setCurrentDate((d) => subMonths(d, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    const next = addMonths(currentDate, 1);
    if (isAfter(startOfMonth(next), startOfMonth(new Date()))) return;
    setCurrentDate(next);
  }, [currentDate]);

  const isNextDisabled = useMemo(() => {
    return isAfter(
      startOfMonth(addMonths(currentDate, 1)),
      startOfMonth(new Date()),
    );
  }, [currentDate]);

  // Calendar days computation (optimized)
  const calendarDays = useMemo(() => {
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

    return days.map((day): DayData => {
      const isOutsideMonth =
        isBefore(day, monthStart) || isAfter(day, monthEnd);
      const entries = moods.filter((entry) =>
        isSameDay(new Date(entry.timestamp), day),
      );

      return {
        date: day,
        entries,
        isOutsideMonth,
        isToday: isToday(day),
        isFuture: isAfter(day, new Date()),
      };
    });
  }, [monthStart, monthEnd, moods]);

  // Day press handler
  const handleDayPress = useCallback((date: Date, entries: MoodEntry[]) => {
    setSelectedDate(date);
    setSelectedEntries(entries);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedDate(null);
      setSelectedEntries([]);
    }, 300);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        {/* Background Blur Blobs */}
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            isNextDisabled={isNextDisabled}
          />

          {/* Calendar Grid */}
          <View className="pt-2">
            <CalendarGrid
              calendarDays={calendarDays}
              onDayPress={handleDayPress}
            />
          </View>
        </ScrollView>

        {/* Day Detail Modal */}
        <DayDetailModal
          visible={modalVisible}
          date={selectedDate}
          entries={selectedEntries}
          onClose={handleCloseModal}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  blueBlob: {
    position: "absolute",
    top: "20%",
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: "rgba(19, 91, 236, 0.15)",
    borderRadius: 9999,
  },
  purpleBlob: {
    position: "absolute",
    bottom: "33%",
    left: -40,
    width: 320,
    height: 320,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderRadius: 9999,
  },
});
