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
  
  // Utility to perform nearby search using MongoDB $geoNear
  // Model must have a 2dsphere index on 'location'

async function findNearby(Model, coordinates, radiusKm, filter = {}) {
  // radiusKm to meters
  const maxDistance = Math.max(1, radiusKm) * 1000;
  const pipeline = [
    {
      $geoNear: {
        near: { type: 'Point', coordinates },
        distanceField: 'distance',
        maxDistance,
        spherical: true,
        query: filter
      }
    },
    { $sort: { distance: 1 } }
  ];
  const results = await Model.aggregate(pipeline);
  return results;
}

module.exports = {
    calculateDistance,
    findNearby
  };