import React, { useState } from "react";
import { View, Pressable, Alert, StyleSheet } from "react-native";
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
import { storageService } from "@/services/storage.service";
import { useCurrentUser } from "@/hooks/storage/useStorage";
import { InsightBubble } from "@/components/mood-entry/InsightBubble";
import { ConcentricRings } from "@/components/mood-entry/ConcentricRings";
import { WeatherDisplay } from "@/components/mood-entry/WeatherDisplay";
import { WeatherSelector } from "@/components/mood-entry/WeatherSelector";
import { BottomActionBar } from "@/components/mood-entry/BottomActionBar";

type WeatherType = "sunny" | "partly" | "cloudy" | "rainy" | "stormy";

export default function MoodEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useCurrentUser();

  const [selectedWeather, setSelectedWeather] = useState<WeatherType[]>([
    "sunny",
  ]);
  const [intensity, setIntensity] = useState(50);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [saving, setSaving] = useState(false);

  const pulseScale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0.1);

  useState(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  });

  const handleWeatherToggle = (weather: WeatherType) => {
    if (selectedWeather.includes(weather)) {
      if (selectedWeather.length > 1) {
        setSelectedWeather(selectedWeather.filter((w) => w !== weather));
      }
    } else if (selectedWeather.length < 2) {
      setSelectedWeather([...selectedWeather, weather]);
    }
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Errore", "User non trovato");
      return;
    }

    setSaving(true);

    const entry = {
      id: `entry-${Date.now()}`,
      userId: user.id,
      timestamp: new Date().toISOString(),
      emojis: selectedWeather as any,
      intensity,
      note: note.trim() || undefined,
    };

    await storageService.saveMoodEntry(entry);

    setSaving(false);
    router.push(`/mood-analysis?id=${entry.id}`);
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const getMoodAnalysis = () => {
    if (selectedWeather.length === 2) {
      if (
        selectedWeather.includes("sunny") &&
        selectedWeather.includes("partly")
      ) {
        return "Mostly positive with minor clouds - optimistic with slight hesitation.";
      }
      if (
        selectedWeather.includes("partly") &&
        selectedWeather.includes("cloudy")
      ) {
        return "Between light and shadow - seeking balance between hope and caution.";
      }
      if (
        selectedWeather.includes("cloudy") &&
        selectedWeather.includes("rainy")
      ) {
        return "Transitioning to melancholy - emotions shifting towards sadness.";
      }
      if (
        selectedWeather.includes("rainy") &&
        selectedWeather.includes("stormy")
      ) {
        return "Intensifying distress - difficult emotions building in strength.";
      }
      return "Complex emotions blending together. Take time to understand yourself.";
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
          <InsightBubble />

          {/* Central Creation Core (Drop Zone) */}
          <View style={styles.dropZone}>
            {/* Concentric Rings */}
            <ConcentricRings ring1Opacity={ring1Opacity} />

            {/* Active Weather Display */}
            <WeatherDisplay
              selectedWeather={selectedWeather}
              pulseStyle={pulseStyle}
            />
          </View>

          {/* Weather Selection Grid */}
          <WeatherSelector
            selectedWeather={selectedWeather}
            onWeatherToggle={handleWeatherToggle}
          />
        </View>

        {/* Bottom Action Bar */}
        <BottomActionBar
          intensity={intensity}
          onIntensityChange={setIntensity}
          showNoteInput={showNoteInput}
          onToggleNoteInput={() => setShowNoteInput(!showNoteInput)}
          note={note}
          onNoteChange={setNote}
          onSave={handleSave}
          saving={saving}
          moodAnalysis={getMoodAnalysis()}
          bottomInset={insets.bottom}
        />
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
