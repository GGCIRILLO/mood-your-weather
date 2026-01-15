// ============================================
// MOOD ENTRY CANVAS - Drag & Drop interface
// ============================================

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { MOOD_EMOJIS } from "@/utils/constants";
import { storageService } from "@/services/storage.service";
import { useCurrentUser } from "@/hooks/storage/useStorage";
import type { MoodEmojiType } from "@/types";
import Slider from "@react-native-community/slider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const EMOJI_SIZE = 60;

export default function MoodEntryScreen() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [selectedEmojis, setSelectedEmojis] = useState<MoodEmojiType[]>([]);
  const [intensity, setIntensity] = useState(50);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [saving, setSaving] = useState(false);

  const dropZoneScale = useSharedValue(1);

  const handleEmojiSelect = (emoji: MoodEmojiType) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter((e) => e !== emoji));
    } else if (selectedEmojis.length < 3) {
      setSelectedEmojis([...selectedEmojis, emoji]);
      // Animate drop zone
      dropZoneScale.value = withSequence(withSpring(1.1), withSpring(1));
    }
  };

  const handleSave = async () => {
    if (selectedEmojis.length === 0) {
      Alert.alert("Attenzione", "Seleziona almeno un'emoji per il tuo mood");
      return;
    }

    if (!user) {
      Alert.alert("Errore", "User non trovato");
      return;
    }

    setSaving(true);

    const entry = {
      id: `entry-${Date.now()}`,
      userId: user.id,
      timestamp: new Date().toISOString(),
      emojis: selectedEmojis,
      intensity,
      note: note.trim() || undefined,
    };

    await storageService.saveMoodEntry(entry);

    setSaving(false);
    router.push(`/mood-analysis?id=${entry.id}`);
  };

  const dropZoneStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dropZoneScale.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-blue-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-3xl">✖️</Text>
          </Pressable>
          <Text className="text-gray-900 text-lg font-bold">
            Come ti senti?
          </Text>
          <Pressable onPress={handleSave} disabled={saving}>
            <Text
              className={`text-base font-semibold ${
                saving ? "text-gray-400" : "text-blue-500"
              }`}
            >
              {saving ? "Salvataggio..." : "Salva"}
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1">
          {/* Drop Zone */}
          <Animated.View
            style={[dropZoneStyle, { minHeight: 200 }]}
            className="mx-6 my-8 bg-white rounded-3xl p-8 items-center justify-center shadow-lg"
          >
            {selectedEmojis.length === 0 ? (
              <View className="items-center">
                <Text className="text-6xl mb-4">☁️</Text>
                <Text className="text-gray-500 text-center">
                  Seleziona emoji qui sotto per{"\n"}esprimere come ti senti
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-center gap-4">
                {selectedEmojis.map((emoji, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleEmojiSelect(emoji)}
                  >
                    <Text className="text-6xl">{emoji}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Animated.View>

          {/* Emoji Picker */}
          <View className="px-6 mb-6">
            <Text className="text-gray-900 text-lg font-bold mb-4">
              Seleziona emoji ({selectedEmojis.length}/3)
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {MOOD_EMOJIS.map((item) => (
                <Pressable
                  key={item.emoji}
                  onPress={() => handleEmojiSelect(item.emoji as MoodEmojiType)}
                  className={`w-16 h-16 rounded-2xl items-center justify-center ${
                    selectedEmojis.includes(item.emoji as MoodEmojiType)
                      ? "bg-blue-500"
                      : "bg-white"
                  } shadow`}
                >
                  <Text className="text-3xl">{item.emoji}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Intensity Slider */}
          <View className="px-6 mb-6">
            <Text className="text-gray-900 text-lg font-bold mb-2">
              Intensità: {intensity}%
            </Text>
            <View className="bg-white rounded-2xl p-4 shadow">
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                minimumValue={0}
                maximumValue={100}
                step={5}
                minimumTrackTintColor="#3B82F6"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#3B82F6"
              />
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-500 text-sm">Lieve</Text>
                <Text className="text-gray-500 text-sm">Intenso</Text>
              </View>
            </View>
          </View>

          {/* Notes Section */}
          <View className="px-6 mb-8">
            <Pressable
              onPress={() => setShowNoteInput(!showNoteInput)}
              className="flex-row items-center justify-between mb-3"
            >
              <Text className="text-gray-900 text-lg font-bold">
                Note (opzionale)
              </Text>
              <Text className="text-2xl">{showNoteInput ? "🔽" : "▶️"}</Text>
            </Pressable>

            {showNoteInput && (
              <View className="bg-white rounded-2xl p-4 shadow">
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Scrivi qui i tuoi pensieri..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  className="text-gray-900 text-base"
                  style={{ minHeight: 100, textAlignVertical: "top" }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
