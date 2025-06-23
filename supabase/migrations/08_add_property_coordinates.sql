-- Add latitude and longitude columns to properties table for map functionality

-- Add coordinate columns to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for spatial queries (optional but recommended for performance)
CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties(latitude, longitude);

-- Add some sample coordinates for existing properties (you can update these with real coordinates)
-- These are sample coordinates for major cities - replace with actual property locations

-- Update existing properties with sample coordinates
-- Note: In a real application, you would geocode the actual addresses
UPDATE properties 
SET 
  latitude = CASE 
    WHEN location ILIKE '%new york%' OR location ILIKE '%ny%' THEN 40.7128 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%los angeles%' OR location ILIKE '%la%' OR location ILIKE '%california%' THEN 34.0522 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%chicago%' OR location ILIKE '%illinois%' THEN 41.8781 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%houston%' OR location ILIKE '%texas%' THEN 29.7604 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%phoenix%' OR location ILIKE '%arizona%' THEN 33.4484 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%philadelphia%' OR location ILIKE '%pennsylvania%' THEN 39.9526 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%san antonio%' THEN 29.4241 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%san diego%' THEN 32.7157 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%dallas%' THEN 32.7767 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%san jose%' THEN 37.3382 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%austin%' THEN 30.2672 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%jacksonville%' OR location ILIKE '%florida%' THEN 30.3322 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%fort worth%' THEN 32.7555 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%columbus%' OR location ILIKE '%ohio%' THEN 39.9612 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%charlotte%' OR location ILIKE '%north carolina%' THEN 35.2271 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%san francisco%' THEN 37.7749 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%indianapolis%' OR location ILIKE '%indiana%' THEN 39.7684 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%seattle%' OR location ILIKE '%washington%' THEN 47.6062 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%denver%' OR location ILIKE '%colorado%' THEN 39.7392 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%boston%' OR location ILIKE '%massachusetts%' THEN 42.3601 + (RANDOM() - 0.5) * 0.1
    ELSE 40.7128 + (RANDOM() - 0.5) * 0.1 -- Default to NYC area
  END,
  longitude = CASE 
    WHEN location ILIKE '%new york%' OR location ILIKE '%ny%' THEN -74.0060 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%los angeles%' OR location ILIKE '%la%' OR location ILIKE '%california%' THEN -118.2437 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%chicago%' OR location ILIKE '%illinois%' THEN -87.6298 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%houston%' OR location ILIKE '%texas%' THEN -95.3698 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%phoenix%' OR location ILIKE '%arizona%' THEN -112.0740 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%philadelphia%' OR location ILIKE '%pennsylvania%' THEN -75.1652 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%san antonio%' THEN -98.4936 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%san diego%' THEN -117.1611 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%dallas%' THEN -96.7970 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%san jose%' THEN -121.8863 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%austin%' THEN -97.7431 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%jacksonville%' OR location ILIKE '%florida%' THEN -81.6557 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%fort worth%' THEN -97.3308 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%columbus%' OR location ILIKE '%ohio%' THEN -82.9988 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%charlotte%' OR location ILIKE '%north carolina%' THEN -80.8431 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%san francisco%' THEN -122.4194 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%indianapolis%' OR location ILIKE '%indiana%' THEN -86.1581 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%seattle%' OR location ILIKE '%washington%' THEN -122.3321 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%denver%' OR location ILIKE '%colorado%' THEN -104.9903 + (RANDOM() - 0.5) * 0.1
    WHEN location ILIKE '%boston%' OR location ILIKE '%massachusetts%' THEN -71.0589 + (RANDOM() - 0.5) * 0.1
    ELSE -74.0060 + (RANDOM() - 0.5) * 0.1 -- Default to NYC area
  END
WHERE latitude IS NULL OR longitude IS NULL;

-- Add comment to document the new columns
COMMENT ON COLUMN properties.latitude IS 'Property latitude coordinate for map display';
COMMENT ON COLUMN properties.longitude IS 'Property longitude coordinate for map display';
