-- Create a function to set a user's admin status
-- This function should only be callable by admins
CREATE OR REPLACE FUNCTION set_user_admin_status(user_id UUID, is_admin BOOLEAN)
RETURNS VOID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF (SELECT auth.jwt() ->> 'is_admin')::BOOLEAN IS NOT TRUE THEN
    RAISE EXCEPTION 'Only admins can set admin status';
  END IF;

  -- Update the user's admin status in auth.users
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('is_admin', is_admin)
      ELSE
        raw_user_meta_data || jsonb_build_object('is_admin', is_admin)
    END
  WHERE id = user_id;

END;
$$;

-- Create a function to get all users (admin only)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF (SELECT auth.jwt() ->> 'is_admin')::BOOLEAN IS NOT TRUE THEN
    RAISE EXCEPTION 'Only admins can view all users';
  END IF;

  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    (au.raw_user_meta_data ->> 'is_admin')::BOOLEAN AS is_admin,
    au.created_at
  FROM auth.users au;

END;
$$;