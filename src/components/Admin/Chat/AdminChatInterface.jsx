import { useState, useEffect, useRef } from "react";
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  CheckIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  TrashIcon
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
  Chip,
  Spinner,
  Badge,
  Drawer,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";

/**
 * Admin Chat Interface component for managing client conversations
 */
const AdminChatInterface = () => {
  const { user, isAdmin } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const messagesEndRef = useRef(null);
  const messageSubscription = useRef(null);
  const conversationSubscription = useRef(null);

  useEffect(() => {
    if (user && isAdmin) {
      fetchConversations();
      subscribeToConversationUpdates();
    }

    return () => {
      if (conversationSubscription.current) {
        chatService.unsubscribe(conversationSubscription.current);
      }
    };
  }, [user, isAdmin]);

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

  const subscribeToConversationUpdates = () => {
    conversationSubscription.current = chatService.subscribeToConversations(
      () => {
        fetchConversations();
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
      // Create a temporary message object to display immediately
      const tempMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: activeConversation.id,
        sender_id: user.id,
        sender_is_admin: true,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read: true
      };
      
      // Add the temporary message to the UI
      setMessages(prev => [...prev, tempMessage]);
      
      // Clear the input field
      setNewMessage("");
      
      // Send the message to the server
      const { data, error } = await chatService.sendMessage(
        activeConversation.id,
        tempMessage.content
      );

      if (error) throw error;
      
      // The actual message will be added via subscription and replace the temp one
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;
    
    try {
      const { error } = await chatService.deleteConversation(conversationToDelete);
      
      if (error) throw error;
      
      // Remove the conversation from the list
      setConversations(prev => prev.filter(conv => conv.id !== conversationToDelete));
      
      // If this was the active conversation, clear it
      if (activeConversation?.id === conversationToDelete) {
        setActiveConversation(null);
        setMessages([]);
      }
      
      // Close the dialog
      setDeleteDialog(false);
      setConversationToDelete(null);
      
      // Close the drawer on mobile
      setOpenDrawer(false);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleAssignToSelf = async (conversationId) => {
    try {
      const { data, error } = await chatService.assignAdminToConversation(conversationId);
      
      if (error) throw error;
      
      // Update the conversation in the list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, admin_id: user.id, admin_email: user.email }
            : conv
        )
      );

      // If this is the active conversation, update it too
      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => ({
          ...prev,
          admin_id: user.id,
          admin_email: user.email
        }));
      }
    } catch (error) {
      console.error("Error assigning conversation:", error);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!user || !isAdmin) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardBody className="text-center">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-gray-400 mx-auto mb-4" />
          <Typography variant="h6" color="blue-gray">
            Admin Access Required
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="mt-2 font-normal opacity-70">
            You need administrator privileges to access this feature
          </Typography>
        </CardBody>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  return (
    <Card className="w-full h-[600px] overflow-hidden">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden p-4 border-b border-blue-gray-100 flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Admin Chat
        </Typography>
        <IconButton variant="text" onClick={() => setOpenDrawer(true)}>
          <Bars3Icon className="h-6 w-6" />
        </IconButton>
      </div>

      {/* Mobile Drawer for Conversations */}
      
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h5" color="blue-gray">
            Conversations
          </Typography>
          <IconButton variant="text" onClick={() => setOpenDrawer(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        
        <div className="overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2 text-blue-gray-300" />
              <Typography variant="small" color="blue-gray" className="font-normal">
                No conversations yet
              </Typography>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setActiveConversation(conversation);
                  setOpenDrawer(false);
                }}
                className={`p-3 border-b border-blue-gray-50 cursor-pointer hover:bg-blue-gray-50/30 transition-colors ${
                  activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <UserIcon className="h-4 w-4 text-blue-gray-400 mr-1" />
                      <Typography 
                        variant="small" 
                        color="blue-gray" 
                        className="font-medium truncate"
                      >
                        {conversation.client_email}
                      </Typography>
                    </div>
                    <Typography 
                      variant="small" 
                      color="blue-gray" 
                      className="text-xs opacity-70 truncate"
                    >
                      {conversation.subject || 'General Inquiry'}
                    </Typography>
                    <div className="flex items-center mt-1">
                      {conversation.admin_id ? (
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={
                            <div className="flex items-center gap-1">
                              <CheckIcon className="h-3 w-3" />
                              <span>Assigned</span>
                            </div>
                          }
                          color="green"
                          className="text-xs py-0.5 px-1"
                        />
                      ) : (
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>Unassigned</span>
                            </div>
                          }
                          color="amber"
                          className="text-xs py-0.5 px-1"
                        />
                      )}
                      <Typography 
                        variant="small" 
                        className="text-xs text-blue-gray-400 ml-2"
                      >
                        {formatConversationTime(conversation.updated_at)}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {conversation.unread_count > 0 && (
                      <Badge content={conversation.unread_count} color="blue">
                        <div className="w-5 h-5"></div>
                      </Badge>
                    )}
                    <IconButton 
                      variant="text" 
                      size="sm" 
                      color="red"
                      className="ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConversationToDelete(conversation.id);
                        setDeleteDialog(true);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this conversation? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setDeleteDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleDeleteConversation}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Conversations List - Hidden on Mobile */}
        <div className="hidden md:block w-1/3 border-r border-blue-gray-100">
          <div className="p-4 border-b border-blue-gray-100">
            <Typography variant="h6" color="blue-gray">
              Client Conversations
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
              {conversations.length} total conversations
            </Typography>
          </div>

          <div className="h-[calc(600px-73px)] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center">
                <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2 text-blue-gray-300" />
                <Typography variant="small" color="blue-gray" className="font-normal">
                  No conversations yet
                </Typography>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation)}
                  className={`p-3 border-b border-blue-gray-50 cursor-pointer hover:bg-blue-gray-50/30 transition-colors ${
                    activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <UserIcon className="h-4 w-4 text-blue-gray-400 mr-1" />
                        <Typography 
                          variant="small" 
                          color="blue-gray" 
                          className="font-medium truncate"
                        >
                          {conversation.client_email}
                        </Typography>
                      </div>
                      <Typography 
                        variant="small" 
                        color="blue-gray" 
                        className="text-xs opacity-70 truncate"
                      >
                        {conversation.subject || 'General Inquiry'}
                      </Typography>
                      <div className="flex items-center mt-1">
                        {conversation.admin_id ? (
                          <Chip
                            size="sm"
                            variant="ghost"
                            value={
                              <div className="flex items-center gap-1">
                                <CheckIcon className="h-3 w-3" />
                                <span>Assigned</span>
                              </div>
                            }
                            color="green"
                            className="text-xs py-0.5 px-1"
                          />
                        ) : (
                          <Chip
                            size="sm"
                            variant="ghost"
                            value={
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>Unassigned</span>
                              </div>
                            }
                            color="amber"
                            className="text-xs py-0.5 px-1"
                          />
                        )}
                        <Typography 
                          variant="small" 
                          className="text-xs text-blue-gray-400 ml-2"
                        >
                          {formatConversationTime(conversation.updated_at)}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {conversation.unread_count > 0 && (
                        <Badge content={conversation.unread_count} color="blue">
                          <div className="w-5 h-5"></div>
                        </Badge>
                      )}
                      <IconButton 
                        variant="text" 
                        size="sm" 
                        color="red"
                        className="ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConversationToDelete(conversation.id);
                          setDeleteDialog(true);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 md:block">
          {activeConversation ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-blue-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconButton 
                      variant="text" 
                      size="sm" 
                      color="blue-gray"
                      className="mr-2 md:hidden"
                      onClick={() => setOpenDrawer(true)}
                    >
                      <Bars3Icon className="h-5 w-5" />
                    </IconButton>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        {activeConversation.subject || 'General Inquiry'}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                        Client: {activeConversation.client_email}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!activeConversation.admin_id && (
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => handleAssignToSelf(activeConversation.id)}
                      >
                        Assign to Me
                      </Button>
                    )}
                    <IconButton 
                      variant="text" 
                      size="sm" 
                      color="red"
                      className="md:hidden"
                      onClick={() => {
                        setConversationToDelete(activeConversation.id);
                        setDeleteDialog(true);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
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
                        {message.sender_is_admin ? 'Admin' : 'Client'} • {formatMessageTime(message.created_at)}
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
                        placeholder="Type your response..."
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
                  {conversations.length > 0 ? (
                    <>
                      <span className="md:hidden">Open the menu to select a conversation</span>
                      <span className="hidden md:inline">Select a conversation to start responding</span>
                    </>
                  ) : (
                    "No conversations available"
                  )}
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AdminChatInterface;
