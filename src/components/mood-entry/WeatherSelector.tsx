import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SunIcon,
  CloudSunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudLightningIcon,
} from "phosphor-react-native";
import { scheduleOnRN } from "react-native-worklets";

type WeatherType = "sunny" | "partly" | "cloudy" | "rainy" | "stormy";

interface WeatherSelectorProps {
  selectedWeather: WeatherType[];
  onWeatherAdd: (weather: WeatherType) => void;
}

const weatherOptions = [
  {
    type: "sunny" as WeatherType,
    icon: SunIcon,
    color: "#fbbf24",
  },
  {
    type: "partly" as WeatherType,
    icon: CloudSunIcon,
    color: "#ffffff",
  },
  {
    type: "cloudy" as WeatherType,
    icon: CloudIcon,
    color: "#9ca3af",
  },
  {
    type: "rainy" as WeatherType,
    icon: CloudRainIcon,
    color: "#60a5fa",
  },
  {
    type: "stormy" as WeatherType,
    icon: CloudLightningIcon,
    color: "#a78bfa",
  },
];

export function WeatherSelector({
  selectedWeather,
  onWeatherAdd,
}: WeatherSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Drag to center (max 2)</Text>
      <View style={styles.grid}>
        {weatherOptions.map((weather) => {
          const Icon = weather.icon;
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);
          const scale = useSharedValue(1);
          const isSelected = selectedWeather.includes(weather.type);

          const gesture = Gesture.Pan()
            .onStart(() => {
              scale.value = withSpring(1.2);
            })
            .onUpdate((event) => {
              translateX.value = event.translationX;
              translateY.value = event.translationY;
            })
            .onEnd((event) => {
              // Verifica che sia trascinato VERSO L'ALTO (translationY negativo)
              // e che la distanza verticale sia significativa (almeno 200px)
              const isUpward = event.translationY < -200;
              const horizontalDistance = Math.abs(event.translationX);

              // Deve essere trascinato verso l'alto e non troppo lateralmente
              if (isUpward && horizontalDistance < 150) {
                scheduleOnRN(onWeatherAdd, weather.type);
              }

              // Reset posizione
              translateX.value = withSpring(0);
              translateY.value = withSpring(0);
              scale.value = withSpring(1);
            });

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [
              { translateX: translateX.value },
              { translateY: translateY.value },
              { scale: scale.value },
            ] as any,
          }));

          return (
            <GestureDetector key={weather.type} gesture={gesture}>
              <Animated.View style={[styles.itemContainer, animatedStyle]}>
                <View
                  style={[
                    styles.weatherButton,
                    isSelected && {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderColor: weather.color,
                      borderWidth: 2,
                      padding: 4,
                    },
                  ]}
                >
                  <Icon size={24} color={weather.color} weight="fill" />
                </View>
              </Animated.View>
            </GestureDetector>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 32,
  },
  label: {
    textAlign: "center",
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  itemContainer: {
    alignItems: "center",
    gap: 8,
  },
  weatherButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
