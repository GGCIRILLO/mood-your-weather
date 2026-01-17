import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
} from "phosphor-react-native";

type WeatherType = "sunny" | "cloudy" | "rainy" | "stormy" | "snowy";

interface WeatherSelectorProps {
  selectedWeather: WeatherType[];
  onWeatherToggle: (weather: WeatherType) => void;
}

const weatherOptions = [
  {
    type: "sunny" as WeatherType,
    icon: <Sun size={24} color="#fbbf24" weight="fill" />,
    color: "#fbbf24",
  },
  {
    type: "cloudy" as WeatherType,
    icon: <Cloud size={24} color="#ffffff" weight="fill" />,
    color: "#ffffff",
  },
  {
    type: "rainy" as WeatherType,
    icon: <CloudRain size={24} color="#60a5fa" weight="fill" />,
    color: "#60a5fa",
  },
  {
    type: "stormy" as WeatherType,
    icon: <CloudLightning size={24} color="#a78bfa" weight="fill" />,
    color: "#a78bfa",
  },
  {
    type: "snowy" as WeatherType,
    icon: <CloudSnow size={24} color="#e0f2fe" weight="fill" />,
    color: "#e0f2fe",
  },
];

export function WeatherSelector({
  selectedWeather,
  onWeatherToggle,
}: WeatherSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tap to select (max 2)</Text>
      <View style={styles.grid}>
        {weatherOptions.map((weather) => (
          <Pressable
            key={weather.type}
            onPress={() => onWeatherToggle(weather.type)}
            style={styles.itemContainer}
          >
            <View
              style={[
                styles.weatherButton,
                selectedWeather.includes(weather.type) && {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: weather.color,
                  borderWidth: 2,
                },
              ]}
            >
              {weather.icon}
            </View>
          </Pressable>
        ))}
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
