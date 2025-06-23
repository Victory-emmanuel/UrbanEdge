/**
 * Image Handling Test Utilities
 * 
 * Test utilities for verifying the image handling fixes in the UrbanEdge application.
 * Run these tests to ensure images display correctly and fallbacks work properly.
 */

import { 
  isValidImageUrl, 
  sanitizeImageUrl, 
  getFallbackImage, 
  preloadImage,
  getPropertyImageUrl,
  FALLBACK_IMAGES 
} from './imageUtils';

/**
 * Test image URL validation
 */
export const testImageValidation = () => {
  console.log('🧪 Testing Image URL Validation...\n');
  
  const testCases = [
    // Valid URLs
    { url: 'https://images.unsplash.com/photo-123.jpg', expected: true, description: 'Unsplash image' },
    { url: 'https://example.com/image.png', expected: true, description: 'PNG image' },
    { url: 'https://cdn.example.com/photo.jpeg?v=1', expected: true, description: 'JPEG with query params' },
    { url: 'https://imgur.com/abc123.gif', expected: true, description: 'Imgur GIF' },
    
    // Invalid URLs
    { url: '', expected: false, description: 'Empty string' },
    { url: null, expected: false, description: 'Null value' },
    { url: 'not-a-url', expected: false, description: 'Invalid URL format' },
    { url: 'https://example.com/document.pdf', expected: false, description: 'Non-image file' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach(({ url, expected, description }) => {
    const result = isValidImageUrl(url);
    const status = result === expected ? '✅' : '❌';
    
    console.log(`${status} ${description}: ${url} -> ${result}`);
    
    if (result === expected) {
      passed++;
    } else {
      failed++;
    }
  });
  
  console.log(`\n📊 Validation Results: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
};

/**
 * Test fallback image functionality
 */
export const testFallbackImages = () => {
  console.log('🧪 Testing Fallback Images...\n');
  
  const contexts = ['primary', 'secondary', 'form', 'thumbnail', 'gallery'];
  let allValid = true;
  
  contexts.forEach(context => {
    const fallbackUrl = getFallbackImage(context);
    const isValid = isValidImageUrl(fallbackUrl);
    const status = isValid ? '✅' : '❌';
    
    console.log(`${status} ${context}: ${fallbackUrl}`);
    
    if (!isValid) {
      allValid = false;
    }
  });
  
  console.log(`\n📊 All fallback images valid: ${allValid ? 'Yes' : 'No'}\n`);
  return allValid;
};

/**
 * Test image preloading functionality
 */
export const testImagePreloading = async () => {
  console.log('🧪 Testing Image Preloading...\n');
  
  const testUrls = [
    { url: FALLBACK_IMAGES.PRIMARY, description: 'Primary fallback' },
    { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa', description: 'Valid Unsplash image' },
    { url: 'https://invalid-domain-that-does-not-exist.com/image.jpg', description: 'Invalid domain' },
    { url: 'https://httpstat.us/404.jpg', description: '404 error image' }
  ];
  
  for (const { url, description } of testUrls) {
    console.log(`Testing: ${description}`);
    const startTime = Date.now();
    
    try {
      const result = await preloadImage(url);
      const duration = Date.now() - startTime;
      const status = result ? '✅' : '❌';
      
      console.log(`${status} ${description}: ${result} (${duration}ms)`);
    } catch (error) {
      console.log(`❌ ${description}: Error - ${error.message}`);
    }
  }
  
  console.log('\n');
};

/**
 * Test property image URL extraction
 */
export const testPropertyImageExtraction = () => {
  console.log('🧪 Testing Property Image URL Extraction...\n');
  
  const testProperties = [
    {
      name: 'Property with images array',
      property: {
        images: [{ url: 'https://example.com/image1.jpg' }]
      },
      expected: 'https://example.com/image1.jpg'
    },
    {
      name: 'Property with property_images array',
      property: {
        property_images: [{ image_url: 'https://example.com/image2.jpg' }]
      },
      expected: 'https://example.com/image2.jpg'
    },
    {
      name: 'Property with thumbnail_url',
      property: {
        thumbnail_url: 'https://example.com/thumb.jpg'
      },
      expected: 'https://example.com/thumb.jpg'
    },
    {
      name: 'Property with no images',
      property: {
        title: 'Test Property'
      },
      expected: FALLBACK_IMAGES.PRIMARY
    }
  ];
  
  let passed = 0;
  
  testProperties.forEach(({ name, property, expected }) => {
    const result = getPropertyImageUrl(property);
    const status = result === expected ? '✅' : '❌';
    
    console.log(`${status} ${name}: ${result}`);
    
    if (result === expected) {
      passed++;
    }
  });
  
  console.log(`\n📊 Property image extraction: ${passed}/${testProperties.length} passed\n`);
  return passed === testProperties.length;
};

/**
 * Test image sanitization
 */
export const testImageSanitization = () => {
  console.log('🧪 Testing Image URL Sanitization...\n');
  
  const testCases = [
    {
      input: '  https://example.com/image.jpg  ',
      description: 'URL with whitespace',
      shouldBeSanitized: true
    },
    {
      input: 'https://images.unsplash.com/photo-123.jpg',
      description: 'Valid Unsplash URL',
      shouldBeSanitized: false
    },
    {
      input: 'invalid-url',
      description: 'Invalid URL',
      shouldBeSanitized: true
    },
    {
      input: '',
      description: 'Empty string',
      shouldBeSanitized: true
    }
  ];
  
  let passed = 0;
  
  testCases.forEach(({ input, description, shouldBeSanitized }) => {
    const result = sanitizeImageUrl(input);
    const wasSanitized = result !== input.trim();
    const testPassed = shouldBeSanitized ? wasSanitized : !wasSanitized;
    const status = testPassed ? '✅' : '❌';
    
    console.log(`${status} ${description}: "${input}" -> "${result}"`);
    
    if (testPassed) {
      passed++;
    }
  });
  
  console.log(`\n📊 Sanitization tests: ${passed}/${testCases.length} passed\n`);
  return passed === testCases.length;
};

/**
 * Test for problematic placeholder URLs in the DOM
 */
export const testForProblematicUrls = () => {
  console.log('🧪 Testing for Problematic Placeholder URLs in DOM...\n');
  
  const problematicUrls = [
    'via.placeholder.com',
    'placeholder.com',
    'Image+Error',
    'No+Image'
  ];
  
  let foundProblematic = false;
  
  // Check all images in the DOM
  const images = document.querySelectorAll('img');
  console.log(`Found ${images.length} images in DOM`);
  
  images.forEach((img, index) => {
    const src = img.src;
    const hasProblematic = problematicUrls.some(url => src.includes(url));
    
    if (hasProblematic) {
      console.log(`❌ Image ${index + 1}: Problematic URL found - ${src}`);
      foundProblematic = true;
    }
  });
  
  if (!foundProblematic) {
    console.log('✅ No problematic placeholder URLs found in DOM');
  }
  
  console.log(`\n📊 Problematic URLs found: ${foundProblematic ? 'Yes' : 'No'}\n`);
  return !foundProblematic;
};

/**
 * Test image error handling in the browser
 */
export const testImageErrorHandling = () => {
  console.log('🧪 Testing Image Error Handling...\n');
  
  // Create a test image with an invalid URL
  const testImg = document.createElement('img');
  testImg.style.display = 'none';
  document.body.appendChild(testImg);
  
  return new Promise((resolve) => {
    let errorHandled = false;
    
    testImg.onload = () => {
      console.log('❌ Test image loaded unexpectedly');
      document.body.removeChild(testImg);
      resolve(false);
    };
    
    testImg.onerror = () => {
      console.log('✅ Image error event triggered correctly');
      errorHandled = true;
      
      // Check if the src was changed to a fallback
      setTimeout(() => {
        const isFallback = Object.values(FALLBACK_IMAGES).some(url => 
          testImg.src.includes(url.split('/').pop())
        );
        
        console.log(`${isFallback ? '✅' : '❌'} Fallback image set: ${testImg.src}`);
        
        document.body.removeChild(testImg);
        resolve(errorHandled && isFallback);
      }, 100);
    };
    
    // Set an invalid image URL
    testImg.src = 'https://invalid-domain-12345.com/nonexistent.jpg';
    
    // Timeout after 5 seconds
    setTimeout(() => {
      if (!errorHandled) {
        console.log('❌ Image error handling timeout');
        document.body.removeChild(testImg);
        resolve(false);
      }
    }, 5000);
  });
};

/**
 * Run all image handling tests
 */
export const runAllImageTests = async () => {
  console.log('🚀 Running Image Handling Tests...\n');
  console.log('='.repeat(50));
  
  const results = {
    validation: testImageValidation(),
    fallbacks: testFallbackImages(),
    propertyExtraction: testPropertyImageExtraction(),
    sanitization: testImageSanitization(),
    problematicUrls: testForProblematicUrls(),
    preloading: await testImagePreloading(),
    errorHandling: await testImageErrorHandling()
  };
  
  console.log('='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All image handling tests passed! Image fixes are working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the details above.');
  }
  
  return results;
};

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.imageTests = {
    testImageValidation,
    testFallbackImages,
    testImagePreloading,
    testPropertyImageExtraction,
    testImageSanitization,
    testForProblematicUrls,
    testImageErrorHandling,
    runAllImageTests
  };
  
  console.log('🔧 Image test utilities loaded!');
  console.log('💡 Run window.imageTests.runAllImageTests() to test image handling');
}
