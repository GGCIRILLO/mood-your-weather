import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { audioSources } from "@/utils/practicesData";
import { loadAudioDurations } from "@/utils/audioUtils";

export const useAudioPlayer = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioDurations, setAudioDurations] = useState<Record<number, string>>(
    {},
  );

  // Setup audio mode
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  }, []);

  // Load audio durations on mount
  useEffect(() => {
    const loadDurations = async () => {
      const durations = await loadAudioDurations(audioSources);
      setAudioDurations(durations);
    };
    loadDurations();
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async (audioSource: any) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const source =
        typeof audioSource === "string" ? { uri: audioSource } : audioSource;
      const { sound: newSound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis);
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        },
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const togglePlayback = async (audioSource?: any) => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else if (audioSource) {
      await playSound(audioSource);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const setPlaybackPosition = async (positionMillis: number) => {
    if (sound) {
      await sound.setPositionAsync(positionMillis);
    }
  };

  return {
    sound,
    isPlaying,
    position,
    duration,
    audioDurations,
    playSound,
    togglePlayback,
    stopSound,
    setPlaybackPosition,
  };
};
