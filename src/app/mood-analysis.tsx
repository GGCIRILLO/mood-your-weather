// ============================================
// MOOD ANALYSIS SCREEN - Post-creation analysis
// ============================================

import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { storageService } from "@/services/storage.service";
import { ACTIVITY_SUGGESTIONS } from "@/utils/constants";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import type { MoodEntry } from "@/types";

export default function MoodAnalysisScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    if (!id) return;
    setLoading(true);
    const moodEntry = await storageService.getMoodEntryById(id);
    setEntry(moodEntry);
    setLoading(false);
  };

  if (loading || !entry) {
    return (
      <View className="flex-1 items-center justify-center bg-blue-50">
        <Text className="text-gray-600">Caricamento...</Text>
      </View>
    );
  }

  // Calculate sentiment based on emojis (mock)
  const sentimentScore = calculateSentiment(entry.emojis);
  const sentiment =
    sentimentScore > 0.3
      ? "Positivo"
      : sentimentScore < -0.3
      ? "Negativo"
      : "Neutrale";
  const sentimentEmoji =
    sentimentScore > 0.3 ? "😊" : sentimentScore < -0.3 ? "😔" : "😐";

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <Text className="text-2xl">←</Text>
        </Pressable>
        <Text className="text-gray-900 text-lg font-bold">Mood Analysis</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="px-6 py-8 items-center">
          <View className="flex-row gap-4 mb-6">
            {entry.emojis.map((emoji, index) => (
              <Text key={index} className="text-6xl">
                {emoji}
              </Text>
            ))}
          </View>

          <Text className="text-gray-600 text-base">
            {format(new Date(entry.timestamp), "EEEE, d MMMM 'alle' HH:mm", {
              locale: it,
            })}
          </Text>

          {entry.note && (
            <View className="bg-white rounded-2xl p-4 mt-4 w-full shadow">
              <Text className="text-gray-700 text-base">"{entry.note}"</Text>
            </View>
          )}
        </View>

        {/* Sentiment Analysis */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 text-xl font-bold">
                Analisi Emotiva
              </Text>
              <Text className="text-4xl">{sentimentEmoji}</Text>
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-600">Sentiment</Text>
              <Text className="text-gray-900 font-semibold">{sentiment}</Text>
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-600">Intensità</Text>
              <Text className="text-gray-900 font-semibold">
                {entry.intensity}%
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Emoji selezionate</Text>
              <Text className="text-gray-900 font-semibold">
                {entry.emojis.length}
              </Text>
            </View>

            {/* Progress bar for intensity */}
            <View className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
              <View
                className={`h-full ${
                  entry.intensity > 70
                    ? "bg-red-500"
                    : entry.intensity > 40
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${entry.intensity}%` }}
              />
            </View>
          </View>
        </View>

        {/* Suggested Activities */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">
            Attività Suggerite
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {ACTIVITY_SUGGESTIONS.slice(0, 3).map((activity) => (
              <Pressable
                key={activity.id}
                onPress={() => {}}
                className="bg-white rounded-2xl p-4 w-48 shadow active:opacity-90"
              >
                <Text className="text-4xl mb-3">{activity.icon}</Text>
                <Text className="text-gray-900 font-bold mb-1">
                  {activity.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-2">
                  {activity.description}
                </Text>
                <Text className="text-blue-500 text-sm font-medium">
                  {activity.duration} minuti
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Context History (Mini Graph Placeholder) */}
        <View className="px-6 mb-8">
          <View className="bg-white rounded-3xl p-6 shadow-lg">
            <Text className="text-gray-900 text-xl font-bold mb-4">
              Trend Ultimi 7 Giorni
            </Text>
            <View className="items-center py-8">
              <Text className="text-6xl mb-2">📈</Text>
              <Text className="text-gray-500 text-center">
                Grafici e statistiche{"\n"}disponibili presto
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 pb-8 gap-3">
          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="bg-blue-500 rounded-full py-4 items-center shadow-lg active:bg-blue-600"
          >
            <Text className="text-white text-lg font-semibold">
              Torna alla Dashboard
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/mood-entry")}
            className="bg-white border-2 border-blue-500 rounded-full py-4 items-center active:bg-blue-50"
          >
            <Text className="text-blue-500 text-lg font-semibold">
              Crea Nuovo Mood
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to calculate sentiment (mock)
function calculateSentiment(emojis: string[]): number {
  const sentimentMap: Record<string, number> = {
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

  const total = emojis.reduce(
    (acc, emoji) => acc + (sentimentMap[emoji] || 0),
    0
  );
  return emojis.length > 0 ? total / emojis.length : 0;
}
