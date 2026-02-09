import { View, Text } from "react-native";
import type { WeeklyRhythm } from "@/services/stats.service";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface WeeklyRhythmCardProps {
  weeklyRhythm?: WeeklyRhythm | null;
}

export const WeeklyRhythmCard = ({ weeklyRhythm }: WeeklyRhythmCardProps) => {
  const weeklyData = weeklyRhythm
    ? [
        weeklyRhythm.monday,
        weeklyRhythm.tuesday,
        weeklyRhythm.wednesday,
        weeklyRhythm.thursday,
        weeklyRhythm.friday,
        weeklyRhythm.saturday,
        weeklyRhythm.sunday,
      ]
    : [0, 0, 0, 0, 0, 0, 0];

  return (
    <View className="bg-[#192233] rounded-3xl border border-slate-800 p-6">
      <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
        Weekly Rhythm
      </Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 8, height: 128 }}>
        {weeklyData.map((value, index) => {
          const heightPercent = (value / 100) * 100;
          return (
            <View key={index} style={{ flex: 1, alignItems: "center", gap: 8 }}>
              <View style={{ flex: 1, width: "100%", justifyContent: "flex-end" }}>
                <View
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    height: `${heightPercent}%`,
                    backgroundColor:
                      value > 75
                        ? "#10B981"
                        : value > 50
                          ? "#3B82F6"
                          : "#6B7280",
                  }}
                />
              </View>
              <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12, fontWeight: "500" }}>
                {WEEKDAY_LABELS[index]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
