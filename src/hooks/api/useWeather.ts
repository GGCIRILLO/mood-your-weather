import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { getCurrentWeather } from "@/services/weather.service";
import type { WeatherCurrent } from "@/services/weather.service";

/**
 * Hook per richiedere i permessi di location
 */
const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      // Check if permission is already granted
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      if (existingStatus === "granted") {
        setHasPermission(true);
        return;
      }

      // Show alert before requesting permission
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Alert.alert(
          "Location Permission",
          "We need your location to show you the weather around you.",
          [
            {
              text: "Cancel",
              onPress: () => setHasPermission(false),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                const { status } =
                  await Location.requestForegroundPermissionsAsync();
                setHasPermission(status === "granted");
              },
            },
          ],
        );
      } else {
        // Web or other platforms - request directly
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasPermission(status === "granted");
      }
    })();
  }, []);

  return hasPermission;
};

/**
 * Hook per ottenere la posizione corrente
 */
const useCurrentLocation = (hasPermission: boolean | null) => {
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasPermission === true) {
      (async () => {
        try {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        } catch (err: any) {
          console.error("❌ Error getting location:", err.message);
          setError("Unable to get your location");
        }
      })();
    } else if (hasPermission === false) {
      setError("Location permission denied");
    }
  }, [hasPermission]);

  return { location, error };
};

/**
 * Hook principale per ottenere il meteo corrente
 *
 * - Richiede permessi di location con Alert
 * - Ottiene posizione corrente
 * - Fetcha meteo dal backend con caching
 */
export const useWeather = () => {
  const hasPermission = useLocationPermission();
  const { location, error: locationError } = useCurrentLocation(hasPermission);

  const {
    data: weather,
    isLoading,
    error: weatherError,
    refetch,
  } = useQuery<WeatherCurrent>({
    queryKey: ["weather", location?.lat, location?.lon],
    queryFn: async () => {
      if (!location) {
        throw new Error("Location not available");
      }
      return await getCurrentWeather(location.lat, location.lon);
    },
    enabled: !!location && hasPermission === true,
    staleTime: 10 * 60 * 1000, // 10 minuti - backend ha cache di 10 minuti
    gcTime: 30 * 60 * 1000, // 30 minuti garbage collection
    retry: 2,
  });

  return {
    weather,
    location,
    loading: isLoading || hasPermission === null,
    error: locationError || weatherError?.message || null,
    hasPermission,
    refetch,
  };
};
