import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationArrowIcon } from "phosphor-react-native";
import { useWeather } from "@/hooks/api/useWeather";

export const WeatherLocationCard = () => {
  const { weather, location, loading, error, hasPermission } = useWeather();

  // Don't render if permission denied
  if (hasPermission === false) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <View className="mx-6 mb-4">
        <LinearGradient
          colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
          }}
        >
          <View className="flex-row items-center justify-center py-2">
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white/80 text-sm ml-2">
              Getting your location...
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Error state
  if (error || !weather || !location) {
    return null; // Silently fail - don't show error to user
  }

  // Format coordinates
  const latFormatted = location.lat.toFixed(4);
  const lonFormatted = location.lon.toFixed(4);

  // Format temperature
  const tempFormatted = Math.round(weather.temp);

  return (
    <View className="mx-6 mb-4">
      {/* Glassmorphic Card */}
      <LinearGradient
        colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {/* Header with Icon and Coordinates */}
        <View className="flex-row items-center mb-2">
          <NavigationArrowIcon size={20} weight="bold" color="white" />
          <Text className="text-white/70 text-xs ml-2 font-medium">
            {weather.location.name || `${latFormatted}, ${lonFormatted}`}
          </Text>
        </View>

        {/* Weather Info */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white/90 text-sm font-medium mb-1">
              Around you is...
            </Text>
            <Text className="text-white text-base font-semibold capitalize">
              {weather.weather_description}
            </Text>
          </View>

          {/* Temperature */}
          <View className="items-end">
            <Text className="text-white text-3xl font-bold">
              {tempFormatted}°
            </Text>
            <Text className="text-white/70 text-xs">
              Feels like {Math.round(weather.feels_like)}°
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
