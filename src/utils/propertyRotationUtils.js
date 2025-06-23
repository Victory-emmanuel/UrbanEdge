/**
 * Property Rotation Utilities
 * 
 * Utilities for handling property randomization and rotation timing
 * for the Featured Properties section on the homepage.
 */

/**
 * ROTATION TIMING CONFIGURATION
 * 
 * ⚠️ PRODUCTION CONFIGURATION NOTICE ⚠️
 * 
 * The rotation interval is currently set to 1 minute for testing/demonstration purposes.
 * For production use, change the ROTATION_INTERVAL_MS value below:
 * 
 * Current (Testing): 1 minute = 60 * 1000 = 60,000 ms
 * Production (Weekly): 1 week = 7 * 24 * 60 * 60 * 1000 = 604,800,000 ms
 * 
 * To change to weekly rotation for production, update the line below:
 * export const ROTATION_INTERVAL_MS = 604800000; // 1 week
 */
export const ROTATION_INTERVAL_MS = 60000; // 1 minute (for testing)

/**
 * Alternative timing options (uncomment the desired option):
 */
// export const ROTATION_INTERVAL_MS = 300000;    // 5 minutes
// export const ROTATION_INTERVAL_MS = 3600000;   // 1 hour
// export const ROTATION_INTERVAL_MS = 86400000;  // 1 day
// export const ROTATION_INTERVAL_MS = 604800000; // 1 week (RECOMMENDED FOR PRODUCTION)

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new array, doesn't mutate original)
 */
export const shuffleArray = (array) => {
  const shuffled = [...array]; // Create a copy to avoid mutating original
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Get a random selection of properties without duplicates
 * @param {Array} properties - Array of all available properties
 * @param {number} count - Number of properties to select (default: 4)
 * @returns {Array} Array of randomly selected properties
 */
export const getRandomProperties = (properties, count = 4) => {
  if (!properties || properties.length === 0) {
    return [];
  }
  
  // If we have fewer properties than requested, return all available
  if (properties.length <= count) {
    return shuffleArray(properties);
  }
  
  // Shuffle the array and take the first 'count' items
  const shuffled = shuffleArray(properties);
  return shuffled.slice(0, count);
};

/**
 * Create a rotation key based on current time and interval
 * This ensures properties rotate at consistent intervals
 * @param {number} intervalMs - Rotation interval in milliseconds
 * @returns {string} Rotation key for caching/consistency
 */
export const getRotationKey = (intervalMs = ROTATION_INTERVAL_MS) => {
  const now = Date.now();
  const rotationNumber = Math.floor(now / intervalMs);
  return `rotation_${rotationNumber}`;
};

/**
 * Get time until next rotation
 * @param {number} intervalMs - Rotation interval in milliseconds
 * @returns {number} Milliseconds until next rotation
 */
export const getTimeUntilNextRotation = (intervalMs = ROTATION_INTERVAL_MS) => {
  const now = Date.now();
  const currentRotationStart = Math.floor(now / intervalMs) * intervalMs;
  const nextRotationStart = currentRotationStart + intervalMs;
  return nextRotationStart - now;
};

/**
 * Format time remaining for display
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTimeRemaining = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Seeded random number generator for consistent randomization
 * This ensures the same properties are shown during the same rotation period
 * @param {string} seed - Seed string for randomization
 * @returns {number} Random number between 0 and 1
 */
export const seededRandom = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Simple linear congruential generator
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  
  hash = (a * Math.abs(hash) + c) % m;
  return hash / m;
};

/**
 * Get consistently random properties for the current rotation period
 * This ensures the same properties are shown during the same rotation interval
 * @param {Array} properties - Array of all available properties
 * @param {number} count - Number of properties to select
 * @param {number} intervalMs - Rotation interval in milliseconds
 * @returns {Array} Array of consistently selected properties for current rotation
 */
export const getRotationProperties = (properties, count = 4, intervalMs = ROTATION_INTERVAL_MS) => {
  if (!properties || properties.length === 0) {
    return [];
  }
  
  // If we have fewer properties than requested, return all available
  if (properties.length <= count) {
    return [...properties];
  }
  
  // Get rotation key for consistency
  const rotationKey = getRotationKey(intervalMs);
  
  // Create a seeded random selection
  const propertiesWithSeededOrder = properties.map((property, index) => ({
    property,
    randomValue: seededRandom(`${rotationKey}_${property.id}_${index}`)
  }));
  
  // Sort by seeded random value and take the first 'count' items
  propertiesWithSeededOrder.sort((a, b) => a.randomValue - b.randomValue);
  
  return propertiesWithSeededOrder.slice(0, count).map(item => item.property);
};

/**
 * Log rotation information for debugging
 * @param {Array} selectedProperties - Currently selected properties
 * @param {number} intervalMs - Rotation interval in milliseconds
 */
export const logRotationInfo = (selectedProperties, intervalMs = ROTATION_INTERVAL_MS) => {
  const rotationKey = getRotationKey(intervalMs);
  const timeUntilNext = getTimeUntilNextRotation(intervalMs);
  const formattedTime = formatTimeRemaining(timeUntilNext);
  
  console.group('🔄 Featured Properties Rotation Info');
  console.log('📅 Rotation Key:', rotationKey);
  console.log('⏰ Time until next rotation:', formattedTime);
  console.log('🏠 Selected Properties:', selectedProperties.map(p => ({
    id: p.id,
    title: p.title
  })));
  console.log('⚙️ Rotation Interval:', intervalMs / 1000, 'seconds');
  console.groupEnd();
};

/**
 * Development helper to test different rotation intervals
 * Only available in development mode
 */
export const testRotationIntervals = () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('testRotationIntervals() is only available in development mode');
    return;
  }
  
  const intervals = {
    '1 minute': 60000,
    '5 minutes': 300000,
    '1 hour': 3600000,
    '1 day': 86400000,
    '1 week': 604800000
  };
  
  console.group('🧪 Rotation Interval Testing');
  Object.entries(intervals).forEach(([name, ms]) => {
    const key = getRotationKey(ms);
    const timeUntilNext = getTimeUntilNextRotation(ms);
    console.log(`${name}: Key=${key}, Next in ${formatTimeRemaining(timeUntilNext)}`);
  });
  console.groupEnd();
};

// Export for browser console testing in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.propertyRotationUtils = {
    testRotationIntervals,
    getRotationKey,
    getTimeUntilNextRotation,
    formatTimeRemaining,
    ROTATION_INTERVAL_MS
  };
}
