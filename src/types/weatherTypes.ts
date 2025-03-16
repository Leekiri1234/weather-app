export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    apparent_temperature: string;
    relative_humidity_2m: string;
    cloud_cover: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    precipitation: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation: number[];
    relative_humidity_2m?: number[];
    wind_speed_10m?: number[];
    wind_direction_10m?: number[];
    cloud_cover?: number[];
    apparent_temperature?: number[];
  };
  hourly_units: {
    temperature_2m: string;
    precipitation: string;
  };
  location?: {
    city: string;
    country: string;
    display_name: string;
  };
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  weatherDescription: string;
  weatherImage: string;
  precipitation: number;
  humidity?: number;
  windSpeed?: number;
  cloudCover?: number;
}
