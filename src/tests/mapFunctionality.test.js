/**
 * Test file for map functionality
 * This file contains tests to verify the map features work correctly
 */

import { propertyService } from '../lib/propertyService';
import { 
  calculateMapCenter, 
  calculateZoomLevel, 
  validateCoordinates,
  formatCoordinates,
  calculateDistance 
} from '../utils/mapUtils';

// Mock property data for testing
const mockProperties = [
  {
    id: '1',
    title: 'Test Property 1',
    location: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.0060,
    price: 500000
  },
  {
    id: '2',
    title: 'Test Property 2',
    location: 'Los Angeles, CA',
    latitude: 34.0522,
    longitude: -118.2437,
    price: 750000
  },
  {
    id: '3',
    title: 'Test Property 3',
    location: 'Chicago, IL',
    latitude: 41.8781,
    longitude: -87.6298,
    price: 400000
  }
];

/**
 * Test map utility functions
 */
export const testMapUtils = () => {
  console.log('🗺️ Testing Map Utility Functions...');

  // Test calculateMapCenter
  console.log('\n📍 Testing calculateMapCenter:');
  const center = calculateMapCenter(mockProperties);
  console.log('Center for 3 properties:', center);
  console.log('Expected: approximately [38.9, -93.3]');

  const singleCenter = calculateMapCenter([mockProperties[0]]);
  console.log('Center for 1 property:', singleCenter);
  console.log('Expected: [40.7128, -74.0060]');

  const emptyCenter = calculateMapCenter([]);
  console.log('Center for no properties:', emptyCenter);
  console.log('Expected: [40.7128, -74.0060] (default NYC)');

  // Test calculateZoomLevel
  console.log('\n🔍 Testing calculateZoomLevel:');
  const zoom = calculateZoomLevel(mockProperties);
  console.log('Zoom for 3 properties:', zoom);
  console.log('Expected: 5-7 (wide spread)');

  const singleZoom = calculateZoomLevel([mockProperties[0]]);
  console.log('Zoom for 1 property:', singleZoom);
  console.log('Expected: 15');

  // Test validateCoordinates
  console.log('\n✅ Testing validateCoordinates:');
  console.log('Valid NYC coords:', validateCoordinates(40.7128, -74.0060));
  console.log('Invalid coords (out of range):', validateCoordinates(91, 181));
  console.log('Invalid coords (NaN):', validateCoordinates('invalid', 'invalid'));

  // Test formatCoordinates
  console.log('\n📝 Testing formatCoordinates:');
  console.log('Formatted NYC:', formatCoordinates(40.7128, -74.0060));
  console.log('Formatted null:', formatCoordinates(null, null));

  // Test calculateDistance
  console.log('\n📏 Testing calculateDistance:');
  const distance = calculateDistance(
    mockProperties[0].latitude, mockProperties[0].longitude,
    mockProperties[1].latitude, mockProperties[1].longitude
  );
  console.log('Distance NYC to LA:', distance.toFixed(2), 'km');
  console.log('Expected: approximately 3944 km');

  console.log('✅ Map utility tests completed!\n');
};

/**
 * Test geocoding functionality
 */
export const testGeocoding = async () => {
  console.log('🌍 Testing Geocoding Functionality...');

  try {
    // Test geocoding a known address
    console.log('\n📍 Testing address geocoding:');
    const coordinates = await propertyService.geocodeAddress('Times Square, New York, NY');
    
    if (coordinates) {
      console.log('Geocoded Times Square:', coordinates);
      console.log('Expected: lat ~40.758, lng ~-73.985');
      
      // Validate the coordinates
      const isValid = validateCoordinates(coordinates.latitude, coordinates.longitude);
      console.log('Coordinates valid:', isValid);
    } else {
      console.log('❌ Geocoding failed for Times Square');
    }

    // Test geocoding an invalid address
    console.log('\n❌ Testing invalid address:');
    const invalidCoords = await propertyService.geocodeAddress('Invalid Address 12345');
    console.log('Invalid address result:', invalidCoords);
    console.log('Expected: null');

    // Test empty address
    console.log('\n🔍 Testing empty address:');
    const emptyCoords = await propertyService.geocodeAddress('');
    console.log('Empty address result:', emptyCoords);
    console.log('Expected: null');

  } catch (error) {
    console.error('❌ Geocoding test failed:', error);
  }

  console.log('✅ Geocoding tests completed!\n');
};

/**
 * Test property service map functions
 */
export const testPropertyService = async () => {
  console.log('🏠 Testing Property Service Map Functions...');

  try {
    // Test bounds-based property search
    console.log('\n🗺️ Testing bounds-based search:');
    const bounds = {
      north: 40.8,
      south: 40.7,
      east: -73.9,
      west: -74.1
    };

    // Note: This will only work if the database function exists
    // const { data, error } = await propertyService.getPropertiesInBounds(bounds);
    // console.log('Properties in NYC bounds:', data?.length || 0);
    // console.log('Error:', error);

    console.log('Bounds test skipped (requires database connection)');

  } catch (error) {
    console.error('❌ Property service test failed:', error);
  }

  console.log('✅ Property service tests completed!\n');
};

/**
 * Test map component integration
 */
export const testMapComponents = () => {
  console.log('🧩 Testing Map Component Integration...');

  // Test property data validation
  console.log('\n📊 Testing property data validation:');
  const validProperties = mockProperties.filter(p => p.latitude && p.longitude);
  console.log('Valid properties count:', validProperties.length);
  console.log('Expected: 3');

  const invalidProperty = { id: '4', title: 'No Coords', location: 'Unknown' };
  const mixedProperties = [...mockProperties, invalidProperty];
  const validFromMixed = mixedProperties.filter(p => p.latitude && p.longitude);
  console.log('Valid from mixed:', validFromMixed.length);
  console.log('Expected: 3');

  // Test marker clustering logic
  console.log('\n🎯 Testing clustering logic:');
  const shouldCluster = validProperties.length > 5;
  console.log('Should cluster (>5 properties):', shouldCluster);
  console.log('Expected: false');

  const manyProperties = Array(10).fill(mockProperties[0]);
  const shouldClusterMany = manyProperties.length > 5;
  console.log('Should cluster (10 properties):', shouldClusterMany);
  console.log('Expected: true');

  console.log('✅ Map component tests completed!\n');
};

/**
 * Run all map functionality tests
 */
export const runAllMapTests = async () => {
  console.log('🚀 Starting Map Functionality Tests...\n');
  
  testMapUtils();
  await testGeocoding();
  await testPropertyService();
  testMapComponents();
  
  console.log('🎉 All map functionality tests completed!');
  console.log('Check the console output above for detailed results.');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.mapTests = {
    runAll: runAllMapTests,
    testUtils: testMapUtils,
    testGeocoding: testGeocoding,
    testPropertyService: testPropertyService,
    testComponents: testMapComponents
  };
}

export default {
  runAllMapTests,
  testMapUtils,
  testGeocoding,
  testPropertyService,
  testMapComponents
};
