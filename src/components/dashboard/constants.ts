
import {
  SunIcon,
  CloudSunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudLightningIcon,
} from "phosphor-react-native";
import { MoodEmojiType } from "@/types";
import { images } from "assets";

export const EMOJI_TO_ICON: Record<MoodEmojiType, any> = {
  sunny: SunIcon,
  partly: CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRainIcon,
  stormy: CloudLightningIcon,
};

export const EMOJI_TO_COLOR: Record<MoodEmojiType, string> = {
  sunny: "#D97706", // Amber
  partly: "#c9c9c9ff", // Light gray
  cloudy: "#6B7280", // Dark gray
  rainy: "#2564eb69", // Dark blue
  stormy: "#6D28D9", // Dark purple
};

export const MOOD_BACKGROUNDS = {
  sunny: images.db_bg_sunny,
  cloudy: images.db_bg_cloudy,
  rainy: images.db_bg_rainy,
  stormy: images.db_bg_stormy,
  partly: images.db_bg_partly,
};
