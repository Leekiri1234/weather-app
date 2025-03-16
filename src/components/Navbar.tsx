import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faExchangeAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { searchLocations } from '../services/geocodingService';
import logo from './../assets/logo.svg';
import '../styles/forms.css';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  toggleUnit: () => void;
  currentUnit: 'celsius' | 'fahrenheit';
  onLocationSelect: (lat: string, lon: string, displayName: string) => void;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen, toggleUnit, currentUnit, onLocationSelect }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      setSearchError(null);
      
      const locations = await searchLocations(searchQuery);
      
      if (locations.length === 0) {
        setSearchError('No locations found. Please try a different search term.');
        return;
      }
      
      const firstLocation = locations[0];
      onLocationSelect(firstLocation.lat, firstLocation.lon, firstLocation.display_name);
      setSearchQuery('');
      
    } catch (error) {
      setSearchError(typeof error === 'string' ? error : 'Failed to search for location');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <nav className="navbar p-3 navbar-expand-lg backdrop-blur-sm bg-white bg-opacity-75 sticky-top shadow-sm">
        <span className="navbar-brand d-flex align-items-center text-primary fw-bold fs-4">
          <img src={logo} width={40} alt="" className='me-2' />
          WonderWeather
        </span>
        <div className="d-flex align-items-center ms-auto">
          <div className="position-relative">
            <form className="d-none d-md-flex me-3" onSubmit={handleSearch}>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control p-2 px-4 rounded-pill rounded-end-0 border-0 shadow-sm bg-light"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchError(null);
                  }}
                  disabled={isSearching}
                />
                <button 
                  className="btn btn-primary rounded-pill rounded-start-0 shadow-sm" 
                  type="submit"
                  disabled={isSearching}
                >
                   <FontAwesomeIcon icon={isSearching ? faSpinner : faSearch} spin={isSearching} />
                </button>
              </div>
            </form>
            {searchError && (
              <div className="position-absolute top-100 start-0 mt-1 w-100 z-3">
                <div className="alert alert-danger py-1 px-2 mb-0 small text-center">{searchError}</div>
              </div>
            )}
          </div>
          
          <button 
            className="btn btn-light btn-sm rounded-pill shadow-sm me-2 text-primary transition-all hover:bg-primary hover:text-white" 
            onClick={toggleUnit}
            title={`Switch to ${currentUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="me-1" />
            {currentUnit === 'celsius' ? '°C' : '°F'}
          </button>
          
          <button 
            className="btn btn-primary btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
            style={{ width: '38px', height: '38px' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
    </nav>
  );
};

export default Navbar;
