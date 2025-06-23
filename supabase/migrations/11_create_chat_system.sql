-- Create chat system for admin-client communication

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_admin_id ON conversations(admin_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

-- Enable RLS on chat tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations table
-- Clients can view their own conversations
CREATE POLICY "Clients can view their own conversations" ON conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations" ON conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Clients can create conversations
CREATE POLICY "Clients can create conversations" ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

-- Admins can update conversations (assign themselves, change status)
CREATE POLICY "Admins can update conversations" ON conversations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- RLS Policies for messages table
-- Users can view messages in conversations they're part of
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.client_id = auth.uid() OR c.admin_id = auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Users can create messages in conversations they're part of
CREATE POLICY "Users can create messages in their conversations" ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.client_id = auth.uid() OR c.admin_id = auth.uid())
    )
  );

-- Users can update their own messages (mark as read)
CREATE POLICY "Users can update message read status" ON messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.client_id = auth.uid() OR c.admin_id = auth.uid())
    )
  );

-- Function to create a new conversation
CREATE OR REPLACE FUNCTION create_conversation(
  p_subject TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_conversation_id UUID;
  result JSONB;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user is not an admin (only clients can create conversations)
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ) THEN
    RAISE EXCEPTION 'Admins cannot create conversations';
  END IF;

  -- Create the conversation
  INSERT INTO conversations (client_id, subject)
  VALUES (auth.uid(), p_subject)
  RETURNING id INTO new_conversation_id;

  -- Return the conversation details
  SELECT jsonb_build_object(
    'id', c.id,
    'client_id', c.client_id,
    'admin_id', c.admin_id,
    'subject', c.subject,
    'status', c.status,
    'created_at', c.created_at,
    'updated_at', c.updated_at
  ) INTO result
  FROM conversations c
  WHERE c.id = new_conversation_id;

  RETURN result;
END;
$$;

-- Function to send a message
CREATE OR REPLACE FUNCTION send_message(
  p_conversation_id UUID,
  p_content TEXT,
  p_message_type TEXT DEFAULT 'text'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_message_id UUID;
  result JSONB;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user is part of the conversation
  IF NOT EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = p_conversation_id
    AND (c.client_id = auth.uid() OR c.admin_id = auth.uid())
  ) AND NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ) THEN
    RAISE EXCEPTION 'User is not part of this conversation';
  END IF;

  -- Create the message
  INSERT INTO messages (conversation_id, sender_id, content, message_type)
  VALUES (p_conversation_id, auth.uid(), p_content, p_message_type)
  RETURNING id INTO new_message_id;

  -- Update conversation timestamp
  UPDATE conversations 
  SET updated_at = now()
  WHERE id = p_conversation_id;

  -- Return the message details
  SELECT jsonb_build_object(
    'id', m.id,
    'conversation_id', m.conversation_id,
    'sender_id', m.sender_id,
    'content', m.content,
    'message_type', m.message_type,
    'is_read', m.is_read,
    'created_at', m.created_at
  ) INTO result
  FROM messages m
  WHERE m.id = new_message_id;

  RETURN result;
END;
$$;

-- Function to get conversations for a user
CREATE OR REPLACE FUNCTION get_user_conversations()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  is_admin BOOLEAN;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ) INTO is_admin;

  IF is_admin THEN
    -- Admin: Get all conversations
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', c.id,
        'client_id', c.client_id,
        'admin_id', c.admin_id,
        'subject', c.subject,
        'status', c.status,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'client_email', u.email,
        'unread_count', (
          SELECT COUNT(*)
          FROM messages m
          WHERE m.conversation_id = c.id
          AND m.sender_id != auth.uid()
          AND m.is_read = false
        )
      )
    ) INTO result
    FROM conversations c
    LEFT JOIN auth.users u ON u.id = c.client_id
    ORDER BY c.updated_at DESC;
  ELSE
    -- Client: Get only their conversations
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', c.id,
        'client_id', c.client_id,
        'admin_id', c.admin_id,
        'subject', c.subject,
        'status', c.status,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'admin_email', u.email,
        'unread_count', (
          SELECT COUNT(*)
          FROM messages m
          WHERE m.conversation_id = c.id
          AND m.sender_id != auth.uid()
          AND m.is_read = false
        )
      )
    ) INTO result
    FROM conversations c
    LEFT JOIN auth.users u ON u.id = c.admin_id
    WHERE c.client_id = auth.uid()
    ORDER BY c.updated_at DESC;
  END IF;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Function to get messages for a conversation
CREATE OR REPLACE FUNCTION get_conversation_messages(
  p_conversation_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
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

  -- Check if user has access to this conversation
  IF NOT EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = p_conversation_id
    AND (c.client_id = auth.uid() OR c.admin_id = auth.uid())
  ) AND NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ) THEN
    RAISE EXCEPTION 'User does not have access to this conversation';
  END IF;

  -- Get messages
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', m.id,
      'conversation_id', m.conversation_id,
      'sender_id', m.sender_id,
      'content', m.content,
      'message_type', m.message_type,
      'is_read', m.is_read,
      'created_at', m.created_at,
      'sender_email', u.email,
      'sender_is_admin', COALESCE(u.raw_user_meta_data->>'is_admin' = 'true', false)
    )
  ) INTO result
  FROM messages m
  LEFT JOIN auth.users u ON u.id = m.sender_id
  WHERE m.conversation_id = p_conversation_id
  ORDER BY m.created_at ASC
  LIMIT p_limit
  OFFSET p_offset;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Function to assign admin to conversation
CREATE OR REPLACE FUNCTION assign_admin_to_conversation(
  p_conversation_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if user is authenticated and is admin
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ) THEN
    RAISE EXCEPTION 'Only admins can assign themselves to conversations';
  END IF;

  -- Update conversation
  UPDATE conversations 
  SET admin_id = auth.uid(), updated_at = now()
  WHERE id = p_conversation_id;

  -- Return updated conversation
  SELECT jsonb_build_object(
    'id', c.id,
    'client_id', c.client_id,
    'admin_id', c.admin_id,
    'subject', c.subject,
    'status', c.status,
    'created_at', c.created_at,
    'updated_at', c.updated_at
  ) INTO result
  FROM conversations c
  WHERE c.id = p_conversation_id;

  RETURN result;
END;
$$;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  p_conversation_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user has access to this conversation
  IF NOT EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = p_conversation_id
    AND (c.client_id = auth.uid() OR c.admin_id = auth.uid())
  ) AND NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ) THEN
    RAISE EXCEPTION 'User does not have access to this conversation';
  END IF;

  -- Mark messages as read (only messages not sent by current user)
  UPDATE messages 
  SET is_read = true
  WHERE conversation_id = p_conversation_id
  AND sender_id != auth.uid()
  AND is_read = false;

  RETURN jsonb_build_object('success', true);
END;
$$;
