-- Create function to get recent properties for client dashboard

-- Function to get the 4 most recent properties
CREATE OR REPLACE FUNCTION get_recent_properties()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Get the 4 most recent properties with all necessary details
  SELECT jsonb_agg(
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
      'created_at', p.created_at,
      'updated_at', p.updated_at,
      'property_type', jsonb_build_object(
        'id', pt.id,
        'name', pt.name
      ),
      'sale_type', jsonb_build_object(
        'id', st.id,
        'name', st.name
      ),
      'images', COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', pi.id,
              'url', pi.image_url,
              'order', pi."order"
            ) ORDER BY pi."order"
          )
          FROM property_images pi
          WHERE pi.property_id = p.id
        ),
        '[]'::jsonb
      ),
      'features', COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', f.id,
              'name', f.name
            )
          )
          FROM property_features pf
          JOIN features f ON f.id = pf.feature_id
          WHERE pf.property_id = p.id
        ),
        '[]'::jsonb
      )
    )
  ) INTO result
  FROM properties p
  LEFT JOIN property_types pt ON pt.id = p.property_type_id
  LEFT JOIN sale_types st ON st.id = p.sale_type_id
  ORDER BY p.created_at DESC
  LIMIT 4;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;
