'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type CountdownState = 'idle' | 'running' | 'paused' | 'done';

interface UseCountdownReturn {
  state: CountdownState;
  remaining: number;
  totalSeconds: number;
  progress: number; // 0 to 1
  start: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function useCountdown(): UseCountdownReturn {
  const [state, setState] = useState<CountdownState>('idle');
  const [remaining, setRemaining] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback((seconds: number) => {
    if (seconds <= 0) return;
    clearTimer();
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setState('running');
  }, []);

  const pause = useCallback(() => {
    if (state !== 'running') return;
    clearTimer();
    setState('paused');
  }, [state]);

  const resume = useCallback(() => {
    if (state !== 'paused') return;
    setState('running');
  }, [state]);

  const reset = useCallback(() => {
    clearTimer();
    setRemaining(0);
    setTotalSeconds(0);
    setState('idle');
  }, []);

  // Tick logic
  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setState('done');
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('⏰ Timer Complete!', {
                body: 'Your countdown has finished.',
                icon: '/favicon.ico',
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimer();
  }, [state]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;

  return { state, remaining, totalSeconds, progress, start, pause, resume, reset };
}
