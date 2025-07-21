#!/usr/bin/env node

/**
 * Deploy Edge Function using Supabase Management API
 * This script deploys the send-property-inquiry function without requiring the CLI
 */

import fs from 'fs';
import path from 'path';

const PROJECT_REF = 'ityjoygbvbcvnxcwoqve';
const MANAGEMENT_API_BASE = 'https://api.supabase.com/v1';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function readFunctionFiles() {
  const functionDir = 'supabase/functions/send-property-inquiry';
  
  try {
    const files = {
      'index.ts': fs.readFileSync(path.join(functionDir, 'index.ts'), 'utf8'),
      'email-templates.ts': fs.readFileSync(path.join(functionDir, 'email-templates.ts'), 'utf8'),
      'security.ts': fs.readFileSync(path.join(functionDir, 'security.ts'), 'utf8')
    };
    
    log('✅ Successfully read all function files', 'green');
    return files;
  } catch (error) {
    log(`❌ Failed to read function files: ${error.message}`, 'red');
    return null;
  }
}

async function deployFunction(files) {
  log('🚀 Deploying function via Management API...', 'blue');
  
  // Note: The Management API doesn't currently support direct function deployment
  // This is a placeholder for when that functionality becomes available
  // For now, we'll provide instructions for manual deployment
  
  log('⚠️  Direct API deployment not yet available', 'yellow');
  log('Please use one of these methods:', 'yellow');
  log('', 'reset');
  log('Method 1: Install Supabase CLI manually', 'blue');
  log('1. Download from: https://github.com/supabase/cli/releases', 'reset');
  log('2. Extract and add to PATH', 'reset');
  log('3. Run: supabase functions deploy send-property-inquiry --project-ref ityjoygbvbcvnxcwoqve', 'reset');
  log('', 'reset');
  log('Method 2: Use Supabase Dashboard', 'blue');
  log('1. Go to: https://supabase.com/dashboard/project/ityjoygbvbcvnxcwoqve/functions', 'reset');
  log('2. Create new function named "send-property-inquiry"', 'reset');
  log('3. Copy the code from the files in supabase/functions/send-property-inquiry/', 'reset');
  log('', 'reset');
  log('Method 3: Use GitHub Actions (recommended for production)', 'blue');
  log('1. Set up GitHub Actions with Supabase deployment', 'reset');
  log('2. Push code to trigger automatic deployment', 'reset');
  
  return false;
}

async function testDeployment() {
  log('🔍 Testing function deployment...', 'blue');
  
  const testUrl = `https://${PROJECT_REF}.supabase.co/functions/v1/send-property-inquiry`;
  
  try {
    const response = await fetch(testUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST'
      }
    });
    
    if (response.status === 200) {
      log('✅ Function is deployed and responding!', 'green');
      return true;
    } else if (response.status === 404) {
      log('❌ Function not found - deployment needed', 'red');
      return false;
    } else {
      log(`⚠️  Unexpected response: ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🏗️  UrbanEdge Edge Function Deployment Tool', 'bold');
  log('=' * 50, 'blue');
  
  // Check if function is already deployed
  const isDeployed = await testDeployment();
  
  if (isDeployed) {
    log('✅ Function is already deployed and working!', 'green');
    log('No deployment needed.', 'green');
    return;
  }
  
  // Read function files
  const files = await readFunctionFiles();
  if (!files) {
    process.exit(1);
  }
  
  // Attempt deployment
  const deployed = await deployFunction(files);
  
  if (!deployed) {
    log('', 'reset');
    log('📋 Quick Manual Deployment Steps:', 'bold');
    log('1. Install Supabase CLI: npm install -g supabase', 'yellow');
    log('2. Login: supabase login', 'yellow');
    log('3. Deploy: supabase functions deploy send-property-inquiry --project-ref ityjoygbvbcvnxcwoqve', 'yellow');
    log('', 'reset');
    log('After deployment, run this script again to test.', 'blue');
  }
}

// Run the deployment tool
main().catch(error => {
  log(`💥 Deployment tool failed: ${error.message}`, 'red');
  process.exit(1);
});
