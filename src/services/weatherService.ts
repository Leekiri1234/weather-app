import { WeatherData } from '../types/weatherTypes';

const WEATHER_PARAMS = {
  current: [
    'temperature_2m',
    'relative_humidity_2m',
    'cloud_cover',
    'wind_speed_10m',
    'weather_code',
    'precipitation',
    'wind_direction_10m',
    'apparent_temperature'
  ],
  hourly: [
    'temperature_2m',
    'weather_code',
    'precipitation',
    'relative_humidity_2m',
    'wind_speed_10m',
    'wind_direction_10m',
    'cloud_cover',
    'apparent_temperature'
  ]
};

const CURRENT_PARAMS = WEATHER_PARAMS.current.join(',');
const HOURLY_PARAMS = WEATHER_PARAMS.hourly.join(',');

export const fetchWeatherData = async (): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current=${CURRENT_PARAMS}&hourly=${HOURLY_PARAMS}&timezone=auto`;
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            resolve(data);
          } catch (_) {
            reject("Failed to fetch weather data");
          }
        },
        () => {
          reject("Geolocation permission denied. Please enable location services.");
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

export const fetchWeatherByCoords = async (lat: string, lon: string): Promise<WeatherData> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${CURRENT_PARAMS}&hourly=${HOURLY_PARAMS}&timezone=auto`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data for this location. Please try again.');
  }
};

export const fetchLocationWeather = async (location: string): Promise<WeatherData> => {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  const geocodeResponse = await fetch(geocodeUrl);
  
  if (!geocodeResponse.ok) {
    throw new Error("Location not found");
  }
  
  const geocodeData = await geocodeResponse.json();
  
  if (!geocodeData.results || geocodeData.results.length === 0) {
    throw new Error("Location not found");
  }
  
  const { latitude, longitude } = geocodeData.results[0];
  
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${CURRENT_PARAMS}&hourly=${HOURLY_PARAMS}&timezone=auto`;
  const weatherResponse = await fetch(weatherUrl);
  
  if (!weatherResponse.ok) {
    throw new Error("Failed to fetch weather data");
  }
  
  return await weatherResponse.json();
};
