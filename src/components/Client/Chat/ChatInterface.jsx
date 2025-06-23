import { useState, useEffect, useRef } from "react";
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { chatService } from "../../../lib/chatService";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Chat Interface component for client-admin communication
 */
const ChatInterface = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState("");
  const messagesEndRef = useRef(null);
  const messageSubscription = useRef(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages();
      subscribeToMessages();
      markMessagesAsRead();
    }

    return () => {
      if (messageSubscription.current) {
        chatService.unsubscribe(messageSubscription.current);
      }
    };
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await chatService.getUserConversations();
      
      if (error) throw error;
      setConversations(data || []);
      
      // Auto-select first conversation if available
      if (data && data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeConversation) return;

    try {
      const { data, error } = await chatService.getConversationMessages(activeConversation.id);
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const subscribeToMessages = () => {
    if (!activeConversation) return;

    messageSubscription.current = chatService.subscribeToMessages(
      activeConversation.id,
      (payload) => {
        const newMessage = payload.new;
        setMessages(prev => [...prev, newMessage]);
        
        // Mark as read if not sent by current user
        if (newMessage.sender_id !== user.id) {
          markMessagesAsRead();
        }
      }
    );
  };

  const markMessagesAsRead = async () => {
    if (!activeConversation) return;

    try {
      await chatService.markMessagesAsRead(activeConversation.id);
      // Update conversation unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation.id 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    try {
      setSending(true);
      const { data, error } = await chatService.sendMessage(
        activeConversation.id,
        newMessage.trim()
      );

      if (error) throw error;
      
      setNewMessage("");
      // Message will be added via subscription
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleCreateConversation = async (e) => {
    e.preventDefault();
    if (!newConversationSubject.trim()) return;

    try {
      const { data, error } = await chatService.createConversation(newConversationSubject.trim());
      
      if (error) throw error;
      
      setNewConversationSubject("");
      setShowNewConversation(false);
      await fetchConversations();
      setActiveConversation(data);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Please sign in to access chat</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-brown-dark rounded-lg shadow-sm border border-gray-200 dark:border-brown h-96 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-brown flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-brown">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Conversations</h3>
            <button
              onClick={() => setShowNewConversation(true)}
              className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No conversations yet</p>
              <button
                onClick={() => setShowNewConversation(true)}
                className="text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                Start a conversation
              </button>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation)}
                className={`p-3 border-b border-gray-100 dark:border-brown/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-brown/30 ${
                  activeConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.subject || 'General Inquiry'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.admin_email ? `Admin: ${conversation.admin_email}` : 'Waiting for admin'}
                    </p>
                  </div>
                  {conversation.unread_count > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {showNewConversation ? (
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">New Conversation</h4>
              <button
                onClick={() => setShowNewConversation(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateConversation}>
              <input
                type="text"
                value={newConversationSubject}
                onChange={(e) => setNewConversationSubject(e.target.value)}
                placeholder="What would you like to discuss?"
                className="w-full p-3 border border-gray-300 dark:border-brown rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-brown-dark text-gray-900 dark:text-white"
                autoFocus
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewConversation(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newConversationSubject.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Conversation
                </button>
              </div>
            </form>
          </div>
        ) : activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-brown">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {activeConversation.subject || 'General Inquiry'}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeConversation.admin_email ? `Chatting with ${activeConversation.admin_email}` : 'Waiting for admin to join...'}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-brown text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === user.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-brown">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 dark:border-brown rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-brown-dark text-gray-900 dark:text-white"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
