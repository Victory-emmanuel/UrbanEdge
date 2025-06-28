import { useState, useEffect, useRef } from "react";
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { chatService } from "../../../lib/chatService";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input,
  Spinner,
  Chip,
  Badge
} from "@material-tailwind/react";

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
      <Card className="text-center py-8 max-w-md mx-auto">
        <CardBody className="flex flex-col items-center">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-gray-300 mx-auto mb-4" />
          <Typography color="blue-gray" className="font-normal">
            Please sign in to access chat
          </Typography>
        </CardBody>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="h-8 w-8" color="blue" />
      </div>
    );
  }

  return (
    <Card className="h-96 overflow-hidden">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-blue-gray-100 flex flex-col">
          <div className="p-4 border-b border-blue-gray-100">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray">
                Conversations
              </Typography>
              <Button
                variant="text"
                size="sm"
                color="blue"
                onClick={() => setShowNewConversation(true)}
                className="p-1 flex items-center justify-center"
              >
                <PlusIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2 text-blue-gray-300" />
              <Typography variant="small" color="blue-gray" className="font-normal">
                No conversations yet
              </Typography>
              <Button
                variant="text"
                size="sm"
                color="blue"
                onClick={() => setShowNewConversation(true)}
                className="mt-2"
              >
                Start a conversation
              </Button>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation)}
                className={`p-3 border-b border-blue-gray-50 cursor-pointer hover:bg-blue-gray-50/50 ${
                  activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Typography 
                      variant="small" 
                      color="blue-gray" 
                      className="font-medium truncate"
                    >
                      {conversation.subject || 'General Inquiry'}
                    </Typography>
                    <Typography 
                      variant="small" 
                      color="blue-gray" 
                      className="text-xs opacity-70"
                    >
                      {conversation.admin_email ? `Admin: ${conversation.admin_email}` : 'Waiting for admin'}
                    </Typography>
                  </div>
                  {conversation.unread_count > 0 && (
                    <Badge content={conversation.unread_count} color="blue" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

        {/* Chat Area */}
        <div className="flex-1">
          {showNewConversation ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-blue-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="h6" color="blue-gray">
                    New Conversation
                  </Typography>
                  <Button
                    variant="text"
                    size="sm"
                    color="blue-gray"
                    onClick={() => setShowNewConversation(false)}
                    className="p-1 flex items-center justify-center"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <CardBody>
                <form onSubmit={handleCreateConversation} className="flex flex-col h-full">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={newConversationSubject}
                      onChange={(e) => setNewConversationSubject(e.target.value)}
                      placeholder="What would you like to discuss?"
                      className="!border-blue-gray-200 focus:!border-blue-500"
                      labelProps={{
                        className: "hidden",
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="text"
                      color="blue-gray"
                      onClick={() => setShowNewConversation(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="blue"
                      disabled={!newConversationSubject.trim()}
                    >
                      Start Conversation
                    </Button>
                  </div>
                </form>
              </CardBody>
            </div>
          ) : activeConversation ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-blue-gray-100">
                <Typography variant="h6" color="blue-gray">
                  {activeConversation.subject || 'General Inquiry'}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                  {activeConversation.admin_email ? `Chatting with ${activeConversation.admin_email}` : 'Waiting for admin to join...'}
                </Typography>
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
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-gray-50 text-blue-gray-800'
                      }`}
                    >
                      <Typography variant="small" className="font-normal">
                        {message.content}
                      </Typography>
                      <Typography 
                        variant="small" 
                        className={`text-xs mt-1 ${
                          message.sender_id === user.id ? 'text-blue-100' : 'text-blue-gray-500'
                        }`}
                      >
                        {formatMessageTime(message.created_at)}
                      </Typography>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <CardFooter className="p-4 border-t border-blue-gray-50">
                <form onSubmit={handleSendMessage} className="w-full">
                  <div className="flex gap-2">
                    <div className="w-full">
                      <Input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "hidden",
                        }}
                        disabled={sending}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="p-2 flex items-center justify-center"
                      color="blue"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-blue-gray-300" />
                <Typography color="blue-gray" className="font-normal">
                  Select a conversation to start chatting
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
