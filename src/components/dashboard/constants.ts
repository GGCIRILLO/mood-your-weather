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
  sunny: "#fbbf24", // Amber 400
  partly: "#e5e7eb", // Gray 200 - Light gray for readability
  cloudy: "#9ca3af", // Gray 400
  rainy: "#60a5fa", // Blue 400
  stormy: "#a78bfa", // Purple 400
};

export const MOOD_BACKGROUNDS = {
  sunny: images.db_bg_sunny,
  cloudy: images.db_bg_cloudy,
  rainy: images.db_bg_rainy,
  stormy: images.db_bg_stormy,
  partly: images.db_bg_partly,
};
