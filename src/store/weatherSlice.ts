import { create } from 'zustand';
import { WeatherData, WeatherStatus } from '@/types/weather.types';

interface WeatherState {
  data: WeatherData | null;
  status: WeatherStatus;
  error: string | null;
  city: string;
  setCity: (city: string) => void;
  setData: (data: WeatherData) => void;
  setStatus: (status: WeatherStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useWeatherStore = create<WeatherState>()((set) => ({
  data: null,
  status: 'idle',
  error: null,
  city: 'London',
  setCity: (city) => set({ city }),
  setData: (data) => set({ data, status: 'success', error: null }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: 'error' }),
  reset: () => set({ data: null, status: 'idle', error: null }),
}));
