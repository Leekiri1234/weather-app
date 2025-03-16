export interface LocationResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

export const searchLocations = async (query: string): Promise<LocationResult[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(query)}&accept-language=vi,en&limit=5&format=jsonv2`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'WeatherApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching for locations:', error);
    throw new Error('Failed to search for locations. Please try again.');
  }
};
