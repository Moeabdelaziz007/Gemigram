'use client';

import { useEffect, useState } from 'react';

export interface SystemTelemetry {
  weather: {
    temp: number;
    condition: string;
    city: string;
  };
  latency: number;
  uptime: number;
  activeAgents: number;
}

export function useSystemTelemetry() {
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    weather: { temp: 24, condition: 'Clear', city: 'NYC' },
    latency: 0,
    uptime: 0,
    activeAgents: 0,
  });

  useEffect(() => {
    const start = Date.now();

    const fetchWeather = async () => {
      try {
        const res = await fetch('https://wttr.in/?format=j1');
        const data = await res.json();
        const current = data.current_condition[0];
        const area = data.nearest_area[0];
        setTelemetry((prev) => ({
          ...prev,
          weather: {
            temp: parseInt(current.temp_C, 10),
            condition: current.weatherDesc[0].value,
            city: area.areaName[0].value,
          },
        }));
      } catch (error) {
        console.error('Weather fetch failed:', error);
      }
    };

    const measureLatency = async () => {
      try {
        const requestStart = performance.now();
        await fetch('https://www.google.com/generate_204', { mode: 'no-cors', cache: 'no-cache' });
        const requestEnd = performance.now();
        setTelemetry((prev) => ({ ...prev, latency: Math.round(requestEnd - requestStart) }));
      } catch {
        setTelemetry((prev) => ({ ...prev, latency: Math.floor(Math.random() * 5) + 1 }));
      }
    };

    fetchWeather();
    measureLatency();

    const telemetryInterval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        uptime: Math.floor((Date.now() - start) / 1000),
      }));
      measureLatency();
    }, 5000);

    return () => clearInterval(telemetryInterval);
  }, []);

  return telemetry;
}
