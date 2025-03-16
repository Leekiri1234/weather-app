import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faCloud, faTint, faWind, faCompass, faCloudRain, faTimes } from '@fortawesome/free-solid-svg-icons';
import { WeatherData } from '../types/weatherTypes';
import { convertTemperature } from '../utils/temperatureUtils';
import '../styles/weatherDetails.css';

interface WeatherDetailsProps {
  data: WeatherData | null;
  isOpen: boolean;
  unit: 'celsius' | 'fahrenheit';
  isMobile?: boolean;
  selectedHourIndex?: number; // Add this prop
}

const WeatherDetails = ({ data, isOpen, unit, isMobile = false, selectedHourIndex }: WeatherDetailsProps) => {
  if (!data) return null;
  
  const tempUnit = unit === 'celsius' ? '°C' : '°F';
  const apparentTemp = convertTemperature(
    selectedHourIndex !== undefined ? 
      data.hourly.apparent_temperature?.[selectedHourIndex] ?? data.current.apparent_temperature :
      data.current.apparent_temperature, 
    unit
  );
  
  // Get either hourly or current values
  const humidity = selectedHourIndex !== undefined ? 
    data.hourly.relative_humidity_2m?.[selectedHourIndex] ?? data.current.relative_humidity_2m :
    data.current.relative_humidity_2m;

  const cloudCover = selectedHourIndex !== undefined ?
    data.hourly.cloud_cover?.[selectedHourIndex] ?? data.current.cloud_cover :
    data.current.cloud_cover;

  const windSpeed = selectedHourIndex !== undefined ?
    data.hourly.wind_speed_10m?.[selectedHourIndex] ?? data.current.wind_speed_10m :
    data.current.wind_speed_10m;

  const windDirection = selectedHourIndex !== undefined ?
    data.hourly.wind_direction_10m?.[selectedHourIndex] ?? data.current.wind_direction_10m :
    data.current.wind_direction_10m;

  const precipitation = selectedHourIndex !== undefined ?
    data.hourly.precipitation[selectedHourIndex] :
    data.current.precipitation;

  return (
    <div 
      className={`weather-details-container shadow ${isOpen ? 'open' : ''}`} 
      style={{ width: isMobile ? '100%' : '33.33%' }}
    >
      {isMobile && (
        <div className="d-flex justify-content-end mb-2">
          <button 
            className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            onClick={() => document.body.dispatchEvent(new CustomEvent('closeMenu'))}
            aria-label="Close details"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      
      <div className="py-2 px-2 d-flex flex-column gap-2 justify-content-center h-100">
        <div className='h4 text-center fw-bold fst-italic'>Weather Details</div>
        
        <div className="detail-item d-flex justify-content-between align-items-center p-2 mb-2 rounded">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTemperatureHigh} className="text-danger me-3" />
            <span>Feels Like</span>
          </div>
          <span className="fw-bold">{apparentTemp}{tempUnit}</span>
        </div>

        <div className="detail-item d-flex justify-content-between align-items-center p-2 mb-2 rounded">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTint} className="text-primary me-3" />
            <span>Humidity</span>
          </div>
          <span className="fw-bold">{humidity}%</span>
        </div>
          
        <div className="detail-item d-flex justify-content-between align-items-center p-2 mb-2 rounded">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faCloud} className="text-secondary me-3" />
            <span>Cloud Cover</span>
          </div>
          <span className="fw-bold">{cloudCover}%</span>
        </div>
        
        <div className="detail-item d-flex justify-content-between align-items-center p-2 mb-2 rounded">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faWind} className="text-info me-3" />
            <span>Wind Speed</span>
          </div>
          <span className="fw-bold">{windSpeed} {data.current_units.wind_speed_10m}</span>
        </div>
        
        <div className="detail-item d-flex justify-content-between align-items-center p-2 mb-2 rounded">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faCompass} className="text-success me-3" />
            <span>Wind Direction</span>
          </div>
          <span className="fw-bold">{windDirection}°</span>
        </div>
        
        <div className="detail-item d-flex justify-content-between align-items-center p-2 mb-2 rounded">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faCloudRain} className="text-primary me-3" />
            <span>Precipitation</span>
          </div>
          <span className="fw-bold">{precipitation} {data.current_units.precipitation}</span>
        </div>
        
        {isMobile && (
          <div className="mt-3 text-center">
            <button 
              className="btn btn-light rounded-pill px-4"
              onClick={() => document.body.dispatchEvent(new CustomEvent('closeMenu'))}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
