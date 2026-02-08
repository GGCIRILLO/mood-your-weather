import { View, StyleSheet, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import {
  CloudSunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudLightningIcon,
  SunIcon,
} from "phosphor-react-native";

type WeatherType = "sunny" | "partly" | "cloudy" | "rainy" | "stormy";

interface WeatherDisplayProps {
  selectedWeather: WeatherType[];
  pulseStyle: any;
  onWeatherRemove: (weather: WeatherType) => void;
  onWeatherAdd: (weather: WeatherType) => void;
}

const weatherIcons = {
  sunny: {
    Component: SunIcon,
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.2)",
  },
  partly: {
    Component: CloudSunIcon,
    color: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.2)",
  },
  cloudy: {
    Component: CloudIcon,
    color: "#9ca3af",
    glowColor: "rgba(156, 163, 175, 0.2)",
  },
  rainy: {
    Component: CloudRainIcon,
    color: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.2)",
  },
  stormy: {
    Component: CloudLightningIcon,
    color: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.2)",
  },
};

export function WeatherDisplay({
  selectedWeather,
  pulseStyle,
  onWeatherRemove,
  onWeatherAdd,
}: WeatherDisplayProps) {
  const renderWeatherIcon = (type: WeatherType, index: number) => {
    const weather = weatherIcons[type];
    const WeatherIcon = weather.Component;
    const size = selectedWeather.length === 1 ? 96 : 60;
    const glowSize = selectedWeather.length === 1 ? 140 : 96;

    return (
      <Pressable
        key={`${type}-${index}`}
        onPress={() => onWeatherRemove(type)}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${type} mood`}
        style={[
          styles.iconWrapper,
          selectedWeather.length > 1 && {
            marginHorizontal: 4,
          },
        ]}
      >
        <View
          style={[
            styles.glow,
            {
              backgroundColor: weather.glowColor,
              width: glowSize,
              height: glowSize,
              borderRadius: glowSize / 2,
            },
          ]}
        />
        <WeatherIcon size={size} color={weather.color} weight="fill" />
      </Pressable>
    );
  };

  return (
    <Animated.View style={[styles.container, pulseStyle]}>
      <View style={styles.iconsContainer}>
        {selectedWeather.length === 0 ? (
          <View style={styles.placeholder}>
            <View style={styles.placeholderCircle} />
          </View>
        ) : (
          selectedWeather.map((weather, index) =>
            renderWeatherIcon(weather, index),
          )
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    minWidth: 200,
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 250,
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 9999,
    opacity: 0.6,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    borderStyle: "dashed",
  },
});
