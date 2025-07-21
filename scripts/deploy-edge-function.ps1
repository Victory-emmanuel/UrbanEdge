# PowerShell script to deploy the send-property-inquiry Edge Function
# This script handles deployment even if Supabase CLI is not in PATH

param(
    [string]$ProjectRef = "ityjoygbvbcvnxcwoqve",
    [switch]$Force = $false,
    [switch]$Verbose = $false
)

# Colors for output
$Colors = @{
    Green = "Green"
    Red = "Red"
    Yellow = "Yellow"
    Blue = "Blue"
    Cyan = "Cyan"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-SupabaseCLI {
    try {
        $null = Get-Command supabase -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Install-SupabaseCLI {
    Write-ColorOutput "Supabase CLI not found. Installing..." $Colors.Yellow
    
    try {
        # Check if npm is available
        $null = Get-Command npm -ErrorAction Stop
        
        Write-ColorOutput "Installing Supabase CLI via npm..." $Colors.Blue
        npm install -g supabase
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Supabase CLI installed successfully!" $Colors.Green
            return $true
        } else {
            throw "npm install failed"
        }
    }
    catch {
        Write-ColorOutput "Failed to install Supabase CLI via npm" $Colors.Red
        Write-ColorOutput "Please install manually: https://supabase.com/docs/guides/cli" $Colors.Yellow
        return $false
    }
}

function Test-EdgeFunctionFiles {
    $requiredFiles = @(
        "supabase/functions/send-property-inquiry/index.ts",
        "supabase/functions/send-property-inquiry/email-templates.ts",
        "supabase/functions/send-property-inquiry/security.ts"
    )
    
    $missingFiles = @()
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            $missingFiles += $file
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-ColorOutput "Missing required files:" $Colors.Red
        foreach ($file in $missingFiles) {
            Write-ColorOutput "  - $file" $Colors.Red
        }
        return $false
    }

    Write-ColorOutput "All required Edge Function files found" $Colors.Green
    return $true
}

function Deploy-EdgeFunction {
    Write-ColorOutput "Deploying send-property-inquiry Edge Function..." $Colors.Blue
    
    try {
        if ($Verbose) {
            supabase functions deploy send-property-inquiry --project-ref $ProjectRef --debug
        } else {
            supabase functions deploy send-property-inquiry --project-ref $ProjectRef
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Edge Function deployed successfully!" $Colors.Green
            return $true
        } else {
            throw "Deployment failed with exit code $LASTEXITCODE"
        }
    }
    catch {
        Write-ColorOutput "Failed to deploy Edge Function: $($_.Exception.Message)" $Colors.Red
        return $false
    }
}

function Test-EdgeFunctionDeployment {
    Write-ColorOutput "Testing Edge Function deployment..." $Colors.Blue
    
    $testUrl = "https://$ProjectRef.supabase.co/functions/v1/send-property-inquiry"
    
    try {
        # Test OPTIONS request (CORS preflight)
        $optionsResponse = Invoke-WebRequest -Uri $testUrl -Method Options -Headers @{
            "Origin" = "http://localhost:5173"
            "Access-Control-Request-Method" = "POST"
            "Access-Control-Request-Headers" = "authorization, content-type"
        } -UseBasicParsing -ErrorAction Stop
        
        if ($optionsResponse.StatusCode -eq 200) {
            Write-ColorOutput "OPTIONS request successful (CORS working)" $Colors.Green

            # Check CORS headers
            $corsHeaders = @(
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Methods",
                "Access-Control-Allow-Headers"
            )

            foreach ($header in $corsHeaders) {
                if ($optionsResponse.Headers[$header]) {
                    Write-ColorOutput "  $header`: $($optionsResponse.Headers[$header])" $Colors.Green
                } else {
                    Write-ColorOutput "  $header`: Not set" $Colors.Yellow
                }
            }
            
            return $true
        } else {
            Write-ColorOutput "OPTIONS request failed with status: $($optionsResponse.StatusCode)" $Colors.Red
            return $false
        }
    }
    catch {
        Write-ColorOutput "Failed to test Edge Function: $($_.Exception.Message)" $Colors.Red
        return $false
    }
}

# Main execution
Write-ColorOutput "UrbanEdge Edge Function Deployment Script" $Colors.Cyan
Write-ColorOutput ("=" * 50) $Colors.Blue

# Check if we're in the right directory
if (-not (Test-Path "supabase/functions")) {
    Write-ColorOutput "Not in project root directory. Please run from UrbanEdge-3 folder." $Colors.Red
    exit 1
}

# Check required files
if (-not (Test-EdgeFunctionFiles)) {
    exit 1
}

# Check Supabase CLI
if (-not (Test-SupabaseCLI)) {
    if (-not (Install-SupabaseCLI)) {
        exit 1
    }
}

# Deploy the function
if (Deploy-EdgeFunction) {
    # Test the deployment
    Start-Sleep -Seconds 5  # Wait for deployment to propagate
    Test-EdgeFunctionDeployment

    Write-ColorOutput "`nDeployment completed!" $Colors.Green
    Write-ColorOutput "Edge Function URL: https://$ProjectRef.supabase.co/functions/v1/send-property-inquiry" $Colors.Blue
    Write-ColorOutput "`nNext steps:" $Colors.Yellow
    Write-ColorOutput "1. Test the contact form on your website" $Colors.Yellow
    Write-ColorOutput "2. Check browser console for any remaining errors" $Colors.Yellow
    Write-ColorOutput "3. Monitor function logs: supabase functions logs send-property-inquiry --follow" $Colors.Yellow
} else {
    Write-ColorOutput "`nDeployment failed. Please check the errors above." $Colors.Red
    exit 1
}
