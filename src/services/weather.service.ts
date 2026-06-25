import { WeatherData } from '@/types/weather.types';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!key) throw new Error('OpenWeatherMap API key not configured');
  return key;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeWeather(data: any): WeatherData {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    visibility: data.visibility,
    icon: data.weather[0].icon,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timestamp: data.dt,
  };
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const key = getApiKey();
  const res = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Weather fetch failed: ${res.status}`);
  }

  const data = await res.json();
  return normalizeWeather(data);
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const key = getApiKey();
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Weather fetch failed: ${res.status}`);
  }

  const data = await res.json();
  return normalizeWeather(data);
}
