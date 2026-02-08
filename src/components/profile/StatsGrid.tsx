import { View, Text } from "react-native";
import {
  SunIcon,
  CloudSunIcon,
  CloudIcon,
  CloudRain,
  CloudLightning,
} from "phosphor-react-native";

const WEATHER_ICON_MAP: Record<string, any> = {
  sunny: SunIcon,
  partly: CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRain,
  stormy: CloudLightning,
};

const WEATHER_COLOR_MAP: Record<string, string> = {
  sunny: "#fbbf24",
  partly: "#ffffff",
  cloudy: "#9ca3af",
  rainy: "#60a5fa",
  stormy: "#a78bfa",
};

interface StatsGridProps {
  totalEntries?: number;
  currentStreak?: number;
  dominantMood?: string;
}

export const StatsGrid = ({
  totalEntries,
  currentStreak,
  dominantMood,
}: StatsGridProps) => {
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#192233",
            padding: 16,
            borderRadius: 20,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(19, 91, 236, 0.1)",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            {totalEntries || 0}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#92a4c9",
              marginTop: 4,
              fontWeight: "500",
            }}
          >
            Entries
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#192233",
            padding: 16,
            borderRadius: 20,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(19, 91, 236, 0.1)",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#135bec" }}>
            {currentStreak || 0}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#92a4c9",
              marginTop: 4,
              fontWeight: "500",
            }}
          >
            Day Streak
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#192233",
            padding: 16,
            borderRadius: 20,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(19, 91, 236, 0.1)",
          }}
        >
          {dominantMood &&
            (() => {
              const Icon = WEATHER_ICON_MAP[dominantMood] || CloudIcon;
              const iconColor = WEATHER_COLOR_MAP[dominantMood] || "#60a5fa";
              return (
                <Icon
                  size={28}
                  color={iconColor}
                  weight="fill"
                  style={{ marginBottom: 4 }}
                />
              );
            })()}
          {!dominantMood && (
            <CloudLightning
              size={28}
              color="#a78bfa"
              weight="fill"
              style={{ marginBottom: 4 }}
            />
          )}
          <Text style={{ fontSize: 12, color: "#92a4c9", fontWeight: "500" }}>
            Fav Weather
          </Text>
        </View>
      </View>
    </View>
  );
};
