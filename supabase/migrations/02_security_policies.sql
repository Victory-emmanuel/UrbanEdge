-- Enable Row Level Security (RLS) on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;

-- Create policies for properties table
-- Admin users can do everything
CREATE POLICY "Admins can do everything on properties" ON properties
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');

-- All users (including anonymous) can view properties
CREATE POLICY "Everyone can view properties" ON properties
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for property_images table
-- Admin users can do everything
CREATE POLICY "Admins can do everything on property_images" ON property_images
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');

-- All users (including anonymous) can view property images
CREATE POLICY "Everyone can view property images" ON property_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for property_types table
-- Admin users can do everything
CREATE POLICY "Admins can do everything on property_types" ON property_types
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');

-- All users (including anonymous) can view property types
CREATE POLICY "Everyone can view property types" ON property_types
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for sale_types table
-- Admin users can do everything
CREATE POLICY "Admins can do everything on sale_types" ON sale_types
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');

-- All users (including anonymous) can view sale types
CREATE POLICY "Everyone can view sale types" ON sale_types
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for features table
-- Admin users can do everything
CREATE POLICY "Admins can do everything on features" ON features
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');

-- All users (including anonymous) can view features
CREATE POLICY "Everyone can view features" ON features
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for property_features table
-- Admin users can do everything
CREATE POLICY "Admins can do everything on property_features" ON property_features
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');

-- All users (including anonymous) can view property features
CREATE POLICY "Everyone can view property features" ON property_features
  FOR SELECT
  TO anon, authenticated
  USING (true);