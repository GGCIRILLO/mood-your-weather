// ============================================
// CALENDAR VIEW - Monthly mood history + Weekly chart
// ============================================

import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMoods } from "@/hooks/api/useMoods";
import { WEATHER_TYPE_TO_EMOJI } from "@/utils/constants";
import WeeklyMoodChart from "@/components/Insights/WeeklyMoodChart";
import { LinearGradient } from "expo-linear-gradient";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { it } from "date-fns/locale";

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

// Mappa sentiment inversa per trovare l'emoji più vicino
const SENTIMENT_TO_EMOJI: Record<string, string> = {
  "1": "☀️",
  "0.9": "🌈",
  "0.6": "⚡",
  "0.5": "⛅",
  "0.3": "🌙",
  "0": "☁️",
  "-0.3": "❄️",
  "-0.5": "🌧️",
  "-0.8": "⛈️",
  "-0.9": "🌪️",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Calcola il sentiment medio da una lista di emoji
function calculateAverageSentiment(emojis: string[]): number {
  if (emojis.length === 0) return 0;
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
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { moods = [] } = useMoods({ limit: 100 });

  // Debug logs
  useEffect(() => {
    console.log("📅 [CALENDAR] Moods caricati:", moods.length);
    console.log("📅 [CALENDAR] Dettagli moods:", JSON.stringify(moods.slice(0, 3), null, 2));

    if (moods.length === 0) {
      console.warn("⚠️ [CALENDAR] Nessun mood caricato!");
    } else {
      console.log("✅ [CALENDAR] Mood caricati correttamente");
      moods.forEach((mood, idx) => {
        console.log(`  Mood ${idx + 1}: ${mood.timestamp} - Emojis: ${mood.emojis.join(", ")}`);
      });
    }
  }, [moods]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntriesForDay = (day: Date) => {
    const dayEntries = moods.filter((entry) => isSameDay(new Date(entry.timestamp), day));
    if (dayEntries.length > 0) {
      console.log(`📍 [DAY] ${format(day, "yyyy-MM-dd")}: ${dayEntries.length} entry/ies - Emojis: ${dayEntries[0].emojis.join(", ")}`);
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
          <View style={{
            paddingTop: insets.top + 12,
            paddingBottom: 12,
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "rgba(11, 17, 33, 0.95)",
            zIndex: 50
          }}>
            <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)" }}>
              <CaretLeft size={24} color="white" />
            </Pressable>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", letterSpacing: 0.5, marginLeft: 16 }}>Calendar</Text>
          </View>

          {/* Original Header - Remove this */}
          {/* Month/Year info */}
          <View className="px-4 pt-4 pb-4">
            <Text className="text-slate-400 text-base">
              {format(currentDate, "MMMM yyyy", { locale: it })}
            </Text>
          </View>

          {/* Weekly Mood Chart */}
          <View className="px-4 mb-8">
            <WeeklyMoodChart
              moods={moods}
              weatherTypeToEmoji={WEATHER_TYPE_TO_EMOJI}
              cardClassName="bg-[#192233] rounded-3xl p-6 shadow-lg border border-slate-800"
              title="Ultimi 7 giorni"
              subtitle="Tendenza emotiva"
            />
          </View>

          {/* Calendar Grid */}
          <View className="px-4 mb-6">
            <View className="bg-[#192233] rounded-3xl p-4 shadow-lg border border-slate-800">
              {/* Weekday headers */}
              <View className="flex-row mb-4">
                {["L", "M", "M", "G", "V", "S", "D"].map((day, index) => (
                  <View key={index} className="flex-1 items-center">
                    <Text className="text-slate-400 font-semibold text-sm">
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

                  let displayEmoji: string | null = null;

                  if (hasEntry) {
                    // Raccogli tutti gli emoji di tutte le entry del giorno
                    const allEmojis = dayEntries.flatMap(entry => entry.emojis);

                    // Calcola il sentiment medio
                    const averageSentiment = calculateAverageSentiment(allEmojis);

                    // Converti i dati per il mapping corretto
                    const emojiTypes = dayEntries.flatMap(entry => entry.emojis);
                    const mappedEmojis = emojiTypes.map(type => WEATHER_TYPE_TO_EMOJI[type] || "☁️");

                    // Calcola il sentiment medio dei mapped emoji
                    const mappedSentiment = calculateAverageSentiment(mappedEmojis);

                    // Trova l'emoji più vicina al sentiment medio
                    displayEmoji = findClosestEmoji(mappedSentiment);

                    console.log(`📍 [DAY] ${format(day, "yyyy-MM-dd")}: ${dayEntries.length} entries - Emojis: ${mappedEmojis.join(", ")} - Sentiment medio: ${mappedSentiment.toFixed(2)} - Emoji risultante: ${displayEmoji}`);
                  }

                  return (
                    <View key={index} className="w-[14.28%] aspect-square p-1">
                      <Pressable
                        onPress={() => {}}
                        className={`flex-1 items-center justify-center rounded-xl ${
                          hasEntry ? "bg-[#2F6BFF]/20" : "bg-slate-800/40"
                        }`}
                      >
                        {hasEntry && displayEmoji ? (
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
            </View>
          </View>

          {/* Stats */}
          <View className="px-4 mb-8">
            <View className="bg-[#192233] rounded-2xl p-6 shadow border border-slate-800">
              <Text className="text-white text-lg font-bold mb-4">
                Statistiche del mese
              </Text>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-3xl mb-1">📊</Text>
                  <Text className="text-white text-xl font-bold">
                    {moods.length}
                  </Text>
                  <Text className="text-slate-400 text-sm">Entries</Text>
                </View>

                <View className="items-center">
                  <Text className="text-3xl mb-1">🔥</Text>
                  <Text className="text-white text-xl font-bold">5</Text>
                  <Text className="text-slate-400 text-sm">Streak</Text>
                </View>

                <View className="items-center">
                  <Text className="text-3xl mb-1">☀️</Text>
                  <Text className="text-white text-xl font-bold">68%</Text>
                  <Text className="text-slate-400 text-sm">Positive</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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


