-- Create Property Function
CREATE OR REPLACE FUNCTION create_property(
  title TEXT,
  location TEXT,
  price NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet INTEGER,
  description TEXT,
  floor_plan_url TEXT,
  neighborhood TEXT,
  property_type_id UUID,
  sale_type_id UUID,
  feature_ids UUID[]
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_property_id UUID;
  feature_id UUID;
  result JSONB;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true') THEN
    RAISE EXCEPTION 'Only administrators can create properties';
  END IF;

  -- Insert the new property
  INSERT INTO properties (
    title,
    location,
    price,
    bedrooms,
    bathrooms,
    square_feet,
    description,
    floor_plan_url,
    neighborhood,
    property_type_id,
    sale_type_id
  ) VALUES (
    title,
    location,
    price,
    bedrooms,
    bathrooms,
    square_feet,
    description,
    floor_plan_url,
    neighborhood,
    property_type_id,
    sale_type_id
  ) RETURNING id INTO new_property_id;

  -- Insert property features
  IF feature_ids IS NOT NULL THEN
    FOREACH feature_id IN ARRAY feature_ids
    LOOP
      INSERT INTO property_features (property_id, feature_id)
      VALUES (new_property_id, feature_id);
    END LOOP;
  END IF;

  -- Get the created property with all its details
  SELECT jsonb_build_object(
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
    'property_type_id', p.property_type_id,
    'sale_type_id', p.sale_type_id,
    'created_at', p.created_at,
    'features', COALESCE(
      (SELECT jsonb_agg(f.id)
       FROM property_features pf
       JOIN features f ON pf.feature_id = f.id
       WHERE pf.property_id = p.id),
      '[]'::jsonb
    )
  ) INTO result
  FROM properties p
  WHERE p.id = new_property_id;

  RETURN result;
END;
$$;

-- Update Property Function
CREATE OR REPLACE FUNCTION update_property(
  property_id UUID,
  fields_to_update JSONB,
  feature_ids UUID[] DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  feature_id UUID;
  result JSONB;
  update_query TEXT;
  key TEXT;
  value JSONB;
  comma TEXT := '';
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true') THEN
    RAISE EXCEPTION 'Only administrators can update properties';
  END IF;

  -- Check if property exists
  IF NOT EXISTS (SELECT 1 FROM properties WHERE id = property_id) THEN
    RAISE EXCEPTION 'Property with ID % does not exist', property_id;
  END IF;

  -- Build dynamic update query
  update_query := 'UPDATE properties SET ';
  
  FOR key, value IN SELECT * FROM jsonb_each(fields_to_update)
  LOOP
    update_query := update_query || comma || key || ' = $1->' || quote_literal(key);
    comma := ', ';
  END LOOP;
  
  update_query := update_query || ' WHERE id = $2';
  
  -- Execute the dynamic update
  IF comma != '' THEN -- Only execute if there are fields to update
    EXECUTE update_query USING fields_to_update, property_id;
  END IF;

  -- Update features if provided
  IF feature_ids IS NOT NULL THEN
    -- Delete existing features
    DELETE FROM property_features WHERE property_id = property_id;
    
    -- Insert new features
    FOREACH feature_id IN ARRAY feature_ids
    LOOP
      INSERT INTO property_features (property_id, feature_id)
      VALUES (property_id, feature_id);
    END LOOP;
  END IF;

  -- Get the updated property with all its details
  SELECT jsonb_build_object(
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
    'property_type_id', p.property_type_id,
    'sale_type_id', p.sale_type_id,
    'updated_at', p.updated_at,
    'features', COALESCE(
      (SELECT jsonb_agg(f.id)
       FROM property_features pf
       JOIN features f ON pf.feature_id = f.id
       WHERE pf.property_id = p.id),
      '[]'::jsonb
    )
  ) INTO result
  FROM properties p
  WHERE p.id = property_id;

  RETURN result;
END;
$$;

-- Delete Property Function
CREATE OR REPLACE FUNCTION delete_property(
  property_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true') THEN
    RAISE EXCEPTION 'Only administrators can delete properties';
  END IF;

  -- Check if property exists
  IF NOT EXISTS (SELECT 1 FROM properties WHERE id = property_id) THEN
    RAISE EXCEPTION 'Property with ID % does not exist', property_id;
  END IF;

  -- Store property info for confirmation
  SELECT jsonb_build_object(
    'id', id,
    'title', title,
    'deleted', true
  ) INTO result
  FROM properties
  WHERE id = property_id;

  -- Delete property (will cascade to property_images and property_features due to foreign key constraints)
  DELETE FROM properties WHERE id = property_id;

  RETURN result;
END;
$$;

-- Add Property Image Function
CREATE OR REPLACE FUNCTION add_property_image(
  property_id UUID,
  image_url TEXT,
  image_order INTEGER DEFAULT 0
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_image_id UUID;
  result JSONB;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true') THEN
    RAISE EXCEPTION 'Only administrators can add property images';
  END IF;

  -- Check if property exists
  IF NOT EXISTS (SELECT 1 FROM properties WHERE id = property_id) THEN
    RAISE EXCEPTION 'Property with ID % does not exist', property_id;
  END IF;

  -- Insert the new image
  INSERT INTO property_images (property_id, image_url, "order")
  VALUES (property_id, image_url, image_order)
  RETURNING id INTO new_image_id;

  -- Get the created image details
  SELECT jsonb_build_object(
    'id', id,
    'property_id', property_id,
    'image_url', image_url,
    'order', "order",
    'created_at', created_at
  ) INTO result
  FROM property_images
  WHERE id = new_image_id;

  RETURN result;
END;
$$;

-- Delete Property Image Function
CREATE OR REPLACE FUNCTION delete_property_image(
  image_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true') THEN
    RAISE EXCEPTION 'Only administrators can delete property images';
  END IF;

  -- Check if image exists
  IF NOT EXISTS (SELECT 1 FROM property_images WHERE id = image_id) THEN
    RAISE EXCEPTION 'Property image with ID % does not exist', image_id;
  END IF;

  -- Store image info for confirmation
  SELECT jsonb_build_object(
    'id', id,
    'property_id', property_id,
    'deleted', true
  ) INTO result
  FROM property_images
  WHERE id = image_id;

  -- Delete the image
  DELETE FROM property_images WHERE id = image_id;

  RETURN result;
END;
$$;