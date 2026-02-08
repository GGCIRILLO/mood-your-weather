import { View, Text } from "react-native";
import { FireIcon, TrophyIcon, TrendUpIcon } from "phosphor-react-native";
import type { UserStats } from "@/services/stats.service";

interface StatsGridProps {
  stats?: UserStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <View className="gap-3">
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* Total Entries */}
        <View style={{ flex: 1, height: 128, position: "relative", overflow: "hidden", backgroundColor: "#192233", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "#1e293b", justifyContent: "flex-end" }}>
          <View style={{ position: "absolute", right: -16, bottom: -16, opacity: 0.1 }}>
            <Text style={{ fontSize: 100, fontWeight: "900", color: "white" }}>
              {stats?.totalEntries || 0}
            </Text>
          </View>
          <View style={{ zIndex: 10 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              {stats?.totalEntries || 0}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#94a3b8" }}>
              Total Entries
            </Text>
          </View>
        </View>

        {/* Current Streak */}
        <View style={{ flex: 1, height: 128, position: "relative", overflow: "hidden", backgroundColor: "#192233", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "#1e293b", justifyContent: "flex-end" }}>
          <View style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.1 }}>
            <FireIcon size={110} color="#F59E0B" weight="fill" />
          </View>
          <View style={{ zIndex: 10 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              {stats?.currentStreak || 0}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#94a3b8" }}>
              Day Streak
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* Longest Streak */}
        <View style={{ flex: 1, height: 128, position: "relative", overflow: "hidden", backgroundColor: "#192233", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "#1e293b", justifyContent: "flex-end" }}>
          <View style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.1 }}>
            <TrophyIcon size={110} color="#F59E0B" weight="fill" />
          </View>
          <View style={{ zIndex: 10 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              {stats?.longestStreak || 0}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#94a3b8" }}>
              Best Streak
            </Text>
          </View>
        </View>

        {/* Average Intensity */}
        <View style={{ flex: 1, height: 128, position: "relative", overflow: "hidden", backgroundColor: "#192233", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "#1e293b", justifyContent: "flex-end" }}>
          <View style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.1 }}>
            <TrendUpIcon size={110} color="#3B82F6" weight="bold" />
          </View>
          <View style={{ zIndex: 10 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              {stats?.averageIntensity?.toFixed(0) || 0}%
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#94a3b8" }}>
              Avg Intensity
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
