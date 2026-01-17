import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
} from "phosphor-react-native";

type WeatherType = "sunny" | "cloudy" | "rainy" | "stormy" | "snowy";

interface WeatherDisplayProps {
  selectedWeather: WeatherType[];
  pulseStyle: any;
}

const weatherIcons = {
  sunny: {
    Component: Sun,
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.2)",
  },
  cloudy: {
    Component: Cloud,
    color: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.2)",
  },
  rainy: {
    Component: CloudRain,
    color: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.2)",
  },
  stormy: {
    Component: CloudLightning,
    color: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.2)",
  },
  snowy: {
    Component: CloudSnow,
    color: "#e0f2fe",
    glowColor: "rgba(224, 242, 254, 0.2)",
  },
};

export function WeatherDisplay({
  selectedWeather,
  pulseStyle,
}: WeatherDisplayProps) {
  const renderSingleWeather = (type: WeatherType) => {
    const weather = weatherIcons[type];
    const WeatherIcon = weather.Component;

    return (
      <View style={styles.singleContainer}>
        <View style={[styles.glow, { backgroundColor: weather.glowColor }]} />
        <WeatherIcon size={96} color={weather.color} weight="fill" />
      </View>
    );
  };

  const renderDoubleWeather = () => {
    const weather1 = weatherIcons[selectedWeather[0]];
    const weather2 = weatherIcons[selectedWeather[1]];
    const Icon1 = weather1.Component;
    const Icon2 = weather2.Component;

    return (
      <View style={styles.doubleContainer}>
        <View style={[styles.glow, { backgroundColor: weather1.glowColor }]} />
        <Icon1
          size={72}
          color={weather1.color}
          weight="fill"
          style={styles.icon1}
        />
        <Icon2
          size={60}
          color={weather2.color}
          weight="fill"
          style={styles.icon2}
        />
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, pulseStyle]}>
      {selectedWeather.length === 1
        ? renderSingleWeather(selectedWeather[0])
        : renderDoubleWeather()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  singleContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  doubleContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 96,
    height: 96,
  },
  glow: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 9999,
    opacity: 0.8,
  },
  icon1: {
    position: "absolute",
    zIndex: 10,
  },
  icon2: {
    position: "absolute",
    right: -16,
    top: 8,
    zIndex: 20,
  },
});
