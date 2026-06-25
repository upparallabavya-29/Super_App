'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useWeatherStore } from '@/store/weatherSlice';
import { getWeatherByCity, getWeatherByCoords, getMockWeather } from '@/services/weather.service';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useWeather() {
  const { data, status, error, city, setCity, setData, setStatus, setError } = useWeatherStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      // Mock weather fallback
      setStatus('loading');
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const mockData = getMockWeather(cityName || 'Mumbai');
      setData(mockData);
      return;
    }
    setStatus('loading');
    setError(null);
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
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
            // Geolocation mock fallback
            await new Promise((resolve) => setTimeout(resolve, 500));
            const mockData = getMockWeather('Paris');
            setData(mockData);
            setCity('Paris');
            return;
          }
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
