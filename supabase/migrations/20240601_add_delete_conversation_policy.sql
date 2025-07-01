-- Add delete policy for conversations table

-- Admins can delete conversations
CREATE POLICY "Admins can delete conversations" ON conversations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Function to safely delete a conversation
CREATE OR REPLACE FUNCTION delete_conversation(
  p_conversation_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ) THEN
    RAISE EXCEPTION 'Only admins can delete conversations';
  END IF;

  -- Delete the conversation
  DELETE FROM conversations
  WHERE id = p_conversation_id
  RETURNING jsonb_build_object(
    'id', id,
    'deleted', true
  ) INTO result;

  IF result IS NULL THEN
    RETURN jsonb_build_object('error', 'Conversation not found');
  END IF;

  RETURN result;
END;
$$;