// ============================================
// DASHBOARD HUB - Main screen
// ============================================

import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrentUser, useMoodEntries } from "@/hooks/storage/useStorage";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { entries, loading } = useMoodEntries();

  const recentEntries = entries.slice(0, 7);

  return (
    <View className="flex-1 bg-blue-50">
      {/* Background gradient overlay */}
      <View className="absolute inset-0 bg-linear-to-b from-blue-200 to-blue-50" />

      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4">
          {/* Header */}
          <View className="py-6">
            <Text className="text-gray-600 text-base">
              {format(new Date(), "EEEE, d MMMM yyyy", { locale: it })}
            </Text>
            <Text className="text-gray-900 text-3xl font-bold mt-1">
              Ciao, {user?.name || "there"}! 👋
            </Text>
          </View>

          {/* Today's Mood Card */}
          <Pressable
            onPress={() => router.push("/mood-entry")}
            className="bg-white rounded-3xl p-6 mb-6 shadow-lg active:opacity-90"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">
                  Come ti senti oggi?
                </Text>
                <Text className="text-gray-900 text-xl font-bold">
                  Crea un mood entry
                </Text>
              </View>
              <View className="bg-blue-500 w-16 h-16 rounded-full items-center justify-center">
                <Text className="text-4xl">➕</Text>
              </View>
            </View>
          </Pressable>

          {/* Last 7 Days Strip */}
          {recentEntries.length > 0 && (
            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-bold mb-4">
                Ultimi 7 giorni
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="gap-3"
              >
                {recentEntries.map((entry) => (
                  <Pressable
                    key={entry.id}
                    onPress={() => router.push(`/mood-analysis?id=${entry.id}`)}
                    className="bg-white rounded-2xl p-4 w-24 items-center shadow active:opacity-80"
                  >
                    <Text className="text-3xl mb-2">
                      {entry.emojis[0] || "☁️"}
                    </Text>
                    <Text className="text-gray-600 text-xs text-center">
                      {format(new Date(entry.timestamp), "EEE", { locale: it })}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quick Actions Cards */}
          <View className="gap-4 mb-6">
            <Text className="text-gray-900 text-lg font-bold">
              Quick Actions
            </Text>

            <View className="flex-row gap-4">
              {/* Calendar Card */}
              <Pressable
                onPress={() => router.push("/(tabs)/calendar")}
                className="flex-1 bg-white rounded-2xl p-6 shadow active:opacity-90"
              >
                <Text className="text-4xl mb-2">📅</Text>
                <Text className="text-gray-900 font-bold">Calendar</Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Visualizza storico
                </Text>
              </Pressable>

              {/* Statistics Card */}
              <Pressable
                onPress={() => {}}
                className="flex-1 bg-white rounded-2xl p-6 shadow active:opacity-90"
              >
                <Text className="text-4xl mb-2">📊</Text>
                <Text className="text-gray-900 font-bold">Statistics</Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Analisi trend
                </Text>
              </Pressable>
            </View>

            <View className="flex-row gap-4">
              {/* Practices Card */}
              <Pressable
                onPress={() => {}}
                className="flex-1 bg-white rounded-2xl p-6 shadow active:opacity-90"
              >
                <Text className="text-4xl mb-2">🧘</Text>
                <Text className="text-gray-900 font-bold">Practices</Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Esercizi guidati
                </Text>
              </Pressable>

              {/* Insights Card */}
              <Pressable
                onPress={() => {}}
                className="flex-1 bg-white rounded-2xl p-6 shadow active:opacity-90"
              >
                <Text className="text-4xl mb-2">💡</Text>
                <Text className="text-gray-900 font-bold">Insights</Text>
                <Text className="text-gray-500 text-xs mt-1">Pattern AI</Text>
              </Pressable>
            </View>
          </View>

          {/* Empty State */}
          {!loading && entries.length === 0 && (
            <View className="bg-white rounded-3xl p-8 items-center shadow mb-6">
              <Text className="text-6xl mb-4">🌈</Text>
              <Text className="text-gray-900 text-xl font-bold text-center mb-2">
                Inizia il tuo journey
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                Crea il tuo primo mood entry per iniziare a tracciare le tue
                emozioni
              </Text>
              <Pressable
                onPress={() => router.push("/mood-entry")}
                className="bg-blue-500 rounded-full py-3 px-8 active:bg-blue-600"
              >
                <Text className="text-white font-semibold">Crea Mood</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {/* FAB - Floating Action Button */}
        <Pressable
          onPress={() => router.push("/mood-entry")}
          className="absolute bottom-6 right-6 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-2xl active:bg-blue-600"
          style={{
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text className="text-white text-3xl">➕</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
