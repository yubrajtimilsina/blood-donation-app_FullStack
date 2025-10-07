import { useState } from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

const LocationPicker = ({ onLocationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        setLocation(locationData);
        setLoading(false);
        
        if (onLocationSelect) {
          onLocationSelect(locationData);
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-4">
      <button
        onClick={getCurrentLocation}
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Getting Location...
          </>
        ) : (
          <>
            <FaMapMarkerAlt />
            Use My Current Location
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {location && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-1">
            <FaMapMarkerAlt />
            <span className="font-semibold">Location Detected</span>
          </div>
          <div className="text-xs">
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
            <p>Accuracy: ~{Math.round(location.accuracy)} meters</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        We use your location to find nearby donors or blood requests. Your privacy is protected.
      </p>
    </div>
  );
};

export default LocationPicker;