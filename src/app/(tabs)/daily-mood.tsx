import { useEffect, useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { format, isSameDay, parseISO } from "date-fns";

import { useMoods } from "@/hooks/api/useMoods";

// Phosphor icons (analysis-like)
import {
  SunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudSunIcon,
  LightningIcon,
  MoonIcon,
  WindIcon,
  ArrowLeftIcon,
} from "phosphor-react-native";

const MOOD_ICON_MAP: Record<string, any> = {
  sunny: SunIcon,
  partly: CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRainIcon,
  stormy: LightningIcon,
  windy: WindIcon,
  clear: MoonIcon,
};

const MOOD_COLORS: Record<string, string> = {
  sunny: "#F59E0B",
  partly: "#3B82F6",
  cloudy: "#64748B",
  rainy: "#3B82F6",
  stormy: "#6366F1",
  windy: "#22C55E",
  clear: "#A855F7",
};

// Hero gradients per dominant mood (dynamic, no images needed)
const HERO_GRADIENTS: Record<string, string[]> = {
  sunny: ["rgba(245, 158, 11, 0.35)", "rgba(19, 26, 46, 0.95)"],
  partly: ["rgba(59, 130, 246, 0.35)", "rgba(19, 26, 46, 0.95)"],
  cloudy: ["rgba(100, 116, 139, 0.30)", "rgba(19, 26, 46, 0.95)"],
  rainy: ["rgba(59, 130, 246, 0.30)", "rgba(19, 26, 46, 0.95)"],
  stormy: ["rgba(99, 102, 241, 0.35)", "rgba(19, 26, 46, 0.95)"],
  windy: ["rgba(34, 197, 94, 0.30)", "rgba(19, 26, 46, 0.95)"],
  clear: ["rgba(168, 85, 247, 0.30)", "rgba(19, 26, 46, 0.95)"],
};

function safeParseDate(dateStr: string) {
  try {
    return parseISO(dateStr); // expects yyyy-MM-dd
  } catch {
    return new Date();
  }
}

function titleCase(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getDominantMoodType(entries: any[]) {
  const counts: Record<string, number> = {};
  entries.forEach((m) => {
    (m.emojis || []).forEach((e: string) => {
      counts[e] = (counts[e] || 0) + 1;
    });
  });

  let best = "cloudy";
  let bestN = -1;
  for (const [k, v] of Object.entries(counts)) {
    if (v > bestN) {
      best = k;
      bestN = v;
    }
  }
  return best;
}

export default function DailyMoodScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ date?: string }>();

  const selectedDateStr = params?.date ?? format(new Date(), "yyyy-MM-dd");
  const selectedDate = useMemo(() => safeParseDate(selectedDateStr), [selectedDateStr]);

  // ✅ SAME AS CALENDAR
  const { moods = [] } = useMoods({ limit: 100 });

  const dayEntries = useMemo(() => {
    return (moods as any[])
      .filter((entry) => entry?.timestamp && isSameDay(new Date(entry.timestamp), selectedDate))
      .slice()
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [moods, selectedDate]);

  const dominantType = useMemo(() => getDominantMoodType(dayEntries), [dayEntries]);
  const DominantIcon = MOOD_ICON_MAP[dominantType] || CloudIcon;
  const dominantColor = MOOD_COLORS[dominantType] || "#64748B";
  const heroColors = HERO_GRADIENTS[dominantType] || HERO_GRADIENTS.cloudy;

  const summary = useMemo(() => {
    const total = dayEntries.length;
    const all = dayEntries.flatMap((e) => e.emojis || []);
    const unique = Array.from(new Set(all));

    const earliest = total ? new Date(dayEntries[total - 1].timestamp) : null;
    const latest = total ? new Date(dayEntries[0].timestamp) : null;

    return {
      totalEntries: total,
      uniqueMoods: unique,
      firstTime: earliest ? format(earliest, "HH:mm") : "—",
      lastTime: latest ? format(latest, "HH:mm") : "—",
    };
  }, [dayEntries]);

  useEffect(() => {
    console.log("📆 [DAILY] selectedDateStr:", selectedDateStr);
    console.log("📆 [DAILY] total moods:", moods.length);
    console.log("📆 [DAILY] entries for day:", dayEntries.length);
  }, [selectedDateStr, moods, dayEntries]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        {/* Background Blur Blobs */}
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />

        <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
          {/* Header (analysis-like) */}
          <View
            style={{
              paddingTop: insets.top + 16,
              paddingBottom: 16,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            >
              <ArrowLeftIcon size={24} color="#FFF" />
            </Pressable>

            <Text className="text-sm font-bold uppercase tracking-widest text-slate-400">
              DAILY INSIGHTS
            </Text>

            <View className="w-12 h-12" />
          </View>

          <View className="px-4 gap-6 pt-2">
            {/* HERO (dynamic gradient + big icon) */}
            <View className="relative w-full rounded-[2rem] overflow-hidden bg-[#101622] border border-slate-800">
              <LinearGradient
                colors={heroColors as any}
                style={{ width: "100%", height: 320, padding: 24 }}
              >
                {/* Big translucent icon for "image-like" dynamic feel */}
                <View style={{ position: "absolute", right: -20, bottom: -30, opacity: 0.12 }}>
                  <DominantIcon size={220} color={dominantColor} weight="fill" />
                </View>

                <View className="flex-1 justify-between">
                  <View className="self-start rounded-full bg-white/15 px-3 py-1">
                    <Text className="text-xs font-bold text-white">
                      {format(selectedDate, "EEEE, MMM d")}
                    </Text>
                  </View>

                  <View>
                    <View className="mb-4 flex-row self-start items-center gap-2 rounded-full bg-white/20 px-3 py-1">
                      <DominantIcon size={16} color="white" weight="fill" />
                      <Text className="text-xs font-bold text-white">
                        Dominant: {titleCase(dominantType)}
                      </Text>
                    </View>

                    <Text className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                      {summary.totalEntries === 0
                        ? "No entries"
                        : `${summary.totalEntries} entr${summary.totalEntries === 1 ? "y" : "ies"}`}
                    </Text>

                    <Text className="mt-2 text-lg font-medium text-slate-200/90 leading-snug">
                      {summary.totalEntries === 0
                        ? "Pick a day with an entry in the calendar to see details here."
                        : `You logged ${summary.uniqueMoods.length} mood type(s) today.`}
                    </Text>

                    {summary.totalEntries > 0 && (
                      <Text className="mt-3 text-sm text-slate-300/80">
                        Window: {summary.firstTime} → {summary.lastTime}
                      </Text>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* INSIGHTS (whole-page) */}
            <View>
              <Text className="mb-4 text-xl font-bold tracking-tight text-white px-1">
                Insights
              </Text>

              <View className="gap-3">
                <View className="flex-row gap-3">
                  <View className="flex-1 h-32 relative overflow-hidden bg-[#192233] p-5 rounded-[1.5rem] border border-slate-800 justify-end">
                    <View className="absolute -right-4 -bottom-4 opacity-10">
                      <Text className="text-[100px] font-black text-white">
                        {summary.totalEntries}
                      </Text>
                    </View>
                    <View className="z-10">
                      <Text className="text-3xl font-bold text-white">{summary.totalEntries}</Text>
                      <Text className="text-sm font-medium text-slate-400">Entries</Text>
                    </View>
                  </View>

                  <View className="flex-1 h-32 relative overflow-hidden bg-[#192233] p-5 rounded-[1.5rem] border border-slate-800 justify-end">
                    <View className="absolute -right-4 -bottom-4 opacity-10">
                      <DominantIcon size={110} color={dominantColor} weight="fill" />
                    </View>
                    <View className="z-10">
                      <Text className="text-2xl font-bold text-white">{titleCase(dominantType)}</Text>
                      <Text className="text-sm font-medium text-slate-400">Dominant</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1 h-32 relative overflow-hidden bg-[#192233] p-5 rounded-[1.5rem] border border-slate-800 justify-end">
                    <View className="absolute -right-4 -bottom-4 opacity-10">
                      <Text className="text-[80px] font-black text-white">
                        {summary.uniqueMoods.length}
                      </Text>
                    </View>
                    <View className="z-10">
                      <Text className="text-3xl font-bold text-white">{summary.uniqueMoods.length}</Text>
                      <Text className="text-sm font-medium text-slate-400">Types</Text>
                    </View>
                  </View>

                  <View className="flex-1 h-32 relative overflow-hidden bg-[#192233] p-5 rounded-[1.5rem] border border-slate-800 justify-end">
                    <View className="absolute -right-4 -bottom-4 opacity-10">
                      <Text className="text-[80px] font-black text-white">
                        {summary.firstTime}
                      </Text>
                    </View>
                    <View className="z-10">
                      <Text className="text-2xl font-bold text-white">{summary.firstTime}</Text>
                      <Text className="text-sm font-medium text-slate-400">First log</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* ENTRIES */}
            <View className="mb-10">
              <Text className="mb-4 text-xl font-bold tracking-tight text-white px-1">
                Entries
              </Text>

              {dayEntries.length === 0 ? (
                <View className="bg-[#192233] rounded-[1.5rem] p-6 border border-slate-800 items-center">
                  <Text className="text-5xl mb-3">🗓️</Text>
                  <Text className="text-slate-400 text-center">No entries for this day.</Text>
                </View>
              ) : (
                <View className="gap-4">
                  {dayEntries.map((entry: any, idx: number) => {
                    const ts = new Date(entry.timestamp);
                    const timeText = format(ts, "HH:mm");
                    const dayText = format(ts, "yyyy-MM-dd");

                    const description =
                      (entry.note ?? entry.description ?? "").toString().trim() || "No description.";

                    const entryType =
                      Array.isArray(entry.emojis) && entry.emojis.length > 0
                        ? entry.emojis[0]
                        : dominantType;

                    const EntryIcon = MOOD_ICON_MAP[entryType] || CloudIcon;
                    const entryColor = MOOD_COLORS[entryType] || "#64748B";
                    const entryHero = HERO_GRADIENTS[entryType] || HERO_GRADIENTS.cloudy;

                    return (
                      <View
                        key={entry.id ?? `${entry.timestamp}-${idx}`}
                        className="rounded-[2rem] overflow-hidden border border-slate-800 bg-[#192233]"
                      >
                        <LinearGradient colors={entryHero as any} style={{ padding: 18 }}>
                          <View style={{ position: "absolute", right: -10, bottom: -18, opacity: 0.10 }}>
                            <EntryIcon size={140} color={entryColor} weight="fill" />
                          </View>

                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                              <View className="w-10 h-10 items-center justify-center rounded-full bg-white/10">
                                <EntryIcon size={20} color="#FFF" weight="fill" />
                              </View>
                              <Text className="text-white font-bold text-lg">
                                {(entry.emojis || []).join(", ")}
                              </Text>
                            </View>

                            <View className="items-end">
                              <Text className="text-white font-bold">{timeText}</Text>
                              <Text className="text-slate-300/80 text-xs">{dayText}</Text>
                            </View>
                          </View>

                          <Text className="mt-3 text-slate-200/90 leading-5">
                            {description}
                          </Text>

                          {"intensity" in entry && typeof entry.intensity === "number" && (
                            <View className="mt-4 flex-row items-center justify-between">
                              <Text className="text-slate-300/80 text-xs uppercase tracking-widest">
                                Intensity
                              </Text>
                              <Text className="text-white font-bold">{entry.intensity}%</Text>
                            </View>
                          )}
                        </LinearGradient>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
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
