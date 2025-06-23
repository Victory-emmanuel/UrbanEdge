/**
 * JotForm Chatbot Integration Test Utility
 * 
 * This utility provides functions to test the JotForm chatbot integration
 * Run these tests in the browser console to verify the integration
 */

/**
 * Test if JotForm script is properly loaded
 */
export const testScriptLoading = () => {
  console.log('🧪 Testing JotForm Script Loading...\n');
  
  // Check if script element exists
  const scriptElement = document.querySelector('script[src*="cdn.jotfor.ms/agent/embedjs"]');
  
  if (scriptElement) {
    console.log('✅ JotForm script element found in DOM');
    console.log('📍 Script URL:', scriptElement.src);
    
    // Check script attributes
    const isAsync = scriptElement.async;
    console.log('⚡ Async loading:', isAsync ? 'Yes' : 'No');
    
    // Check for configuration parameters
    const url = new URL(scriptElement.src);
    const skipWelcome = url.searchParams.get('skipWelcome');
    const maximizable = url.searchParams.get('maximizable');
    
    console.log('⚙️ Configuration:');
    console.log('  - skipWelcome:', skipWelcome);
    console.log('  - maximizable:', maximizable);
    
    return true;
  } else {
    console.log('❌ JotForm script element not found in DOM');
    return false;
  }
};

/**
 * Test for duplicate scripts
 */
export const testDuplicateScripts = () => {
  console.log('🧪 Testing for Duplicate Scripts...\n');
  
  const scripts = document.querySelectorAll('script[src*="cdn.jotfor.ms/agent/embedjs"]');
  
  if (scripts.length === 1) {
    console.log('✅ Single script instance found (correct)');
    return true;
  } else if (scripts.length === 0) {
    console.log('❌ No JotForm scripts found');
    return false;
  } else {
    console.log(`⚠️ Multiple script instances found: ${scripts.length}`);
    console.log('This could cause conflicts');
    return false;
  }
};

/**
 * Test chatbot widget presence
 */
export const testChatbotWidget = () => {
  console.log('🧪 Testing Chatbot Widget Presence...\n');
  
  // JotForm typically creates elements with specific classes or IDs
  // This is a general check for common JotForm elements
  const possibleSelectors = [
    '[id*="jotform"]',
    '[class*="jotform"]',
    '[id*="agent"]',
    '[class*="agent"]',
    'iframe[src*="jotform"]'
  ];
  
  let widgetFound = false;
  
  possibleSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`✅ Found JotForm elements with selector: ${selector}`);
      console.log(`   Count: ${elements.length}`);
      widgetFound = true;
    }
  });
  
  if (!widgetFound) {
    console.log('⏳ JotForm widget not yet visible (may still be loading)');
    console.log('💡 Try again in a few seconds or interact with the page');
  }
  
  return widgetFound;
};

/**
 * Test page responsiveness with chatbot
 */
export const testResponsiveness = () => {
  console.log('🧪 Testing Page Responsiveness...\n');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`📱 Current viewport: ${viewport.width}x${viewport.height}`);
  
  // Check if page is responsive
  if (viewport.width < 768) {
    console.log('📱 Mobile viewport detected');
  } else if (viewport.width < 1024) {
    console.log('📱 Tablet viewport detected');
  } else {
    console.log('🖥️ Desktop viewport detected');
  }
  
  // Check for any layout issues
  const body = document.body;
  const hasHorizontalScroll = body.scrollWidth > body.clientWidth;
  
  if (hasHorizontalScroll) {
    console.log('⚠️ Horizontal scroll detected - check for layout issues');
  } else {
    console.log('✅ No horizontal scroll - layout looks good');
  }
  
  return !hasHorizontalScroll;
};

/**
 * Run all tests
 */
export const runAllTests = () => {
  console.log('🚀 Running JotForm Chatbot Integration Tests...\n');
  console.log('='.repeat(50));
  
  const results = {
    scriptLoading: testScriptLoading(),
    duplicateScripts: testDuplicateScripts(),
    chatbotWidget: testChatbotWidget(),
    responsiveness: testResponsiveness()
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! JotForm integration is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the details above.');
  }
  
  return results;
};

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.chatbotTests = {
    testScriptLoading,
    testDuplicateScripts,
    testChatbotWidget,
    testResponsiveness,
    runAllTests
  };
  
  console.log('🔧 Chatbot test utilities loaded!');
  console.log('💡 Run window.chatbotTests.runAllTests() to test the integration');
}
