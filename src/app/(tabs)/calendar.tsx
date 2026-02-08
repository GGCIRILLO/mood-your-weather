// ============================================
// CALENDAR VIEW - Monthly mood history + Weekly chart (FIXED GRID)
// ============================================

import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useMoodEntries } from "@/hooks/storage/useStorage";
import { WEATHER_TYPE_TO_EMOJI } from "@/utils/constants";
import WeeklyMoodChart from "@/components/MonthlyStats/WeeklyMoodChart";
import { LinearGradient } from "expo-linear-gradient";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isAfter,
} from "date-fns";
import {
  getMonthEntries,
  calculateStreak,
  calculatePositivePercent,
} from "@/components/MonthlyStats/MonthStats";

// Sentiment mapping per emoji
const SENTIMENT_MAP: Record<string, number> = {
  "☀️": 1.0,
  "⛅": 0.5,
  "☁️": 0.0,
  "🌧️": -0.5,
  "⛈️": -0.8,
  "🌈": 0.9,
  "🌙": 0.3,
  "⚡": 0.6,
  "❄️": -0.3,
  "🌪️": -0.9,
};

// Calcola il sentiment medio da una lista di emoji
function calculateAverageSentiment(emojis: string[]): number {
  if (!emojis || emojis.length === 0) return 0;
  const total = emojis.reduce((acc, emoji) => acc + (SENTIMENT_MAP[emoji] ?? 0), 0);
  return total / emojis.length;
}

// Trova l'emoji più vicina al sentiment value
function findClosestEmoji(sentiment: number): string {
  let closest = "☁️";
  let minDist = Infinity;

  for (const [emoji, emojiSentiment] of Object.entries(SENTIMENT_MAP)) {
    const dist = Math.abs(emojiSentiment - sentiment);
    if (dist < minDist) {
      minDist = dist;
      closest = emoji;
    }
  }
  return closest;
}

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { moods = [] } = useMoods({ limit: 100 });

  useEffect(() => {
    console.log("📅 [CALENDAR] Moods caricati:", moods.length);
    console.log(
      "📅 [CALENDAR] Dettagli moods:",
      JSON.stringify(moods.slice(0, 3), null, 2)
    );

    if (moods.length === 0) {
      console.warn("⚠️ [CALENDAR] Nessun mood caricato!");
    } else {
      console.log("✅ [CALENDAR] Mood caricati correttamente");
      moods.forEach((mood, idx) => {
        console.log(
          `  Mood ${idx + 1}: ${mood.timestamp} - Emojis: ${mood.emojis?.join(", ")}`
        );
      });
    }
  }, [moods]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const goPrevMonth = () => setCurrentDate((d) => subMonths(d, 1));
  const goNextMonth = () => {
    const next = addMonths(currentDate, 1);
    if (isAfter(startOfMonth(next), startOfMonth(new Date()))) return;
    setCurrentDate(next);
  };
  const isNextDisabled = isAfter(
    startOfMonth(addMonths(currentDate, 1)),
    startOfMonth(new Date())
  );
  const monthMoods = getMonthEntries(moods, currentDate);
  const monthEntriesCount = monthMoods.length;
  // streak should usually be based on ALL moods, not just month
  const streakDays = calculateStreak(moods);
  const positivePercent = calculatePositivePercent(
    monthMoods,
    WEATHER_TYPE_TO_EMOJI
  );


  // start from Monday of the first week that contains the 1st of the month
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  // end on Sunday of the last week that contains the last day of the month
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // This includes "padding days" before/after month to align correctly
  const calendarDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const getEntriesForDay = (day: Date) => {
    const dayEntries = moods.filter((entry) =>
      isSameDay(new Date(entry.timestamp), day)
    );

    if (dayEntries.length > 0) {
      console.log(
        `📍 [DAY] ${format(day, "yyyy-MM-dd")}: ${dayEntries.length} entry/ies - Emojis: ${dayEntries[0].emojis?.join(", ")}`
      );
    }
    return dayEntries;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        {/* Background Blur Blobs */}
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View
            style={{
              paddingTop: insets.top + 12,
              paddingBottom: 12,
              paddingHorizontal: 16,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "rgba(11, 17, 33, 0.95)",
              zIndex: 50,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              <CaretLeft size={24} color="white" />
            </Pressable>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
                letterSpacing: 0.5,
                marginLeft: 16,
              }}
            >
              Calendar
            </Text>
          </View>

          {/* Weekly Mood Chart */}
          <View className="px-4 mb-8">
            <WeeklyMoodChart
              moods={moods}
              weatherTypeToEmoji={WEATHER_TYPE_TO_EMOJI}
              cardClassName="bg-[#192233] rounded-3xl p-6 shadow-lg border border-slate-800"
              title="Last 7 Days"
              subtitle="Emotional Trend"
            />
          </View>

          {/* Month/Year info */}
          <View className="px-4 pt-4 pb-4 flex-row items-center justify-between">
            <Pressable
              onPress={goPrevMonth}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/5"
              hitSlop={10}
            >
            <Text className="text-white text-xl">‹</Text>
              </Pressable>
                <Text className="text-slate-200 text-base font-semibold">
                  {format(currentDate, "MMMM yyyy")}
                </Text>
              <Pressable
                onPress={goNextMonth}
                disabled={isNextDisabled}
                className={`w-10 h-10 items-center justify-center rounded-full ${
                  isNextDisabled ? "bg-white/0" : "bg-white/5"
                }`}
                hitSlop={10}
              >
                <Text className={`${isNextDisabled ? "text-slate-600" : "text-white"} text-xl`}>
                  ›
                </Text>
              </Pressable>
          </View>

          {/* Calendar Grid */}
          <View className="px-4 mb-6">
            <View className="bg-[#192233] rounded-3xl p-4 shadow-lg border border-slate-800">
              {/* Weekday headers (Mon-first) */}
              <View className="flex-row mb-4">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <View key={index} className="flex-1 items-center">
                    <Text className="text-slate-400 font-semibold text-sm">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar days (with padding days) */}
              <View className="flex-row flex-wrap">
                {calendarDays.map((day, index) => {
                  const isOutsideMonth = day < monthStart || day > monthEnd;

                  const dayEntries = getEntriesForDay(day);
                  const hasEntry = dayEntries.length > 0;

                  let displayEmoji: string | null = null;

                  if (hasEntry && !isOutsideMonth) {
                    // Convert stored types -> emoji for sentiment calculation
                    const emojiTypes = dayEntries.flatMap((entry) => entry.emojis || []);
                    const mappedEmojis = emojiTypes.map(
                      (type) => WEATHER_TYPE_TO_EMOJI[type] || "☁️"
                    );

                    const mappedSentiment = calculateAverageSentiment(mappedEmojis);
                    displayEmoji = findClosestEmoji(mappedSentiment);

                    console.log(
                      `📍 [DAY] ${format(day, "yyyy-MM-dd")}: ${
                        dayEntries.length
                      } entries - Emojis: ${mappedEmojis.join(
                        ", "
                      )} - Sentiment medio: ${mappedSentiment.toFixed(
                        2
                      )} - Emoji risultante: ${displayEmoji}`
                    );
                  }

                  return (
                    <View key={index} className="w-[14.28%] aspect-square p-1">
                      <Pressable
                        disabled={isOutsideMonth || !hasEntry}
                        onPress={() => {
                          if (!isOutsideMonth && hasEntry) {
                            router.push({
                              pathname: "/daily-mood",
                              params: { date: format(day, "yyyy-MM-dd") },
                            });
                          }
                        }}
                        className={`flex-1 items-center justify-center rounded-xl ${
                          isOutsideMonth
                            ? "bg-transparent"
                            : hasEntry
                            ? "bg-[#2F6BFF]/20"
                            : "bg-slate-800/40"
                        }`}
                      >
                        {isOutsideMonth ? (
                          // keep layout consistent without showing numbers
                          <Text className="text-transparent">0</Text>
                        ) : hasEntry && displayEmoji ? (
                          <Text className="text-2xl">{displayEmoji}</Text>
                        ) : (
                          <Text className="text-slate-600 text-sm">
                            {format(day, "d")}
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Stats */}
          <View className="px-4 mb-8">
            <View className="bg-[#192233] rounded-2xl p-6 shadow border border-slate-800">
              <Text className="text-white text-lg font-bold mb-4">
                Month Statistics
              </Text>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-3xl mb-1">📊</Text>
                  <Text className="text-white text-xl font-bold">
                    {monthEntriesCount}
                  </Text>
                  <Text className="text-slate-400 text-sm">Entries</Text>
                </View>

                <View className="items-center">
                  <Text className="text-3xl mb-1">🔥</Text>
                  <Text className="text-white text-xl font-bold">{streakDays}</Text>
                  <Text className="text-slate-400 text-sm">Streak</Text>
                </View>

                <View className="items-center">
                  <Text className="text-3xl mb-1">☀️</Text>
                  <Text className="text-white text-xl font-bold">{positivePercent}%</Text>
                  <Text className="text-slate-400 text-sm">Positive</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
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
