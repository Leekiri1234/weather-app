import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faClock } from '@fortawesome/free-solid-svg-icons';
import wmo from '../assets/wmo.json';
import { WeatherData, HourlyForecast } from '../types/weatherTypes';
import { convertTemperature } from '../utils/temperatureUtils';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/timePicker.css';

interface TimePickerProps {
  data: WeatherData;
  onSelectHour: (forecast: HourlyForecast) => void;
  currentTime: string;
  unit: 'celsius' | 'fahrenheit';
}

const TimePicker = ({ data, onSelectHour, currentTime, unit }: TimePickerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isMobile && containerRef.current) {
      const container = containerRef.current;
      
      if (container.scrollWidth > container.clientWidth) {
        container.classList.add('scrollable');
        
        const handleScroll = () => {
          container.classList.remove('scrollable');
          container.removeEventListener('scroll', handleScroll);
        };
        
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
      }
    }
  }, [isMobile, data]);
  
  const handleHourClick = (hourIndex: number) => {
    if (!data) return;
    
    const hourTime = new Date(data.hourly.time[hourIndex]);
    const isDaytime = hourTime.getHours() >= 6 && hourTime.getHours() < 18;
    const weatherCode = data.hourly.weather_code[hourIndex];
    const timeOfDay = isDaytime ? 'day' : 'night';
    
    onSelectHour({
      time: hourTime.toLocaleString('en-us'),
      temperature: data.hourly.temperature_2m[hourIndex],
      weatherCode: weatherCode,
      weatherDescription: wmo[weatherCode][timeOfDay].description,
      weatherImage: wmo[weatherCode][timeOfDay].image
    });
  };
  
  const getHourDisplay = (hourStr: string) => {
    const hour = new Date(hourStr).getHours();
    return `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;
  };
  
  const isCurrentHour = (hourStr: string) => {
    return new Date(hourStr).toLocaleString('en-us') === currentTime;
  };

  return (
    <div className="time-picker-wrapper my-4">
      <div className="glass-card time-picker-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 d-flex align-items-center">
            <FontAwesomeIcon icon={faClock} className="me-2" />
            Hourly Forecast
          </h5>
          <button 
            className="btn-modern"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse hourly details" : "Expand hourly details"}
          >
            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
          </button>
        </div>
        
        <div className="time-picker-container" ref={containerRef}>
          <div className="d-flex time-picker-scroll">
            {data?.hourly.time.slice(0, 24).map((hourStr, index) => (
              <motion.div
                key={hourStr}
                className={`time-slot ${isCurrentHour(hourStr) ? 'active-time-slot' : ''}`}
                onClick={() => handleHourClick(index)}
                whileHover={isMobile ? {} : { y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="hour-label">{getHourDisplay(hourStr)}</div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      className="hour-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="temperature fs-3">
                        {convertTemperature(data.hourly.temperature_2m[index], unit)}
                        <span className="temp-unit">{unit === 'celsius' ? '°C' : '°F'}</span>
                      </div>
                      <div className="weather-icon-container">
                        <img 
                          src={wmo[data.hourly.weather_code[index]].day.image} 
                          alt="Weather icon" 
                          className="weather-icon"
                        />
                      </div>
                      <div className="weather-desc">
                        {wmo[data.hourly.weather_code[index]].day.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
