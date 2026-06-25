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

export function getMockWeather(city: string = 'Mumbai'): WeatherData {
  const cleanCity = city.trim();
  const lowerCity = cleanCity.toLowerCase();
  
  // Vary condition and values based on city name for a dynamic mockup experience
  let condition = 'Haze';
  let temp = 29;
  let desc = 'hazy sunshine and warm breeze';
  let country = 'IN';
  
  if (lowerCity.includes('london')) {
    condition = 'Rain';
    temp = 16;
    desc = 'light rain and moderate wind';
    country = 'UK';
  } else if (lowerCity.includes('paris')) {
    condition = 'Rain';
    temp = 18;
    desc = 'overcast rain with cool winds';
    country = 'FR';
  } else if (lowerCity.includes('new york') || lowerCity.includes('chicago')) {
    condition = 'Clouds';
    temp = 21;
    desc = 'mostly cloudy with scattered intervals';
    country = 'US';
  } else if (lowerCity.includes('tokyo')) {
    condition = 'Clear';
    temp = 25;
    desc = 'perfectly clear sky with light sea breeze';
    country = 'JP';
  } else if (lowerCity.includes('sydney')) {
    condition = 'Clear';
    temp = 23;
    desc = 'clear sunny skies';
    country = 'AU';
  }

  return {
    city: cleanCity ? cleanCity.charAt(0).toUpperCase() + cleanCity.slice(1) : 'Mumbai',
    country,
    temperature: temp,
    feelsLike: temp + (condition === 'Rain' ? -1.5 : 1.2),
    condition,
    description: desc,
    humidity: condition === 'Rain' ? 88 : 55,
    windSpeed: 4.2,
    visibility: 8000,
    icon: condition === 'Clear' ? '01d' : condition === 'Rain' ? '10d' : '03d',
    sunrise: Math.floor(Date.now() / 1000) - 20000,
    sunset: Math.floor(Date.now() / 1000) + 20000,
    timestamp: Math.floor(Date.now() / 1000),
  };
}
