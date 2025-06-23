/**
 * Homepage Enhancements Test Utilities
 * 
 * Utilities for testing the Latest Properties and Featured Properties sections
 * Run these tests in the browser console to verify the implementation
 */

/**
 * Test Latest Properties section functionality
 */
export const testLatestProperties = () => {
  console.log('🧪 Testing Latest Properties Section...\n');
  
  // Check if Latest Properties section exists
  const latestSection = document.querySelector('section:has(h2:contains("Latest Properties"))') ||
                       Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Latest Properties'))?.closest('section');
  
  if (latestSection) {
    console.log('✅ Latest Properties section found');
    
    // Check for property cards
    const propertyCards = latestSection.querySelectorAll('[class*="card"]');
    console.log(`📊 Property cards found: ${propertyCards.length}`);
    
    // Check for "View All" button
    const viewAllButton = latestSection.querySelector('a[href*="properties"]');
    if (viewAllButton) {
      console.log('✅ "View All" button found:', viewAllButton.href);
    } else {
      console.log('❌ "View All" button not found');
    }
    
    return true;
  } else {
    console.log('❌ Latest Properties section not found');
    return false;
  }
};

/**
 * Test Featured Properties section functionality
 */
export const testFeaturedProperties = () => {
  console.log('🧪 Testing Featured Properties Section...\n');
  
  // Check if Featured Properties section exists
  const featuredSection = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Featured Properties'))?.closest('section');
  
  if (featuredSection) {
    console.log('✅ Featured Properties section found');
    
    // Check for property cards
    const propertyCards = featuredSection.querySelectorAll('[class*="card"]');
    console.log(`📊 Property cards found: ${propertyCards.length}`);
    
    // Check for development rotation indicator
    const rotationIndicator = featuredSection.querySelector('[class*="yellow"]');
    if (rotationIndicator) {
      console.log('✅ Development rotation indicator found');
    } else {
      console.log('ℹ️ No rotation indicator (normal in production)');
    }
    
    // Check for navigation arrows (mobile)
    const navArrows = featuredSection.querySelectorAll('button[aria-label*="Scroll"]');
    console.log(`🔄 Navigation arrows found: ${navArrows.length}`);
    
    return true;
  } else {
    console.log('❌ Featured Properties section not found');
    return false;
  }
};

/**
 * Test property card structure and content
 */
export const testPropertyCards = () => {
  console.log('🧪 Testing Property Card Structure...\n');
  
  const propertyCards = document.querySelectorAll('[class*="card"]');
  console.log(`📊 Total property cards found: ${propertyCards.length}`);
  
  if (propertyCards.length === 0) {
    console.log('❌ No property cards found');
    return false;
  }
  
  let validCards = 0;
  
  propertyCards.forEach((card, index) => {
    const title = card.querySelector('h3');
    const price = card.querySelector('[class*="font-bold"]:has-text("₦")') || 
                 Array.from(card.querySelectorAll('*')).find(el => el.textContent.includes('₦'));
    const location = card.querySelector('[class*="MapPin"]')?.parentElement;
    const features = card.querySelectorAll('[class*="flex items-center"] span');
    
    if (title && price && location) {
      validCards++;
      console.log(`✅ Card ${index + 1}: Valid structure`);
      console.log(`   Title: ${title.textContent.trim()}`);
      console.log(`   Price: ${price.textContent.trim()}`);
      console.log(`   Location: ${location.textContent.trim()}`);
      console.log(`   Features: ${features.length} items`);
    } else {
      console.log(`❌ Card ${index + 1}: Missing required elements`);
    }
  });
  
  console.log(`\n📈 Valid cards: ${validCards}/${propertyCards.length}`);
  return validCards > 0;
};

/**
 * Test currency formatting
 */
export const testCurrencyFormatting = () => {
  console.log('🧪 Testing Currency Formatting...\n');
  
  const priceElements = Array.from(document.querySelectorAll('*')).filter(el => 
    el.textContent.includes('₦') && el.children.length === 0
  );
  
  console.log(`💰 Price elements found: ${priceElements.length}`);
  
  let validPrices = 0;
  
  priceElements.forEach((element, index) => {
    const priceText = element.textContent.trim();
    
    // Check if it starts with ₦ and has proper formatting
    if (priceText.startsWith('₦') && /₦[\d,]+/.test(priceText)) {
      validPrices++;
      console.log(`✅ Price ${index + 1}: ${priceText}`);
    } else {
      console.log(`❌ Price ${index + 1}: Invalid format - ${priceText}`);
    }
  });
  
  console.log(`\n📊 Valid prices: ${validPrices}/${priceElements.length}`);
  return validPrices > 0;
};

/**
 * Test responsive behavior
 */
export const testResponsiveLayout = () => {
  console.log('🧪 Testing Responsive Layout...\n');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`📱 Current viewport: ${viewport.width}x${viewport.height}`);
  
  // Determine device type
  let deviceType;
  if (viewport.width < 768) {
    deviceType = 'Mobile';
  } else if (viewport.width < 1024) {
    deviceType = 'Tablet';
  } else {
    deviceType = 'Desktop';
  }
  
  console.log(`📱 Device type: ${deviceType}`);
  
  // Check for horizontal scroll
  const hasHorizontalScroll = document.body.scrollWidth > document.body.clientWidth;
  if (hasHorizontalScroll) {
    console.log('⚠️ Horizontal scroll detected - check layout');
  } else {
    console.log('✅ No horizontal scroll - layout looks good');
  }
  
  // Check for scrollable containers
  const scrollableContainers = document.querySelectorAll('[class*="overflow-x-auto"]');
  console.log(`🔄 Scrollable containers found: ${scrollableContainers.length}`);
  
  return !hasHorizontalScroll;
};

/**
 * Test section order on homepage
 */
export const testSectionOrder = () => {
  console.log('🧪 Testing Homepage Section Order...\n');
  
  const expectedOrder = [
    'Hero',
    'Featured Properties',
    'Latest Properties',
    'Value Proposition'
  ];
  
  const sections = Array.from(document.querySelectorAll('section'));
  const sectionTitles = sections.map(section => {
    const heading = section.querySelector('h1, h2, h3');
    return heading ? heading.textContent.trim() : 'Unknown Section';
  });
  
  console.log('📋 Section order found:');
  sectionTitles.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });
  
  // Check if Latest Properties comes after Featured Properties
  const featuredIndex = sectionTitles.findIndex(title => title.includes('Featured Properties'));
  const latestIndex = sectionTitles.findIndex(title => title.includes('Latest Properties'));
  
  if (featuredIndex !== -1 && latestIndex !== -1) {
    if (latestIndex > featuredIndex) {
      console.log('✅ Latest Properties correctly positioned after Featured Properties');
      return true;
    } else {
      console.log('❌ Latest Properties not in correct position');
      return false;
    }
  } else {
    console.log('❌ Could not find both Featured and Latest Properties sections');
    return false;
  }
};

/**
 * Run all homepage tests
 */
export const runAllHomepageTests = () => {
  console.log('🚀 Running Homepage Enhancement Tests...\n');
  console.log('='.repeat(50));
  
  const results = {
    latestProperties: testLatestProperties(),
    featuredProperties: testFeaturedProperties(),
    propertyCards: testPropertyCards(),
    currencyFormatting: testCurrencyFormatting(),
    responsiveLayout: testResponsiveLayout(),
    sectionOrder: testSectionOrder()
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Homepage enhancements are working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the details above.');
  }
  
  return results;
};

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.homepageTests = {
    testLatestProperties,
    testFeaturedProperties,
    testPropertyCards,
    testCurrencyFormatting,
    testResponsiveLayout,
    testSectionOrder,
    runAllHomepageTests
  };
  
  console.log('🔧 Homepage test utilities loaded!');
  console.log('💡 Run window.homepageTests.runAllHomepageTests() to test the enhancements');
}
