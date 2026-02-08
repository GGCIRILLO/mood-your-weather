import { API_BASE_URL } from "../config/api";

/**
 * Location coordinates
 */
export interface Location {
  lat: number;
  lon: number;
}

/**
 * Weather response from backend
 */
export interface WeatherCurrent {
  location: Location;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  weather_main: string;
  weather_description: string;
  icon: string;
  wind_speed: number;
  clouds: number;
  dt: string; // ISO timestamp
  sunrise: string; // ISO timestamp
  sunset: string; // ISO timestamp
  timezone: number;
}

/**
 * Helper per gestire le risposte API
 */
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }
  return await response.json();
};

/**
 * Fetch current weather data from backend
 *
 * Calls OpenWeatherMap API through backend with caching (10min)
 * No authentication required (but logged users have priority)
 */
export const getCurrentWeather = async (
  lat: number,
  lon: number,
): Promise<WeatherCurrent> => {
  const queryParams = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
  });

  const url = `${API_BASE_URL}/weather/current?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error: any) {
    console.error("❌ Error fetching weather:", error.message);
    throw error;
  }
};
