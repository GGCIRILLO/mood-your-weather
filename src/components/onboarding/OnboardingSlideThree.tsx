import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  CalendarBlank,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  CloudLightning,
  TrendUp,
  ArrowRight,
} from "phosphor-react-native";
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import BlueGlow from "../ui/BlueGlow";

// Colori definiti nel design
const COLORS = {
  background: "#101622",
  cardBg: "rgba(26, 34, 48, 0.6)",
  primary: "#135bec",
};

interface OnboardingSlideThreeProps {
  onFinish: () => void;
}

export function OnboardingSlideThree({ onFinish }: OnboardingSlideThreeProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Configurazione della griglia (7 colonne x 3 righe)
  // null = spazio vuoto o sole generico, 'highlight' = giorno piovoso connesso
  const gridData = [
    // Riga 1
    ["sun", "highlight", "partly", "sun", "cloud", "sun", "partly"],
    // Riga 2
    ["sun", "cloud", "sun", "highlight", "storm", "sun", "cloud"],
    // Riga 3
    ["partly", "sun", "sun", "cloud", "storm", "highlight", "sun"],
  ];

  // Helper per renderizzare l'icona corretta
  const renderIcon = (type: string, highlight: boolean) => {
    const iconProps = {
      size: 24,
      color: highlight ? "#60a5fa" : "rgba(255,255,255,0.15)",
      weight: highlight ? "fill" : ("regular" as "fill" | "regular"),
    };

    switch (type) {
      case "highlight":
        return <CloudRain {...iconProps} />;
      case "cloud":
        return <Cloud {...iconProps} />;
      case "partly":
        return <CloudSun {...iconProps} />;
      case "storm":
        return <CloudLightning {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  // Calcola la dimensione massima della card in base all'orientamento
  const maxCardSize = isLandscape
    ? Math.min(width * 0.4, height * 0.6)
    : width * 0.85;

  return (
    <View className="flex-1 bg-[#101622]">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: isLandscape ? 20 : 48,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* === HEADER REMOVED (No Skip Button) === */}
        <View style={{ height: isLandscape ? 10 : 20 }} />

        {/* === MAIN CONTENT === */}
        <View className="items-center w-full">
          {/* --- VISUALIZATION CARD --- */}
          <View
            className="relative mb-6"
            style={{
              width: maxCardSize,
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Glass Card Container */}
            <View
              style={{
                backgroundColor: COLORS.cardBg,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 32,
                padding: isLandscape ? 16 : 24,
                width: "100%",
                height: "100%",
              }}
            >
              {/* Card Header */}
              <View className="flex-row justify-between items-center mb-6 opacity-40">
                <Text className="text-xs font-bold uppercase tracking-[2px] text-white">
                  October Moods
                </Text>
                <CalendarBlank size={18} color="white" />
              </View>

              {/* Grid Container */}
              <View className="flex-1 relative justify-between">
                {/* === SVG LAYER === */}
                <View
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                  className="z-0"
                >
                  <Svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <Defs>
                      <RadialGradient
                        id="grad"
                        cx="50%"
                        cy="50%"
                        rx="50%"
                        ry="50%"
                      >
                        <Stop offset="0" stopColor="#135bec" stopOpacity="1" />
                        <Stop offset="1" stopColor="#135bec" stopOpacity="0" />
                      </RadialGradient>
                    </Defs>

                    {/* Curva che connette i punti */}
                    <Path
                      d="M 21,10 Q 45,10 50,50 T 78,90"
                      stroke="#135bec"
                      strokeWidth="2"
                      strokeDasharray="4, 4"
                      opacity="0.6"
                      fill="none"
                    />
                  </Svg>
                </View>

                {/* === GRID ICONS === */}
                {/* Z-index assicura che le icone stiano sopra o sotto la linea a seconda del gusto */}
                {gridData.map((row, rowIndex) => (
                  <View
                    key={rowIndex}
                    className="flex-row justify-between items-center z-10"
                  >
                    {row.map((item, colIndex) => {
                      const isHighlight = item === "highlight";
                      return (
                        <View
                          key={`${rowIndex}-${colIndex}`}
                          className="w-12 h-12 items-center justify-center relative"
                        >
                          {isHighlight && (
                            // Blue Glow dietro l'icona attiva
                            <>
                              <View
                                style={{
                                  backgroundColor: "rgba(19, 91, 236, 0.15)",
                                  borderColor: "rgba(19, 91, 236, 0.6)",
                                  shadowColor: "#135bec",
                                  shadowRadius: 15,
                                  shadowOpacity: 0.5,
                                  shadowOffset: { width: 0, height: 0 },
                                  position: "absolute",
                                  width: 44,
                                  height: 44,
                                  borderRadius: 22,
                                  borderWidth: 2,
                                }}
                              >
                                <BlueGlow
                                  width={80}
                                  height={80}
                                  intensity={0.4}
                                  blur={0.2}
                                />
                              </View>
                            </>
                          )}
                          {renderIcon(item, isHighlight)}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>

            {/* Floating Insight Badge */}
            <View
              style={{
                position: "absolute",
                bottom: isLandscape ? -12 : -20,
                backgroundColor: "#1a2230",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                paddingHorizontal: 20,
                paddingVertical: isLandscape ? 8 : 12,
                borderRadius: 9999,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                zIndex: 20,
              }}
            >
              <TrendUp size={16} color="#135bec" weight="bold" />
              <Text className="text-xs font-bold text-white">
                Pattern Detected: Rainy Days
              </Text>
            </View>
          </View>

          {/* --- TEXT CONTENT --- */}
          <View
            style={{
              marginTop: isLandscape ? 24 : 32,
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: isLandscape ? 24 : 30,
                fontWeight: "800",
                textAlign: "center",
                marginBottom: 16,
                lineHeight: isLandscape ? 32 : 40,
              }}
            >
              Discover Your Patterns
            </Text>
            <Text
              style={{
                color: "#94a3b8",
                textAlign: "center",
                fontSize: isLandscape ? 14 : 16,
                lineHeight: isLandscape ? 20 : 24,
                maxWidth: isLandscape ? 400 : 280,
              }}
            >
              Our AI recognizes triggers and trends, turning your data into a
              clear forecast for better days.
            </Text>
          </View>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1, minHeight: isLandscape ? 16 : 32 }} />

        {/* === FOOTER === */}
        <View className="w-full gap-6">
          {/* Pagination Indicators */}
          <View className="flex-row justify-center items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-slate-700" />
            <View className="h-2 w-2 rounded-full bg-slate-700" />
            {/* Active Indicator (Long Blue) */}
            <View className="h-2 w-8 rounded-full bg-[#135bec]" />
          </View>

          {/* CTA Button*/}
          <TouchableOpacity
            onPress={onFinish}
            className="overflow-hidden mt-2 rounded-full"
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#135bec", "#4a8df8"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-lg text-white tracking-wide">
                  Start My Journey
                </Text>
                <ArrowRight size={20} color="white" weight="bold" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center", // Added to center content
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
});
