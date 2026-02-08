import { View, Text } from "react-native";
import { SparkleIcon } from "phosphor-react-native";

export const PatternAnalysisCard = () => {
  return (
    <View className="bg-[#192233] rounded-3xl border border-slate-800 p-6">
      <View style={{ alignItems: "center", paddingVertical: 16 }}>
        <View style={{ width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: 32, backgroundColor: "rgba(168, 85, 247, 0.2)", marginBottom: 12 }}>
          <SparkleIcon size={32} color="#A855F7" weight="fill" />
        </View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
          Pattern Analysis
        </Text>
        <Text style={{ color: "#94a3b8", fontSize: 14, textAlign: "center" }}>
          Coming Soon
        </Text>
        <Text style={{ color: "#64748b", fontSize: 12, textAlign: "center", marginTop: 8 }}>
          AI-powered insights into your emotional patterns
        </Text>
      </View>
    </View>
  );
};
