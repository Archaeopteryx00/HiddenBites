// Frontend/src/services/geocoding.ts
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Rate limiting helper (Nominatim limit: 1 req/sec)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

const rateLimitedFetch = async (url: string) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return fetch(url);
};

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

// Reverse Geocoding: Coordinates → Address
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<GeocodingResult> => {
  try {
    const url = `${NOMINATIM_BASE_URL}/reverse?` + new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: 'json',
      addressdetails: '1',
    });

    const response = await rateLimitedFetch(url);
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    return {
      latitude,
      longitude,
      displayName: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      address: data.address,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Fallback to coordinates
    return {
      latitude,
      longitude,
      displayName: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    };
  }
};

// Forward Geocoding: Address → Coordinates
export const forwardGeocode = async (
  address: string
): Promise<GeocodingResult[]> => {
  try {
    const url = `${NOMINATIM_BASE_URL}/search?` + new URLSearchParams({
      q: address,
      format: 'json',
      addressdetails: '1',
      limit: '5',
    });

    const response = await rateLimitedFetch(url);
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    return data.map((item: any) => ({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      displayName: item.display_name,
      address: item.address,
    }));
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return [];
  }
};

export default {
  reverseGeocode,
  forwardGeocode,
};