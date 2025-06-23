import { supabase } from './supabase';

/**
 * Service for handling chat-related database operations
 */
export const chatService = {
  /**
   * Create a new conversation
   * @param {string} subject - Optional subject for the conversation
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async createConversation(subject = null) {
    try {
      const { data, error } = await supabase.rpc('create_conversation', {
        p_subject: subject
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating conversation:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all conversations for the current user
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getUserConversations() {
    try {
      const { data, error } = await supabase.rpc('get_user_conversations');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { data: null, error };
    }
  },

  /**
   * Get messages for a specific conversation
   * @param {string} conversationId - The conversation ID
   * @param {number} limit - Number of messages to fetch (default: 50)
   * @param {number} offset - Offset for pagination (default: 0)
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getConversationMessages(conversationId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase.rpc('get_conversation_messages', {
        p_conversation_id: conversationId,
        p_limit: limit,
        p_offset: offset
      });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { data: null, error };
    }
  },

  /**
   * Send a message in a conversation
   * @param {string} conversationId - The conversation ID
   * @param {string} content - The message content
   * @param {string} messageType - The message type (default: 'text')
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async sendMessage(conversationId, content, messageType = 'text') {
    try {
      const { data, error } = await supabase.rpc('send_message', {
        p_conversation_id: conversationId,
        p_content: content,
        p_message_type: messageType
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { data: null, error };
    }
  },

  /**
   * Assign admin to a conversation (admin only)
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async assignAdminToConversation(conversationId) {
    try {
      const { data, error } = await supabase.rpc('assign_admin_to_conversation', {
        p_conversation_id: conversationId
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error assigning admin to conversation:', error);
      return { data: null, error };
    }
  },

  /**
   * Mark messages as read in a conversation
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async markMessagesAsRead(conversationId) {
    try {
      const { data, error } = await supabase.rpc('mark_messages_as_read', {
        p_conversation_id: conversationId
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return { data: null, error };
    }
  },

  /**
   * Subscribe to new messages in a conversation
   * @param {string} conversationId - The conversation ID
   * @param {Function} callback - Callback function to handle new messages
   * @returns {Object} Subscription object
   */
  subscribeToMessages(conversationId, callback) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .subscribe();
  },

  /**
   * Subscribe to conversation updates
   * @param {Function} callback - Callback function to handle conversation updates
   * @returns {Object} Subscription object
   */
  subscribeToConversations(callback) {
    return supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        callback
      )
      .subscribe();
  },

  /**
   * Unsubscribe from a channel
   * @param {Object} subscription - The subscription object to unsubscribe
   */
  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },

  /**
   * Update conversation status (admin only)
   * @param {string} conversationId - The conversation ID
   * @param {string} status - New status ('active', 'closed', 'archived')
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async updateConversationStatus(conversationId, status) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating conversation status:', error);
      return { data: null, error };
    }
  },

  /**
   * Get unread message count for all conversations
   * @returns {Promise<{data: number, error: Object}>}
   */
  async getUnreadMessageCount() {
    try {
      const { data: conversations, error } = await this.getUserConversations();
      
      if (error) throw error;
      
      const totalUnread = conversations.reduce((total, conv) => {
        return total + (conv.unread_count || 0);
      }, 0);

      return { data: totalUnread, error: null };
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return { data: 0, error };
    }
  }
};
