
const mongoose = require('mongoose');

// Simple geocoding placeholder. Replace with real API (e.g., Google, Mapbox)
// Returns GeoJSON Point or null

async function geocodeAddress(address) {
  try {
    if (!address) return null;
    // TODO: integrate real geocoding; for now return null to skip
    return null;
  } catch (e) {
    return null;
  }
}

module.exports = { geocodeAddress };