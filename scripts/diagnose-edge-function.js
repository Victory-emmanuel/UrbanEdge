#!/usr/bin/env node

/**
 * Diagnostic script to test the send-property-inquiry Edge Function
 * This script will help identify CORS and deployment issues
 */

// Use built-in fetch in Node.js 18+

const EDGE_FUNCTION_URL =
  "https://ityjoygbvbcvnxcwoqve.supabase.co/functions/v1/send-property-inquiry";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY || "your-anon-key-here";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testOptionsRequest() {
  log("\n🔍 Testing OPTIONS (preflight) request...", "blue");

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization, content-type",
      },
    });

    log(
      `Status: ${response.status} ${response.statusText}`,
      response.ok ? "green" : "red"
    );

    // Check CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": response.headers.get(
        "access-control-allow-origin"
      ),
      "Access-Control-Allow-Methods": response.headers.get(
        "access-control-allow-methods"
      ),
      "Access-Control-Allow-Headers": response.headers.get(
        "access-control-allow-headers"
      ),
      "Access-Control-Max-Age": response.headers.get("access-control-max-age"),
    };

    log("CORS Headers:", "yellow");
    Object.entries(corsHeaders).forEach(([key, value]) => {
      log(`  ${key}: ${value || "NOT SET"}`, value ? "green" : "red");
    });

    return response.ok;
  } catch (error) {
    log(`❌ OPTIONS request failed: ${error.message}`, "red");
    return false;
  }
}

async function testPostRequest() {
  log("\n🔍 Testing POST request...", "blue");

  const testData = {
    propertyId: "test-property-id",
    inquiryType: "contact",
    clientName: "Test User",
    clientEmail: "test@example.com",
    message: "This is a test inquiry from the diagnostic script",
  };

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Origin: "http://localhost:5173",
      },
      body: JSON.stringify(testData),
    });

    log(
      `Status: ${response.status} ${response.statusText}`,
      response.ok ? "green" : "red"
    );

    const responseText = await response.text();
    log("Response body:", "yellow");
    log(responseText, response.ok ? "green" : "red");

    return response.ok;
  } catch (error) {
    log(`❌ POST request failed: ${error.message}`, "red");
    return false;
  }
}

async function testFunctionAvailability() {
  log("\n🔍 Testing function availability...", "blue");

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "GET",
      headers: {
        Origin: "http://localhost:5173",
      },
    });

    log(`Status: ${response.status} ${response.statusText}`, "yellow");

    if (response.status === 405) {
      log(
        "✅ Function is deployed (returns 405 Method Not Allowed for GET)",
        "green"
      );
      return true;
    } else if (response.status === 404) {
      log("❌ Function not found (404) - may not be deployed", "red");
      return false;
    } else {
      log("⚠️  Unexpected response for GET request", "yellow");
      return true; // Function exists but behaves differently
    }
  } catch (error) {
    log(`❌ Function availability test failed: ${error.message}`, "red");
    return false;
  }
}

async function main() {
  log("🚀 UrbanEdge Edge Function Diagnostic Tool", "bold");
  log("=".repeat(50), "blue");

  log(`Testing Edge Function: ${EDGE_FUNCTION_URL}`, "blue");
  log(`Using Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`, "blue");

  const results = {
    availability: await testFunctionAvailability(),
    options: await testOptionsRequest(),
    post: await testPostRequest(),
  };

  log("\n📊 Diagnostic Results:", "bold");
  log("=".repeat(30), "blue");

  Object.entries(results).forEach(([test, passed]) => {
    log(
      `${test.toUpperCase()}: ${passed ? "✅ PASS" : "❌ FAIL"}`,
      passed ? "green" : "red"
    );
  });

  if (results.availability && results.options && results.post) {
    log(
      "\n🎉 All tests passed! The Edge Function is working correctly.",
      "green"
    );
  } else {
    log(
      "\n⚠️  Some tests failed. Check the output above for details.",
      "yellow"
    );

    if (!results.availability) {
      log("\n💡 Suggested fixes:", "yellow");
      log("1. Redeploy the Edge Function", "yellow");
      log("2. Check Supabase project status", "yellow");
      log("3. Verify the function URL is correct", "yellow");
    }

    if (!results.options) {
      log("\n💡 CORS issue detected:", "yellow");
      log("1. Check Edge Function CORS configuration", "yellow");
      log("2. Ensure OPTIONS method is handled correctly", "yellow");
      log("3. Verify CORS headers are set properly", "yellow");
    }
  }
}

// Run the diagnostic
main().catch((error) => {
  log(`\n💥 Diagnostic script failed: ${error.message}`, "red");
  process.exit(1);
});
