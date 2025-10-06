
const mongoose = require('mongoose');

// Using OpenStreetMap Nominatim (free, no API key needed)
// For production, consider Google Maps API or Mapbox

const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'BloodDonationApp/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return {
        coordinates: [parseFloat(lon), parseFloat(lat)],
        type: 'Point'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};

const reverseGeocode = async (longitude, latitude) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json'
      },
      headers: {
        'User-Agent': 'BloodDonationApp/1.0'
      }
    });

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    }
    
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return null;
  }
};

module.exports = {
  geocodeAddress,
  reverseGeocode
};