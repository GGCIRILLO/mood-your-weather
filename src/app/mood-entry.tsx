import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  Alert,
  StyleSheet,
  Animated as RNAnimated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ArrowLeftIcon } from "phosphor-react-native";
import * as Location from "expo-location";
import { useCreateMood } from "@/hooks/api/useMoods";
import { InsightBubble } from "@/components/mood-entry/InsightBubble";
import { ConcentricRings } from "@/components/mood-entry/ConcentricRings";
import { WeatherDisplay } from "@/components/mood-entry/WeatherDisplay";
import { WeatherSelector } from "@/components/mood-entry/WeatherSelector";
import { BottomActionBar } from "@/components/mood-entry/BottomActionBar";

type WeatherType = "sunny" | "partly" | "cloudy" | "rainy" | "stormy";

export default function MoodEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedWeather, setSelectedWeather] = useState<WeatherType[]>([
    "sunny",
  ]);
  const [intensity, setIntensity] = useState(50);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const { mutateAsync: createMood, isPending: isSaving } = useCreateMood();

  // Get user location on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === "granted") {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        }
      } catch (error) {
        console.log("Could not get location:", error);
        // Silently fail - mood will be created without location
      }
    })();
  }, []);

  const pulseScale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0.1);

  // Animazioni per i componenti (4 elementi)
  const componentAnims = useRef(
    Array(4)
      .fill(0)
      .map(() => new RNAnimated.Value(0)),
  ).current;

  useState(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  });

  // Trigger animazioni quando la schermata si monta
  useEffect(() => {
    const animations = componentAnims.map((anim, index) =>
      RNAnimated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 80,
        useNativeDriver: true,
      }),
    );
    RNAnimated.stagger(80, animations).start();
  }, [componentAnims]);

  const handleWeatherAdd = (weather: WeatherType) => {
    // Aggiungi se non presente e meno di 2
    if (!selectedWeather.includes(weather) && selectedWeather.length < 2) {
      setSelectedWeather([...selectedWeather, weather]);
    }
  };

  const handleWeatherRemove = (weather: WeatherType) => {
    // Rimuovi se ci sono almeno 1 emoji rimanente
    if (selectedWeather.length > 1) {
      setSelectedWeather(selectedWeather.filter((w) => w !== weather));
    }
  };

  const handleSave = async () => {
    try {
      const newMood = await createMood({
        emojis: selectedWeather as any,
        intensity,
        note: note.trim() || undefined,
        location: location || undefined,
      });

      router.replace({
        pathname: "/mood-analysis",
        params: { entry: JSON.stringify(newMood) },
      });
    } catch (error: any) {
      Alert.alert("Errore", error.message || "Impossibile salvare il mood");
      console.error("Save mood error:", error);
    }
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const getMoodAnalysis = () => {
    if (selectedWeather.length >= 2) {
      return `Complex emotions blending ${selectedWeather.length} feelings together. Your emotional landscape is rich and nuanced.`;
    }

    switch (selectedWeather[0]) {
      case "sunny":
        return "Bright and positive energy! You're feeling optimistic and energized.";
      case "partly":
        return "Mostly positive with some clouds - hopeful but with minor concerns.";
      case "cloudy":
        return "Neutral, contemplative mood. Not necessarily bad, just thoughtful.";
      case "rainy":
        return "Feeling down or melancholic. It's okay to have rainy days.";
      case "stormy":
        return "Intense emotions, possibly anger or frustration. Strong feelings need acknowledgment.";
      default:
        return "Exploring your emotional landscape...";
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#131A2E"]} style={styles.gradient}>
        {/* Background Blur Blobs */}
        <View style={styles.blueBlob} />
        <View style={styles.purpleBlob} />

        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 16,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeftIcon
              size={24}
              color="rgba(255,255,255,0.8)"
              weight="bold"
            />
          </Pressable>
        </View>

        {/* Main Canvas Area */}
        <View style={styles.mainCanvas}>
          {/* Floating Insight Bubble */}
          <RNAnimated.View
            style={{
              opacity: componentAnims[0],
              transform: [
                {
                  translateY: componentAnims[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            }}
          >
            <InsightBubble />
          </RNAnimated.View>

          {/* Central Creation Core (Drop Zone) */}
          <RNAnimated.View
            style={{
              opacity: componentAnims[1],
              transform: [
                {
                  scale: componentAnims[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
              ...styles.dropZone,
            }}
          >
            {/* Concentric Rings */}
            <ConcentricRings ring1Opacity={ring1Opacity} />

            {/* Active Weather Display */}
            <WeatherDisplay
              selectedWeather={selectedWeather}
              pulseStyle={pulseStyle}
              onWeatherRemove={handleWeatherRemove}
              onWeatherAdd={handleWeatherAdd}
            />
          </RNAnimated.View>

          {/* Weather Selection Grid */}
          <RNAnimated.View
            style={{
              opacity: componentAnims[2],
              transform: [
                {
                  translateY: componentAnims[2].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <WeatherSelector
              selectedWeather={selectedWeather}
              onWeatherAdd={handleWeatherAdd}
            />
          </RNAnimated.View>
        </View>

        {/* Bottom Action Bar */}
        <RNAnimated.View
          style={{
            opacity: componentAnims[3],
            transform: [
              {
                translateY: componentAnims[3].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          }}
        >
          <BottomActionBar
            intensity={intensity}
            onIntensityChange={setIntensity}
            showNoteInput={showNoteInput}
            onToggleNoteInput={() => setShowNoteInput(!showNoteInput)}
            note={note}
            onNoteChange={setNote}
            onSave={handleSave}
            saving={isSaving}
            moodAnalysis={getMoodAnalysis()}
            bottomInset={insets.bottom}
          />
        </RNAnimated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  blueBlob: {
    position: "absolute",
    top: "20%",
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: "rgba(19, 91, 236, 0.15)",
    borderRadius: 9999,
  },
  purpleBlob: {
    position: "absolute",
    bottom: "33%",
    left: -40,
    width: 320,
    height: 320,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderRadius: 9999,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  mainCanvas: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dropZone: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 288,
    height: 288,
    marginTop: -60,
  },
});
