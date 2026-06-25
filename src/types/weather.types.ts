export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
  sunrise: number;
  sunset: number;
  timestamp: number;
}

export interface WeatherError {
  message: string;
  code?: number;
}

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error';
