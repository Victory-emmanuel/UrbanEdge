-- Create favorites system for user-property relationships

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, property_id) -- Prevent duplicate favorites
);

-- Enable RLS on user_favorites table
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites table
-- Users can only see and manage their own favorites
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" ON user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" ON user_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all favorites for management purposes
CREATE POLICY "Admins can view all favorites" ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at);

-- Function to add a property to favorites
CREATE OR REPLACE FUNCTION add_to_favorites(property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to add favorites';
  END IF;

  -- Check if property exists
  IF NOT EXISTS (SELECT 1 FROM properties WHERE id = property_id) THEN
    RAISE EXCEPTION 'Property not found';
  END IF;

  -- Insert favorite (will fail if already exists due to unique constraint)
  INSERT INTO user_favorites (user_id, property_id)
  VALUES (auth.uid(), property_id)
  ON CONFLICT (user_id, property_id) DO NOTHING;

  -- Return success response
  SELECT jsonb_build_object(
    'success', true,
    'message', 'Property added to favorites',
    'property_id', property_id,
    'user_id', auth.uid()
  ) INTO result;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;

-- Function to remove a property from favorites
CREATE OR REPLACE FUNCTION remove_from_favorites(property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  deleted_count INTEGER;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to remove favorites';
  END IF;

  -- Delete the favorite
  DELETE FROM user_favorites 
  WHERE user_id = auth.uid() AND property_id = remove_from_favorites.property_id;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- Return success response
  SELECT jsonb_build_object(
    'success', true,
    'message', CASE 
      WHEN deleted_count > 0 THEN 'Property removed from favorites'
      ELSE 'Property was not in favorites'
    END,
    'property_id', property_id,
    'user_id', auth.uid(),
    'deleted_count', deleted_count
  ) INTO result;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;

-- Function to get user's favorite properties with full property details
CREATE OR REPLACE FUNCTION get_user_favorites()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to view favorites';
  END IF;

  -- Get user's favorite properties with full details
  SELECT jsonb_build_object(
    'success', true,
    'data', COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'title', p.title,
          'location', p.location,
          'price', p.price,
          'bedrooms', p.bedrooms,
          'bathrooms', p.bathrooms,
          'square_feet', p.square_feet,
          'description', p.description,
          'floor_plan_url', p.floor_plan_url,
          'neighborhood', p.neighborhood,
          'latitude', p.latitude,
          'longitude', p.longitude,
          'property_type', pt.name,
          'sale_type', st.name,
          'created_at', p.created_at,
          'favorited_at', uf.created_at,
          'images', COALESCE(
            (SELECT jsonb_agg(
              jsonb_build_object(
                'id', pi.id,
                'image_url', pi.image_url,
                'order', pi."order"
              ) ORDER BY pi."order"
            ) FROM property_images pi WHERE pi.property_id = p.id),
            '[]'::jsonb
          ),
          'features', COALESCE(
            (SELECT jsonb_agg(
              jsonb_build_object(
                'id', f.id,
                'name', f.name
              )
            ) FROM property_features pf 
            JOIN features f ON f.id = pf.feature_id 
            WHERE pf.property_id = p.id),
            '[]'::jsonb
          )
        ) ORDER BY uf.created_at DESC
      ),
      '[]'::jsonb
    )
  )
  FROM user_favorites uf
  JOIN properties p ON p.id = uf.property_id
  JOIN property_types pt ON pt.id = p.property_type_id
  JOIN sale_types st ON st.id = p.sale_type_id
  WHERE uf.user_id = auth.uid()
  INTO result;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM,
      'data', '[]'::jsonb
    );
END;
$$;

-- Function to check if a property is favorited by the current user
CREATE OR REPLACE FUNCTION is_property_favorited(property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_favorited BOOLEAN;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'is_favorited', false,
      'message', 'User not authenticated'
    );
  END IF;

  -- Check if property is in user's favorites
  SELECT EXISTS (
    SELECT 1 FROM user_favorites 
    WHERE user_id = auth.uid() AND property_id = is_property_favorited.property_id
  ) INTO is_favorited;

  RETURN jsonb_build_object(
    'success', true,
    'is_favorited', is_favorited,
    'property_id', property_id,
    'user_id', auth.uid()
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM,
      'is_favorited', false
    );
END;
$$;
