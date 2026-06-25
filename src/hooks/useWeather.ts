'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useWeatherStore } from '@/store/weatherSlice';
import { getWeatherByCity, getWeatherByCoords } from '@/services/weather.service';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useWeather() {
  const { data, status, error, city, setCity, setData, setStatus, setError } = useWeatherStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      setError('API key not configured. Add NEXT_PUBLIC_OPENWEATHER_API_KEY to .env.local');
      return;
    }
    setStatus('loading');
    try {
      const weatherData = await getWeatherByCity(cityName);
      setData(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    }
  }, [setData, setError, setStatus]);

  const fetchByGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const weatherData = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          setData(weatherData);
          setCity(weatherData.city);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        }
      },
      () => {
        setError('Location access denied');
      }
    );
  }, [setCity, setData, setError, setStatus]);

  const handleSearch = useCallback((newCity: string) => {
    setCity(newCity);
    fetchWeather(newCity);
  }, [fetchWeather, setCity]);

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchWeather(city);

    intervalRef.current = setInterval(() => {
      fetchWeather(city);
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [city, fetchWeather]);

  return {
    data,
    status,
    error,
    city,
    handleSearch,
    fetchByGeolocation,
    refresh: () => fetchWeather(city),
  };
}
