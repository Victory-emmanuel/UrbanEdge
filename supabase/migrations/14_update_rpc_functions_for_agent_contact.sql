-- Update RPC functions to handle agent contact information

-- Update create_property function to include agent contact fields
CREATE OR REPLACE FUNCTION create_property(
  p_title TEXT,
  p_location TEXT,
  p_price NUMERIC,
  p_bedrooms INTEGER,
  p_bathrooms INTEGER,
  p_square_feet INTEGER,
  p_property_type_id UUID,
  p_sale_type_id UUID,
  p_description TEXT DEFAULT NULL,
  p_floor_plan_url TEXT DEFAULT NULL,
  p_neighborhood TEXT DEFAULT NULL,
  p_latitude DECIMAL(10, 8) DEFAULT NULL,
  p_longitude DECIMAL(11, 8) DEFAULT NULL,
  p_agent_name TEXT DEFAULT 'UrbanEdge Agent',
  p_agent_email TEXT DEFAULT 'contact@urbanedge.com',
  p_agent_phone TEXT DEFAULT '(555) 123-4567',
  p_agent_whatsapp_link TEXT DEFAULT NULL,
  p_feature_ids UUID[] DEFAULT NULL
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

  -- Insert the new property with agent contact information
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
    sale_type_id,
    latitude,
    longitude,
    agent_name,
    agent_email,
    agent_phone,
    agent_whatsapp_link
  ) VALUES (
    p_title,
    p_location,
    p_price,
    p_bedrooms,
    p_bathrooms,
    p_square_feet,
    p_description,
    p_floor_plan_url,
    p_neighborhood,
    p_property_type_id,
    p_sale_type_id,
    p_latitude,
    p_longitude,
    p_agent_name,
    p_agent_email,
    p_agent_phone,
    p_agent_whatsapp_link
  ) RETURNING id INTO new_property_id;

  -- Insert property features
  IF p_feature_ids IS NOT NULL THEN
    FOREACH feature_id IN ARRAY p_feature_ids
    LOOP
      INSERT INTO property_features (property_id, feature_id)
      VALUES (new_property_id, feature_id);
    END LOOP;
  END IF;

  -- Get the created property with all its details including agent info
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
    'latitude', p.latitude,
    'longitude', p.longitude,
    'property_type_id', p.property_type_id,
    'sale_type_id', p.sale_type_id,
    'agent_name', p.agent_name,
    'agent_email', p.agent_email,
    'agent_phone', p.agent_phone,
    'agent_whatsapp_link', p.agent_whatsapp_link,
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

-- Update get_property_details function to include agent contact information
CREATE OR REPLACE FUNCTION get_property_details(property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER -- Uses the permissions of the calling user
AS $$
DECLARE
  property_details JSONB;
  property_images JSONB;
  property_features JSONB;
  prop_id UUID := property_id; -- Use local variable to avoid ambiguity
BEGIN
  -- Get basic property information with coordinates and agent contact info
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
    'latitude', p.latitude,
    'longitude', p.longitude,
    'agent_name', p.agent_name,
    'agent_email', p.agent_email,
    'agent_phone', p.agent_phone,
    'agent_whatsapp_link', p.agent_whatsapp_link,
    'property_type', jsonb_build_object('id', pt.id, 'name', pt.name),
    'sale_type', jsonb_build_object('id', st.id, 'name', st.name),
    'created_at', p.created_at,
    'updated_at', p.updated_at
  )
  FROM properties p
  JOIN property_types pt ON p.property_type_id = pt.id
  JOIN sale_types st ON p.sale_type_id = st.id
  WHERE p.id = prop_id
  INTO property_details;

  -- Return null if property not found
  IF property_details IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get property images
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', pi.id,
      'image_url', pi.image_url,
      'order', pi."order"
    ) ORDER BY pi."order" ASC
  ), '[]'::jsonb)
  FROM property_images pi
  WHERE pi.property_id = prop_id
  INTO property_images;

  -- Get property features with detailed information
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', f.id,
      'name', f.name
    )
  ), '[]'::jsonb)
  FROM property_features pf
  JOIN features f ON pf.feature_id = f.id
  WHERE pf.property_id = prop_id
  INTO property_features;

  -- Combine all information including agent contact
  property_details := property_details || jsonb_build_object(
    'images', property_images,
    'features', property_features,
    'agent', jsonb_build_object(
      'name', property_details->>'agent_name',
      'email', property_details->>'agent_email',
      'phone', property_details->>'agent_phone',
      'whatsapp_link', property_details->>'agent_whatsapp_link'
    )
  );

  RETURN property_details;
END;
$$;

-- Note: The update_property function already handles dynamic updates through JSONB,
-- so it will automatically support the new agent contact fields without modification.
-- The dynamic update query in the existing function will handle any field passed
-- in the fields_to_update JSONB parameter, including the new agent contact fields.
