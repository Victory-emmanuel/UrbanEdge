-- Add agent contact information fields to properties table

-- Add agent contact columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS agent_name TEXT NOT NULL DEFAULT 'UrbanEdge Agent',
ADD COLUMN IF NOT EXISTS agent_email TEXT NOT NULL DEFAULT 'contact@urbanedge.com',
ADD COLUMN IF NOT EXISTS agent_phone TEXT,
ADD COLUMN IF NOT EXISTS agent_whatsapp_link TEXT;

-- Note: Database-level validation constraints removed to avoid regex compatibility issues
-- Client-side validation in the React form provides better user experience and error handling

-- Create index for agent email for potential future queries
CREATE INDEX IF NOT EXISTS idx_properties_agent_email ON properties(agent_email);

-- Update existing properties with default agent information
-- This ensures existing properties have valid agent data
UPDATE properties
SET
  agent_name = 'UrbanEdge Agent',
  agent_email = 'contact@urbanedge.com'
WHERE agent_name IS NULL OR agent_email IS NULL;
