import { View, Text } from "react-native";
import { memo } from "react";
import type { MoodEntry } from "@/types";
import DayCell, { type DayData } from "./DayCell";

interface CalendarGridProps {
  calendarDays: DayData[];
  onDayPress: (date: Date, entries: MoodEntry[]) => void;
}

const CalendarGrid = memo(({ calendarDays, onDayPress }: CalendarGridProps) => {
  return (
    <View className="px-4 mb-6">
      <View className="bg-[#192233] rounded-3xl p-4 border border-slate-800">
        {/* Weekday Headers */}
        <View className="flex-row mb-4">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-wider">
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Days */}
        <View className="flex-row flex-wrap">
          {calendarDays.map((dayData) => (
            <DayCell
              key={dayData.date.toISOString()}
              dayData={dayData}
              onPress={onDayPress}
            />
          ))}
        </View>
      </View>
    </View>
  );
});

CalendarGrid.displayName = "CalendarGrid";

export default CalendarGrid;
