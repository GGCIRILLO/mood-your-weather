// ============================================
// CALENDAR VIEW - Monthly mood history
// ============================================

import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useMoodEntries } from "@/hooks/storage/useStorage";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { it } from "date-fns/locale";

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { entries } = useMoodEntries();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntriesForDay = (day: Date) => {
    return entries.filter((entry) => isSameDay(new Date(entry.timestamp), day));
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="py-6">
          <Text className="text-gray-900 text-3xl font-bold">Calendar</Text>
          <Text className="text-gray-600 text-base mt-1">
            {format(currentDate, "MMMM yyyy", { locale: it })}
          </Text>
        </View>

        {/* Calendar Grid */}
        <View className="bg-white rounded-3xl p-4 shadow-lg mb-6">
          {/* Weekday headers */}
          <View className="flex-row mb-4">
            {["L", "M", "M", "G", "V", "S", "D"].map((day, index) => (
              <View key={index} className="flex-1 items-center">
                <Text className="text-gray-500 font-semibold text-sm">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar days */}
          <View className="flex-row flex-wrap">
            {daysInMonth.map((day, index) => {
              const dayEntries = getEntriesForDay(day);
              const hasEntry = dayEntries.length > 0;
              const dominantEmoji = hasEntry ? dayEntries[0].emojis[0] : null;

              return (
                <View key={index} className="w-[14.28%] aspect-square p-1">
                  <Pressable
                    onPress={() => {}}
                    className={`flex-1 items-center justify-center rounded-xl ${
                      hasEntry ? "bg-blue-100" : "bg-gray-50"
                    }`}
                  >
                    {hasEntry && dominantEmoji ? (
                      <Text className="text-2xl">{dominantEmoji}</Text>
                    ) : (
                      <Text className="text-gray-400 text-sm">
                        {format(day, "d")}
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>

        {/* Stats */}
        <View className="bg-white rounded-2xl p-6 shadow mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">
            Statistiche del mese
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-3xl mb-1">📊</Text>
              <Text className="text-gray-900 text-xl font-bold">
                {entries.length}
              </Text>
              <Text className="text-gray-500 text-sm">Entries</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl mb-1">🔥</Text>
              <Text className="text-gray-900 text-xl font-bold">5</Text>
              <Text className="text-gray-500 text-sm">Streak</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl mb-1">☀️</Text>
              <Text className="text-gray-900 text-xl font-bold">68%</Text>
              <Text className="text-gray-500 text-sm">Positive</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
