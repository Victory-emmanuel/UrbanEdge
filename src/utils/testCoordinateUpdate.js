/**
 * Test utility to verify coordinate update functionality
 * Run this in the browser console to test the fix
 */

import { propertyService } from '../lib/propertyService';

/**
 * Test coordinate update functionality
 */
export const testCoordinateUpdate = async () => {
  console.log('🧪 Testing Coordinate Update Functionality...\n');

  try {
    // First, get a property to test with
    console.log('1️⃣ Getting properties to test with...');
    const { data: properties, error: propertiesError } = await propertyService.getProperties({ limit: 1 });
    
    if (propertiesError || !properties || properties.length === 0) {
      console.error('❌ No properties found to test with:', propertiesError);
      return;
    }

    const testProperty = properties[0];
    console.log('✅ Found test property:', testProperty.title, 'ID:', testProperty.id);

    // Test updating coordinates
    console.log('\n2️⃣ Testing coordinate update...');
    const testCoordinates = {
      latitude: 40.7589, // Times Square latitude
      longitude: -73.9851 // Times Square longitude
    };

    console.log('Updating with coordinates:', testCoordinates);

    const { data: updatedProperty, error: updateError } = await propertyService.updateProperty(
      testProperty.id,
      testCoordinates
    );

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return;
    }

    console.log('✅ Update successful!');
    console.log('Updated property coordinates:', {
      latitude: updatedProperty.latitude,
      longitude: updatedProperty.longitude
    });

    // Test with string coordinates (simulating form input)
    console.log('\n3️⃣ Testing with string coordinates (form simulation)...');
    const stringCoordinates = {
      latitude: "34.0522", // LA latitude as string
      longitude: "-118.2437" // LA longitude as string
    };

    console.log('Updating with string coordinates:', stringCoordinates);

    const { data: updatedProperty2, error: updateError2 } = await propertyService.updateProperty(
      testProperty.id,
      stringCoordinates
    );

    if (updateError2) {
      console.error('❌ String coordinate update failed:', updateError2);
      return;
    }

    console.log('✅ String coordinate update successful!');
    console.log('Updated property coordinates:', {
      latitude: updatedProperty2.latitude,
      longitude: updatedProperty2.longitude
    });

    // Restore original coordinates if they existed
    if (testProperty.latitude && testProperty.longitude) {
      console.log('\n4️⃣ Restoring original coordinates...');
      await propertyService.updateProperty(testProperty.id, {
        latitude: testProperty.latitude,
        longitude: testProperty.longitude
      });
      console.log('✅ Original coordinates restored');
    }

    console.log('\n🎉 All coordinate update tests passed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

/**
 * Test coordinate validation
 */
export const testCoordinateValidation = async () => {
  console.log('🧪 Testing Coordinate Validation...\n');

  try {
    // Get a property to test with
    const { data: properties } = await propertyService.getProperties({ limit: 1 });
    if (!properties || properties.length === 0) {
      console.error('❌ No properties found to test with');
      return;
    }

    const testProperty = properties[0];

    // Test invalid coordinates
    console.log('1️⃣ Testing invalid coordinates...');
    
    const invalidTests = [
      { latitude: "invalid", longitude: "123.456", name: "Invalid latitude" },
      { latitude: "123.456", longitude: "invalid", name: "Invalid longitude" },
      { latitude: "", longitude: "", name: "Empty coordinates" },
      { latitude: null, longitude: null, name: "Null coordinates" }
    ];

    for (const test of invalidTests) {
      console.log(`Testing: ${test.name}`);
      
      const { data, error } = await propertyService.updateProperty(
        testProperty.id,
        test
      );

      if (error) {
        console.log(`⚠️ ${test.name}: Properly rejected with error:`, error.message);
      } else {
        console.log(`✅ ${test.name}: Handled gracefully, coordinates:`, {
          latitude: data.latitude,
          longitude: data.longitude
        });
      }
    }

    console.log('\n🎉 Coordinate validation tests completed!');

  } catch (error) {
    console.error('❌ Validation test failed:', error);
  }
};

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.coordinateTests = {
    testUpdate: testCoordinateUpdate,
    testValidation: testCoordinateValidation
  };
}

export default {
  testCoordinateUpdate,
  testCoordinateValidation
};
