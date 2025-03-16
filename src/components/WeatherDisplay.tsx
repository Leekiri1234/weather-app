import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faMoon, faCloudRain, faTint, faWind } from '@fortawesome/free-solid-svg-icons';
import { WeatherData, HourlyForecast } from '../types/weatherTypes';
import { convertTemperature } from '../utils/temperatureUtils';
import { formatTime, formatFullDate } from '../utils/dateUtils';
import '../styles/weatherDisplay.css';

interface WeatherDisplayProps {
  forecast: HourlyForecast;
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

const WeatherDisplay = ({ forecast, data, unit }: WeatherDisplayProps) => {
  const getWeatherIcon = () => {
    const hour = new Date(forecast.time).getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    if (forecast.weatherDescription.toLowerCase().includes('cloud')) {
      return faCloud;
    } else if (isDaytime) {
      return faSun;
    } else {
      return faMoon;
    }
  };
  
  const formattedTemperature = convertTemperature(forecast.temperature, unit);
  const temperatureUnit = unit === 'celsius' ? '°C' : '°F';
  
  return (
    <div className="weather-display text-center">
      <div className="weather-info p-3 rounded-3 shadow-sm">
        <h1 className="display-1 fw-bold mb-3 temperature-display">
          {formattedTemperature}{temperatureUnit}
        </h1>
        
        <div className="time-info mb-4">
          <span className="time-badge">
            {formatTime(forecast.time)}
          </span>
        </div>
        
        <div className="weather-description-modern" aria-live="polite">
          <div className="icon-container mb-2">
            <FontAwesomeIcon 
              icon={getWeatherIcon()} 
              className="weather-icon-large" 
              aria-hidden="true"
              beat={forecast.weatherDescription.toLowerCase().includes('storm')}
              pulse={forecast.weatherDescription.toLowerCase().includes('rain')}
            />
          </div>
          <h2 className="weather-condition">
            {forecast.weatherDescription}
          </h2>
        </div>
        
        <div className="weather-details mt-4 pt-3 border-top">
          <h3 className="mb-3 responsive-heading">Notable Information</h3>
          <div className="row g-3 d-flex justify-content-center">
            <div className="col-12">
              <div className="date-info responsive-location">
                <span className="text-truncate d-inline-block w-75 align-middle">
                  {formatFullDate(new Date())}
                </span>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="data-point">
                <div className="label text-muted">Feels Like</div>
                <div className="value">
                  {convertTemperature(data.current.apparent_temperature, unit)}{temperatureUnit}
                </div>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="data-point">
                <div className="label text-muted">Humidity</div>
                <div className="value">{forecast.humidity || data.current.relative_humidity_2m}%</div>
              </div>
            </div>
            
            <div className="col-6 col-md-4">
              <div className="data-point">
                <div className="label text-muted">Cloud Cover</div>
                <div className="value">{forecast.cloudCover || data.current.cloud_cover}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
