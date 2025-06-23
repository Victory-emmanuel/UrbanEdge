-- Enable Row Level Security (RLS) on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;

-- Admin-Only Modifications for properties
CREATE POLICY "admin_can_modify_properties"
  ON properties
  FOR ALL
  USING (auth.uid() = ANY (
    SELECT id FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true'
  ));

-- Admin-Only Modifications for property_images
CREATE POLICY "admin_can_modify_property_images"
  ON property_images
  FOR ALL
  USING (auth.uid() = ANY (
    SELECT id FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true'
  ));

-- Admin-Only Modifications for property_features
CREATE POLICY "admin_can_modify_property_features"
  ON property_features
  FOR ALL
  USING (auth.uid() = ANY (
    SELECT id FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true'
  ));

-- Lookup Tables (Read-Only to Everyone)
-- Property Types
CREATE POLICY "public_can_select_property_types"
  ON property_types
  FOR SELECT
  USING (true);

-- Sale Types
CREATE POLICY "public_can_select_sale_types"
  ON sale_types
  FOR SELECT
  USING (true);

-- Features
CREATE POLICY "public_can_select_features"
  ON features
  FOR SELECT
  USING (true);

-- Property Read Access for authenticated users
CREATE POLICY "authenticated_can_select_properties"
  ON properties
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Property Images Read Access for authenticated users
CREATE POLICY "authenticated_can_select_property_images"
  ON property_images
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Property Features Read Access for authenticated users
CREATE POLICY "authenticated_can_select_property_features"
  ON property_features
  FOR SELECT
  USING (auth.role() = 'authenticated');