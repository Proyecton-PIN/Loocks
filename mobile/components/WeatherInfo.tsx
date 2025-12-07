import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Weather = {
  temperature: number;
  windspeed: number;
  weathercode: number;
};

// Simple mapping of Open-Meteo weather codes to icons/text
function weatherEmoji(code: number) {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2 || code === 3) return '⛅️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

export default function WeatherInfo({
  // optional coords; default set to Madrid (40.4168, -3.7038)
  latitude = 40.4168,
  longitude = -3.7038,
}: {
  latitude?: number;
  longitude?: number;
}) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network error');
        const json = await res.json();
        const cw = json.current_weather;
        if (mounted && cw) {
          setWeather({
            temperature: cw.temperature,
            windspeed: cw.windspeed,
            weathercode: cw.weathercode,
          });
        }
      } catch (e: any) {
        console.warn('Weather fetch failed', e);
        if (mounted) setError('No disponible');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void fetchWeather();

    return () => {
      mounted = false;
    };
  }, [latitude, longitude]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.smallText}>--</Text>
        <Text style={styles.smallText}>{error ?? '--'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.smallText}>
        {weatherEmoji(weather.weathercode)} {Math.round(weather.temperature)}° · {Math.round(weather.windspeed)} km/h
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallText: {
    color: '#222222',
    fontSize: 12,
  },
});
