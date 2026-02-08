import {
  CloudLightning,
  CloudRain,
  Sun,
  Moon,
  Wind,
  Tree,
} from "phosphor-react-native";

export interface Practice {
  id: number;
  title: string;
  tag: string;
  duration: string;
  type: string;
  description: string;
  icon: any;
  image: string;
  color: string;
  audio: any;
}

export const practices: Practice[] = [
  {
    id: 1,
    title: "Thunderstorm Release",
    tag: "Anxiety Relief",
    duration: "21 min",
    type: "Relaxation",
    description:
      "Let the rolling thunder wash away your stress and ground you in the present moment. Feel the electricity clear your mind.",
    icon: CloudLightning,
    image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800",
    color: "#135bec",
    audio: require("../../assets/audio/Thunderstorm.mp4"),
  },
  {
    id: 2,
    title: "Rainy Day Calm",
    tag: "Sleep Aid",
    duration: "29 min",
    type: "Relaxation",
    description:
      "Gentle rain sounds to help you drift into peaceful sleep. Let each drop carry away your worries.",
    icon: CloudRain,
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
    color: "#6366f1",
    audio: require("../../assets/audio/RainyDay.mp4"),
  },
  {
    id: 3,
    title: "Forest Focus",
    tag: "Focus Enhancement",
    duration: "2 min",
    type: "Focus",
    description:
      "Immerse yourself in the sounds of a deep forest to heighten your concentration and block out distractions.",
    icon: Tree,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    color: "#10b981",
    audio: require("../../assets/audio/ForestWay.mp3"),
  },
  {
    id: 4,
    title: "Morning Mindfulness",
    tag: "Daily Ritual",
    duration: "20 min",
    type: "Meditation",
    description:
      "Start your day with intention and clarity. A gentle guided meditation to awaken your mind.",
    icon: Sun,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    color: "#f59e0b",
    audio: require("../../assets/audio/MorningMindfulness.mp4"),
  },
  {
    id: 5,
    title: "Deep Rest Body Scan",
    tag: "Stress Relief",
    duration: "54 min",
    type: "Meditation",
    description:
      "Systematically relax every part of your body. Perfect for releasing deep-seated tension.",
    icon: Moon,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    color: "#6366f1",
    audio: require("../../assets/audio/DeepRestBodyScan.mp4"),
  },
  {
    id: 6,
    title: "Deep Work Zone",
    tag: "Productivity",
    duration: "1 hr 45 min",
    type: "Focus",
    description:
      "Binaural beats combined with white noise to help you enter a flow state for deep work sessions.",
    icon: Wind,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    color: "#0ea5e9",
    audio: require("../../assets/audio/DeepWork.mp4"),
  },
  {
    id: 8,
    title: "Panic SOS",
    tag: "Immediate Relief",
    duration: "12 min",
    type: "Anxiety",
    description:
      "A short, powerful session to ground you when you feel overwhelmed. Use this for immediate panic relief.",
    icon: CloudLightning,
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800",
    color: "#ef4444",
    audio: require("../../assets/audio/PanicSOS.mp4"),
  },
  {
    id: 9,
    title: "Box Breathing",
    tag: "Breathwork",
    duration: "14 min",
    type: "Anxiety",
    description:
      "Simple, effective breathing technique to calm your nervous system. Inhale, hold, exhale, hold.",
    icon: Wind,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    color: "#14b8a6",
    audio: require("../../assets/audio/BoxBreathing.mp4"),
  },
  {
    id: 10,
    title: "Dreamscapes",
    tag: "Sleep Stories",
    duration: "42 min",
    type: "Sleep",
    description:
      "A calming story that takes you on a journey to a peaceful world, helping you disconnect from the day.",
    icon: Moon,
    image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?w=800",
    color: "#4f46e5",
    audio: require("../../assets/audio/Dreamscapes.mp4"),
  },
];

export const audioSources = [
  { id: 1, audio: require("../../assets/audio/Thunderstorm.mp4") },
  { id: 2, audio: require("../../assets/audio/RainyDay.mp4") },
  { id: 3, audio: require("../../assets/audio/ForestWay.mp3") },
  { id: 4, audio: require("../../assets/audio/MorningMindfulness.mp4") },
  { id: 5, audio: require("../../assets/audio/DeepRestBodyScan.mp4") },
  { id: 6, audio: require("../../assets/audio/DeepWork.mp4") },
  { id: 8, audio: require("../../assets/audio/PanicSOS.mp4") },
  { id: 9, audio: require("../../assets/audio/BoxBreathing.mp4") },
  { id: 10, audio: require("../../assets/audio/Dreamscapes.mp4") },
];

export const filters = ["All", "Anxiety", "Focus", "Sleep", "Meditation"];
