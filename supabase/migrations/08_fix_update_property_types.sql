-- Fix update_property function to handle proper type casting for numeric fields
-- Drop existing function first to avoid parameter naming conflicts
DROP FUNCTION IF EXISTS update_property(uuid, jsonb, uuid[]);

CREATE OR REPLACE FUNCTION update_property(
  p_property_id UUID,
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
  IF NOT EXISTS (SELECT 1 FROM properties WHERE id = p_property_id) THEN
    RAISE EXCEPTION 'Property with ID % does not exist', p_property_id;
  END IF;

  -- Build dynamic update query with proper type casting
  update_query := 'UPDATE properties SET ';
  
  FOR key, value IN SELECT * FROM jsonb_each(fields_to_update)
  LOOP
    update_query := update_query || comma || key || ' = ';
    
    -- Handle type casting for specific fields
    CASE key
      WHEN 'price' THEN
        update_query := update_query || '($1->' || quote_literal(key) || ')::text::numeric';
      WHEN 'bedrooms', 'bathrooms', 'square_feet' THEN
        update_query := update_query || '($1->' || quote_literal(key) || ')::text::integer';
      WHEN 'updated_at' THEN
        update_query := update_query || '($1->' || quote_literal(key) || ')::text::timestamp with time zone';
      WHEN 'property_type_id', 'sale_type_id' THEN
        -- For UUID fields, remove quotes from the JSON value before casting
        update_query := update_query || 'trim(both ''\"'' from ($1->' || quote_literal(key) || ')::text)::uuid';
      ELSE
        -- For text fields (title, location, description, etc.)
        update_query := update_query || '($1->' || quote_literal(key) || ')::text';
    END CASE;
    
    comma := ', ';
  END LOOP;
  
  update_query := update_query || ' WHERE id = $2';
  
  -- Execute the dynamic update
  IF comma != '' THEN -- Only execute if there are fields to update
    EXECUTE update_query USING fields_to_update, p_property_id;
  END IF;

  -- Update features if provided
  IF feature_ids IS NOT NULL THEN
    -- Delete existing features
    DELETE FROM property_features WHERE property_id = p_property_id;

    -- Insert new features
    FOREACH feature_id IN ARRAY feature_ids
    LOOP
      INSERT INTO property_features (property_id, feature_id)
      VALUES (p_property_id, feature_id);
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
  WHERE p.id = p_property_id;

  RETURN result;
END;
$$;
