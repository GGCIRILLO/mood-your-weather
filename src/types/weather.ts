/**
 * Location coordinates
 */
export interface Location {
  lat: number;
  lon: number;
  name?: string;
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
