import { Audio } from "expo-av";

export const formatTime = (millis: number) => {
  if (!millis) return "00:00";
  const totalSeconds = Math.floor(millis / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const formatDurationForList = (millis: number) => {
  if (!millis) return "--";
  const totalMinutes = Math.round(millis / 60000);
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours} hr ${mins} min`;
  }
  return `${totalMinutes} min`;
};

export const loadAudioDurations = async (
  audioSources: Array<{ id: number; audio: any }>,
) => {
  const durations: Record<number, string> = {};

  for (const source of audioSources) {
    try {
      const { sound } = await Audio.Sound.createAsync(source.audio, {
        shouldPlay: false,
      });
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        durations[source.id] = formatDurationForList(status.durationMillis);
      }
      await sound.unloadAsync();
    } catch (e) {
      console.log("Error loading duration for id:", source.id, e);
    }
  }

  return durations;
};
