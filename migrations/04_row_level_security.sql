-- Enable Row Level Security on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;

-- Admin-Only Modification Policies

-- Properties table: Only admins can modify
CREATE POLICY "admin_can_modify_properties"
  ON properties
  FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Property Images table: Only admins can modify
CREATE POLICY "admin_can_modify_property_images"
  ON property_images
  FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Property Features table: Only admins can modify
CREATE POLICY "admin_can_modify_property_features"
  ON property_features
  FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Lookup Tables (Read-Only to Everyone)

-- Property Types: Everyone can read
CREATE POLICY "public_can_select_property_types"
  ON property_types
  FOR SELECT
  USING (true);

-- Sale Types: Everyone can read
CREATE POLICY "public_can_select_sale_types"
  ON sale_types
  FOR SELECT
  USING (true);

-- Features: Everyone can read
CREATE POLICY "public_can_select_features"
  ON features
  FOR SELECT
  USING (true);

-- Property Read Access

-- Properties: Authenticated users can read
CREATE POLICY "authenticated_can_select_properties"
  ON properties
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Property Images: Authenticated users can read
CREATE POLICY "authenticated_can_select_property_images"
  ON property_images
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Property Features: Authenticated users can read
CREATE POLICY "authenticated_can_select_property_features"
  ON property_features
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin-Only Modification for Lookup Tables

-- Property Types: Only admins can modify
CREATE POLICY "admin_can_modify_property_types"
  ON property_types
  FOR INSERT UPDATE DELETE
  USING (auth.uid() IN (
    SELECT id FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Sale Types: Only admins can modify
CREATE POLICY "admin_can_modify_sale_types"
  ON sale_types
  FOR INSERT UPDATE DELETE
  USING (auth.uid() IN (
    SELECT id FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Features: Only admins can modify
CREATE POLICY "admin_can_modify_features"
  ON features
  FOR INSERT UPDATE DELETE
  USING (auth.uid() IN (
    SELECT id FROM users WHERE id = auth.uid() AND is_admin = true
  ));