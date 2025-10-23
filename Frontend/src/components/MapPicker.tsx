// Frontend/src/components/MapPicker.tsx
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader, Navigation } from 'lucide-react';
import { reverseGeocode } from '../services/geocoding';

interface MapPickerProps {
  onLocationSelect: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialLocation?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialLocation?.address || '');
  const [mapReady, setMapReady] = useState(false);

  // Default location (Surabaya center)
  const DEFAULT_LAT = -7.2575;
  const DEFAULT_LNG = 112.7521;

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.async = true;

    script.onload = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        initializeMap();
      }
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Initialize map
    const initialLat = initialLocation?.latitude || DEFAULT_LAT;
    const initialLng = initialLocation?.longitude || DEFAULT_LNG;

    const map = L.map(mapRef.current).setView([initialLat, initialLng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add initial marker if location exists
    if (initialLocation?.latitude && initialLocation?.longitude) {
      addMarker(initialLocation.latitude, initialLocation.longitude);
    }

    // Click event to add/move marker
    map.on('click', async (e: any) => {
      const { lat, lng } = e.latlng;
      await handleLocationSelect(lat, lng);
    });

    setMapReady(true);
  };

  const addMarker = (lat: number, lng: number) => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Custom icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: #ea580c; 
          width: 40px; 
          height: 40px; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          border: 3px solid white; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg); color: white; font-size: 20px;">📍</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Add new marker
    const marker = L.marker([lat, lng], { 
      icon: customIcon,
      draggable: true 
    }).addTo(mapInstanceRef.current);

    // Drag event
    marker.on('dragend', async (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      await handleLocationSelect(lat, lng);
    });

    markerRef.current = marker;

    // Center map on marker
    mapInstanceRef.current.setView([lat, lng], 15);
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setIsLoading(true);

    // Add marker immediately
    addMarker(lat, lng);

    try {
      // Reverse geocode to get address
      const result = await reverseGeocode(lat, lng);
      const address = result.displayName;

      setSelectedAddress(address);
      onLocationSelect({
        address,
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setSelectedAddress(fallbackAddress);
      onLocationSelect({
        address: fallbackAddress,
        latitude: lat,
        longitude: lng,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await handleLocationSelect(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please ensure location permission is granted.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Location * <span className="text-gray-500 font-normal">(Click on map to pin location)</span>
      </label>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
        <div 
          ref={mapRef} 
          className="w-full h-64"
          style={{ minHeight: '256px' }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Getting address...</p>
            </div>
          </div>
        )}

        {/* Current Location Button */}
        {mapReady && (
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className="absolute top-3 right-3 bg-white hover:bg-gray-50 p-2.5 rounded-lg shadow-lg transition-colors disabled:opacity-50 z-10"
            title="Use my current location"
          >
            <Navigation className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Instruction Overlay (shown when no location selected) */}
        {!selectedAddress && mapReady && (
          <div className="absolute bottom-3 left-3 right-3 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-10">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>Click anywhere on the map to select location</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 mb-1">Selected Location:</p>
            <p className="text-sm text-gray-700 break-words">{selectedAddress}</p>
          </div>
        </div>
      )}

      {/* Manual Input (Optional) */}
      <div className="pt-2">
        <input
          type="text"
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          placeholder="Or type address manually..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          You can also type the address manually if the map location is not accurate
        </p>
      </div>
    </div>
  );
};

export default MapPicker;