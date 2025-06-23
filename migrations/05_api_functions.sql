-- API Functions for Admin Operations

-- Create Property Function
CREATE OR REPLACE FUNCTION create_property(
  title TEXT,
  location TEXT,
  price NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet INTEGER,
  description TEXT DEFAULT NULL,
  floor_plan_url TEXT DEFAULT NULL,
  neighborhood TEXT DEFAULT NULL,
  property_type_id UUID,
  sale_type_id UUID,
  feature_ids UUID[] DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_property_id UUID;
  result JSONB;
  is_admin BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND is_admin = true
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can create properties';
  END IF;

  -- Insert the property
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
  
  -- Insert property features if provided
  IF feature_ids IS NOT NULL AND array_length(feature_ids, 1) > 0 THEN
    INSERT INTO property_features (property_id, feature_id)
    SELECT new_property_id, unnest(feature_ids);
  END IF;
  
  -- Return the created property
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
    'created_at', p.created_at
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
  result JSONB;
  is_admin BOOLEAN;
  update_query TEXT;
  field_name TEXT;
  field_value JSONB;
  property_exists BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND is_admin = true
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can update properties';
  END IF;
  
  -- Check if property exists
  SELECT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id
  ) INTO property_exists;
  
  IF NOT property_exists THEN
    RAISE EXCEPTION 'Property with ID % does not exist', property_id;
  END IF;
  
  -- Build dynamic update query
  update_query := 'UPDATE properties SET ';
  
  -- Process each field in the JSONB object
  FOR field_name, field_value IN SELECT * FROM jsonb_each(fields_to_update)
  LOOP
    -- Add field to update query
    update_query := update_query || format('%I = %L, ', field_name, field_value);
  END LOOP;
  
  -- Remove trailing comma and space
  update_query := substring(update_query, 1, length(update_query) - 2);
  
  -- Add WHERE clause
  update_query := update_query || format(' WHERE id = %L', property_id);
  
  -- Execute the update query
  EXECUTE update_query;
  
  -- Update features if provided
  IF feature_ids IS NOT NULL THEN
    -- Delete existing features
    DELETE FROM property_features WHERE property_id = property_id;
    
    -- Insert new features
    IF array_length(feature_ids, 1) > 0 THEN
      INSERT INTO property_features (property_id, feature_id)
      SELECT property_id, unnest(feature_ids);
    END IF;
  END IF;
  
  -- Return the updated property
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
    'updated_at', p.updated_at
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
  is_admin BOOLEAN;
  property_exists BOOLEAN;
  property_title TEXT;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND is_admin = true
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can delete properties';
  END IF;
  
  -- Check if property exists and get title
  SELECT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id
  ), 
  (SELECT title FROM properties WHERE id = property_id)
  INTO property_exists, property_title;
  
  IF NOT property_exists THEN
    RAISE EXCEPTION 'Property with ID % does not exist', property_id;
  END IF;
  
  -- Delete property (will cascade to property_images and property_features)
  DELETE FROM properties WHERE id = property_id;
  
  -- Return confirmation
  RETURN jsonb_build_object(
    'success', true,
    'message', format('Property "%s" deleted successfully', property_title),
    'deleted_id', property_id
  );
END;
$$;

-- Add Property Image Function
CREATE OR REPLACE FUNCTION add_property_image(
  property_id UUID,
  image_url TEXT,
  image_order INTEGER DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_image_id UUID;
  is_admin BOOLEAN;
  property_exists BOOLEAN;
  next_order INTEGER;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND is_admin = true
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can add property images';
  END IF;
  
  -- Check if property exists
  SELECT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id
  ) INTO property_exists;
  
  IF NOT property_exists THEN
    RAISE EXCEPTION 'Property with ID % does not exist', property_id;
  END IF;
  
  -- Determine order if not provided
  IF image_order IS NULL THEN
    SELECT COALESCE(MAX("order") + 1, 0)
    FROM property_images
    WHERE property_id = property_id
    INTO next_order;
  ELSE
    next_order := image_order;
  END IF;
  
  -- Insert the image
  INSERT INTO property_images (property_id, image_url, "order")
  VALUES (property_id, image_url, next_order)
  RETURNING id INTO new_image_id;
  
  -- Return the created image
  RETURN jsonb_build_object(
    'id', new_image_id,
    'property_id', property_id,
    'image_url', image_url,
    'order', next_order
  );
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
  is_admin BOOLEAN;
  image_exists BOOLEAN;
  property_id UUID;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND is_admin = true
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can delete property images';
  END IF;
  
  -- Check if image exists and get property_id
  SELECT EXISTS (
    SELECT 1 FROM property_images 
    WHERE id = image_id
  ),
  (SELECT property_id FROM property_images WHERE id = image_id)
  INTO image_exists, property_id;
  
  IF NOT image_exists THEN
    RAISE EXCEPTION 'Image with ID % does not exist', image_id;
  END IF;
  
  -- Delete the image
  DELETE FROM property_images WHERE id = image_id;
  
  -- Return confirmation
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Property image deleted successfully',
    'deleted_id', image_id,
    'property_id', property_id
  );
END;
$$;