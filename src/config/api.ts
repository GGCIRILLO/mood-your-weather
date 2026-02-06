import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Get the correct API base URL based on the platform
 * - Android Emulator: 10.0.2.2 (special Android IP for host machine)
 * - iOS Simulator: localhost works
 * - Physical Device: Uses local network IP from Expo manifest
 */
export const getApiBaseUrl = (): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android emulator special IP to reach host machine
      return "http://10.0.2.2:8000";
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      return "http://localhost:8000";
    } else if (Platform.OS === 'web') {
      // Web can use localhost
      return "http://localhost:8000";
    } else {
      // Physical device - try to get IP from Expo's debugger host
      const { manifest } = Constants;
      if (manifest?.debuggerHost) {
        const host = manifest.debuggerHost.split(':')[0];
        return `http://${host}:8000`;
      }
      // Fallback - update this with your Mac's IP if needed
      return "http://192.168.1.17:8000";
    }
  }
  
  // Production URL - replace with your production API
  return "https://your-production-api.com";
};

export const API_BASE_URL = getApiBaseUrl();
