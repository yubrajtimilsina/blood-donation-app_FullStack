const mongoose = require('mongoose');
// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (coord1, coord2) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    
    const R = 6371; // Earth's radius in kilometers
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in kilometers
  };
  
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };
  
  // Find nearby items within radius
  const findNearby = async (Model, coordinates, radiusKm = 10, additionalFilters = {}) => {
    try {
      const results = await Model.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            $maxDistance: radiusKm * 1000 // Convert km to meters
          }
        },
        ...additionalFilters
      });
      
      return results;
    } catch (error) {
      console.error('Error finding nearby items:', error);
      return [];
    }
  };
  
  module.exports = {
    calculateDistance,
    findNearby
  };