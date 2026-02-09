import { View, Text } from "react-native";
import { HeartIcon } from "phosphor-react-native";

interface MindfulMomentsCardProps {
  count?: number;
}

export const MindfulMomentsCard = ({ count = 0 }: MindfulMomentsCardProps) => {
  return (
    <View className="bg-[#192233] rounded-3xl border border-slate-800 p-6">
      <View className="flex-row items-center justify-between">
        <View style={{ flex: 1 }}>
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Mindful Moments
          </Text>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
            {count}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
            Moments of reflection
          </Text>
        </View>
        <View style={{ width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: "rgba(236, 72, 153, 0.2)" }}>
          <HeartIcon size={32} color="#EC4899" weight="fill" />
        </View>
      </View>
    </View>
  );
};
