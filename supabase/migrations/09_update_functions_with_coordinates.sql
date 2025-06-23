-- Update database functions to include latitude and longitude coordinates

-- Update filter_properties function to include coordinates
CREATE OR REPLACE FUNCTION filter_properties(
  location TEXT DEFAULT NULL,
  min_price NUMERIC DEFAULT NULL,
  max_price NUMERIC DEFAULT NULL,
  min_bedrooms INTEGER DEFAULT NULL,
  max_bedrooms INTEGER DEFAULT NULL,
  min_bathrooms INTEGER DEFAULT NULL,
  max_bathrooms INTEGER DEFAULT NULL,
  property_type_ids UUID[] DEFAULT NULL,
  feature_ids UUID[] DEFAULT NULL,
  sale_type_id UUID DEFAULT NULL,
  limit_val INTEGER DEFAULT 20,
  offset_val INTEGER DEFAULT 0,
  sort_by TEXT DEFAULT 'newest' -- price_asc, price_desc, bedrooms_asc, bedrooms_desc, newest
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER -- Uses the permissions of the calling user
AS $$
DECLARE
  query_text TEXT;
  count_query_text TEXT;
  where_clauses TEXT := '1=1';
  order_by_clause TEXT;
  properties_result JSONB;
  total_count INTEGER;
BEGIN
  -- Build WHERE clauses
  IF location IS NOT NULL AND location != '' THEN
    where_clauses := where_clauses || ' AND p.location ILIKE ' || quote_literal('%' || location || '%');
  END IF;
  
  IF min_price IS NOT NULL THEN
    where_clauses := where_clauses || ' AND p.price >= ' || min_price;
  END IF;
  
  IF max_price IS NOT NULL THEN
    where_clauses := where_clauses || ' AND p.price <= ' || max_price;
  END IF;
  
  IF min_bedrooms IS NOT NULL THEN
    where_clauses := where_clauses || ' AND p.bedrooms >= ' || min_bedrooms;
  END IF;
  
  IF max_bedrooms IS NOT NULL THEN
    where_clauses := where_clauses || ' AND p.bedrooms <= ' || max_bedrooms;
  END IF;
  
  IF min_bathrooms IS NOT NULL THEN
    where_clauses := where_clauses || ' AND p.bathrooms >= ' || min_bathrooms;
  END IF;
  
  IF max_bathrooms IS NOT NULL THEN
    where_clauses := where_clauses || ' AND p.bathrooms <= ' || max_bathrooms;
  END IF;
  
  IF property_type_ids IS NOT NULL AND array_length(property_type_ids, 1) > 0 THEN
    where_clauses := where_clauses || ' AND p.property_type_id = ANY(' || quote_literal(property_type_ids) || '::uuid[])';
  END IF;
  
  IF sale_type_id IS NOT NULL THEN
    where_clauses := where_clauses || ' AND p.sale_type_id = ' || quote_literal(sale_type_id) || '::uuid';
  END IF;
  
  -- Handle feature filtering (properties must have ALL requested features)
  IF feature_ids IS NOT NULL AND array_length(feature_ids, 1) > 0 THEN
    where_clauses := where_clauses || ' AND (
      SELECT COUNT(*) FROM property_features pf 
      WHERE pf.property_id = p.id AND pf.feature_id = ANY(' || quote_literal(feature_ids) || '::uuid[])
    ) = ' || array_length(feature_ids, 1);
  END IF;
  
  -- Build ORDER BY clause
  CASE sort_by
    WHEN 'price_asc' THEN order_by_clause := 'p.price ASC';
    WHEN 'price_desc' THEN order_by_clause := 'p.price DESC';
    WHEN 'bedrooms_asc' THEN order_by_clause := 'p.bedrooms ASC';
    WHEN 'bedrooms_desc' THEN order_by_clause := 'p.bedrooms DESC';
    WHEN 'newest' THEN order_by_clause := 'p.created_at DESC';
    ELSE order_by_clause := 'p.created_at DESC';
  END CASE;
  
  -- Get total count
  count_query_text := '
    SELECT COUNT(*) 
    FROM properties p
    JOIN property_types pt ON p.property_type_id = pt.id
    JOIN sale_types st ON p.sale_type_id = st.id
    WHERE ' || where_clauses;
  
  EXECUTE count_query_text INTO total_count;
  
  -- Build the main query with coordinates included
  query_text := '
    SELECT 
      p.id,
      p.title,
      p.location,
      p.price,
      p.bedrooms,
      p.bathrooms,
      p.square_feet,
      p.latitude,
      p.longitude,
      pt.name AS property_type,
      st.name AS sale_type,
      (SELECT image_url FROM property_images pi WHERE pi.property_id = p.id ORDER BY pi."order" ASC LIMIT 1) AS thumbnail_url
    FROM 
      properties p
      JOIN property_types pt ON p.property_type_id = pt.id
      JOIN sale_types st ON p.sale_type_id = st.id
    WHERE 
      ' || where_clauses || '
    ORDER BY 
      ' || order_by_clause || '
    LIMIT ' || limit_val || ' OFFSET ' || offset_val;
  
  -- Execute query and build result
  EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || query_text || ') t' INTO properties_result;
  
  -- Return structured result
  RETURN jsonb_build_object(
    'properties', COALESCE(properties_result, '[]'::jsonb),
    'total_count', total_count,
    'limit', limit_val,
    'offset', offset_val
  );
END;
$$;

-- Update get_property_details function to include coordinates
CREATE OR REPLACE FUNCTION get_property_details(property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER -- Uses the permissions of the calling user
AS $$
DECLARE
  property_details JSONB;
  property_images JSONB;
  property_features JSONB;
BEGIN
  -- Get basic property information with coordinates
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
    'property_type', jsonb_build_object('id', pt.id, 'name', pt.name),
    'sale_type', jsonb_build_object('id', st.id, 'name', st.name),
    'created_at', p.created_at,
    'updated_at', p.updated_at
  )
  FROM properties p
  JOIN property_types pt ON p.property_type_id = pt.id
  JOIN sale_types st ON p.sale_type_id = st.id
  WHERE p.id = property_id
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
  WHERE pi.property_id = property_id
  INTO property_images;
  
  -- Get property features
  SELECT COALESCE(jsonb_agg(f.name), '[]'::jsonb)
  FROM property_features pf
  JOIN features f ON pf.feature_id = f.id
  WHERE pf.property_id = property_id
  INTO property_features;
  
  -- Combine all information
  property_details := property_details || jsonb_build_object(
    'images', property_images,
    'features', property_features
  );
  
  RETURN property_details;
END;
$$;
