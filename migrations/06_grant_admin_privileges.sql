-- Grant admin privileges to specific user
-- UID: 2a3c0b82-ac37-418d-ba57-8d77861c8af9
-- EMAIL: victoryemma999@gmail.com

-- Update user metadata to set is_admin flag to true
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN jsonb_build_object('is_admin', true)
    ELSE raw_user_meta_data || jsonb_build_object('is_admin', true)
  END
WHERE id = '2a3c0b82-ac37-418d-ba57-8d77861c8af9';

-- Verify the update
SELECT id, email, raw_user_meta_data
FROM auth.users
WHERE id = '2a3c0b82-ac37-418d-ba57-8d77861c8af9';