import { View, Text } from "react-native";
import {
  SunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudSunIcon,
  LightningIcon,
} from "phosphor-react-native";

const MOOD_ICON_MAP: Record<string, any> = {
  sunny: SunIcon,
  partly: CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRainIcon,
  stormy: LightningIcon,
};

const MOOD_COLORS: Record<string, string> = {
  sunny: "#F59E0B",
  partly: "#3B82F6",
  cloudy: "#64748B",
  rainy: "#3B82F6",
  stormy: "#6366F1",
};

interface DominantMoodCardProps {
  dominantMood?: string | null;
}

export const DominantMoodCard = ({ dominantMood }: DominantMoodCardProps) => {
  const mood = dominantMood || "sunny";
  const DominantIcon = MOOD_ICON_MAP[mood] || SunIcon;
  const dominantColor = MOOD_COLORS[mood] || "#F59E0B";

  return (
    <View className="bg-[#192233] rounded-3xl border border-slate-800 p-6">
      <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
        Dominant Mood
      </Text>
      <View className="flex-row items-center gap-4">
        <View
          style={{
            width: 64,
            height: 64,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            backgroundColor: `${dominantColor}20`,
          }}
        >
          <DominantIcon size={32} color={dominantColor} weight="fill" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "white",
              textTransform: "capitalize",
            }}
          >
            {mood}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
            Your most common emotional state
          </Text>
        </View>
      </View>
    </View>
  );
};
