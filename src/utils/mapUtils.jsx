/**
 * Map utility functions for the real estate application
 */

/**
 * Calculate the center point of multiple coordinates
 * @param {Array} properties - Array of properties with latitude and longitude
 * @returns {Array} [latitude, longitude] of the center point
 */
export const calculateMapCenter = (properties) => {
  if (!properties || properties.length === 0) {
    return [40.7128, -74.0060]; // Default to NYC
  }

  const validProperties = properties.filter(p => p.latitude && p.longitude);
  
  if (validProperties.length === 0) {
    return [40.7128, -74.0060]; // Default to NYC
  }

  if (validProperties.length === 1) {
    return [validProperties[0].latitude, validProperties[0].longitude];
  }

  const sum = validProperties.reduce(
    (acc, property) => ({
      lat: acc.lat + parseFloat(property.latitude),
      lng: acc.lng + parseFloat(property.longitude),
    }),
    { lat: 0, lng: 0 }
  );

  return [
    sum.lat / validProperties.length,
    sum.lng / validProperties.length,
  ];
};

/**
 * Calculate appropriate zoom level based on the spread of properties
 * @param {Array} properties - Array of properties with latitude and longitude
 * @returns {number} Appropriate zoom level
 */
export const calculateZoomLevel = (properties) => {
  if (!properties || properties.length === 0) {
    return 10;
  }

  const validProperties = properties.filter(p => p.latitude && p.longitude);
  
  if (validProperties.length <= 1) {
    return 15;
  }

  const lats = validProperties.map(p => parseFloat(p.latitude));
  const lngs = validProperties.map(p => parseFloat(p.longitude));
  
  const latSpread = Math.max(...lats) - Math.min(...lats);
  const lngSpread = Math.max(...lngs) - Math.min(...lngs);
  
  const maxSpread = Math.max(latSpread, lngSpread);
  
  if (maxSpread > 10) return 5;
  if (maxSpread > 5) return 6;
  if (maxSpread > 2) return 7;
  if (maxSpread > 1) return 8;
  if (maxSpread > 0.5) return 9;
  if (maxSpread > 0.1) return 10;
  if (maxSpread > 0.05) return 11;
  if (maxSpread > 0.01) return 12;
  return 13;
};

/**
 * Get map bounds from an array of properties
 * @param {Array} properties - Array of properties with latitude and longitude
 * @returns {Object} Bounds object with north, south, east, west
 */
export const getMapBounds = (properties) => {
  const validProperties = properties.filter(p => p.latitude && p.longitude);
  
  if (validProperties.length === 0) {
    return null;
  }

  const lats = validProperties.map(p => parseFloat(p.latitude));
  const lngs = validProperties.map(p => parseFloat(p.longitude));
  
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
};

/**
 * Format coordinates for display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Formatted coordinate string
 */
export const formatCoordinates = (lat, lng) => {
  if (!lat || !lng) return 'Coordinates not available';
  
  const latFormatted = parseFloat(lat).toFixed(6);
  const lngFormatted = parseFloat(lng).toFixed(6);
  
  return `${latFormatted}, ${lngFormatted}`;
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
export const validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  return (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - First point latitude
 * @param {number} lng1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lng2 - Second point longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};
