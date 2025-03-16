import { useEffect, useState, useRef } from 'react'
import './App.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/cards.css'
import { fetchWeatherData, fetchWeatherByCoords } from './services/weatherService';
import Navbar from './components/Navbar';
import WeatherDisplay from './components/WeatherDisplay';
import TimePicker from './components/TimePicker';
import WeatherDetails from './components/WeatherDetails';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { WeatherData, HourlyForecast } from './types/weatherTypes';
import wmo from "./assets/wmo.json";
import PrecipitationChart from './components/PrecipitationChart';

function App() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentForecast, setCurrentForecast] = useState<HourlyForecast | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [currentLocation, setCurrentLocation] = useState<string>('Current Location');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null);

  // Separate useEffect for initial data fetch
  useEffect(() => {
    getWeatherForCurrentLocation();
  }, []); // Run only once on mount

  // Separate useEffect for window resize and menu handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    const handleCloseMenu = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    document.body.addEventListener('closeMenu', handleCloseMenu);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeEventListener('closeMenu', handleCloseMenu);
    };
  }, [isMenuOpen]);

  const getWeatherForCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentLocation('Current Location');
      const weatherData = await fetchWeatherData();
      updateWeatherState(weatherData);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (lat: string, lon: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentLocation(displayName);
      
      const weatherData = await fetchWeatherByCoords(lat, lon);
      updateWeatherState(weatherData, displayName);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch weather data for selected location');
    } finally {
      setLoading(false);
    }
  };

  const updateWeatherState = (weatherData: WeatherData, locationName?: string) => {
    if (locationName) {
      const parts = locationName.split(', ');
      const city = parts[0];
      const country = parts[parts.length - 1];
      
      weatherData.location = {
        city,
        country,
        display_name: locationName
      };
    }
    
    setData(weatherData);
    
    // Get current hour to determine if it's day or night
    const currentHour = new Date().getHours();
    const isDaytime = currentHour >= 6 && currentHour < 18;
    const timeOfDay = isDaytime ? 'day' : 'night';
    
    const currentIndex = currentHour;
    
    setCurrentForecast({
      time: new Date().toLocaleString('en-us'),
      temperature: weatherData.current.temperature_2m,
      weatherCode: weatherData.current.weather_code,
      weatherDescription: wmo[weatherData.current.weather_code][timeOfDay].description,
      weatherImage: wmo[weatherData.current.weather_code][timeOfDay].image,
      precipitation: weatherData.current.precipitation,
      humidity: weatherData.current.relative_humidity_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      cloudCover: weatherData.current.cloud_cover
    });
  };

  const toggleUnit = () => {
    setTempUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  return (
    <div className="app-container">
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        toggleUnit={toggleUnit}
        currentUnit={tempUnit}
        onLocationSelect={handleLocationSelect}
        isMobile={isMobile}
      />
      <div className="backdrop-blur"></div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="content-wrapper">
          <div className={`main-content ${isMenuOpen && !isMobile ? 'shifted' : ''}`}>
            {data && currentForecast && (
              <>
                <div className="glass-card weather-card">
                  <div className="location-display mb-3 text-center">
                    <h4 className="mb-0 text-white">
                      {data.location ? data.location.display_name : currentLocation}
                    </h4>
                  </div>
                  <WeatherDisplay
                    forecast={currentForecast}
                    data={data}
                    unit={tempUnit}
                  />
                </div>

                <div className="glass-card forecast-card mt-4">
                  <TimePicker
                    data={data}
                    onSelectHour={(hour) => {
                      const hourIndex = data.hourly.time.findIndex(time => 
                        new Date(time).getHours() === new Date(hour.time).getHours()
                      );
                      
                      setCurrentForecast({
                        ...hour,
                        precipitation: data.hourly.precipitation[hourIndex],
                        humidity: data.hourly.relative_humidity_2m?.[hourIndex] || data.current.relative_humidity_2m,
                        windSpeed: data.hourly.wind_speed_10m?.[hourIndex] || data.current.wind_speed_10m,
                        cloudCover: data.hourly.cloud_cover?.[hourIndex] || data.current.cloud_cover
                      });
                      // Store the selected hour index
                      setSelectedHourIndex(hourIndex);
                    }}
                    currentTime={currentForecast.time}
                    unit={tempUnit}
                  />
                </div>

                {data.hourly?.precipitation && (
                  <div className="mt-4">
                    <PrecipitationChart 
                      hourlyTime={data.hourly.time}
                      hourlyPrecipitation={data.hourly.precipitation}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <WeatherDetails
        data={data}
        isOpen={isMenuOpen}
        unit={tempUnit}
        isMobile={isMobile}
        selectedHourIndex={selectedHourIndex}
      />
    </div>
  );
}

export default App;
