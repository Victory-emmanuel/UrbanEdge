import { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  PlusIcon,
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
  Badge,
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
      const { data, error } = await chatService.getConversationMessages(
        activeConversation.id
      );

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
        setMessages((prev) => [...prev, newMessage]);

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
      setConversations((prev) =>
        prev.map((conv) =>
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
      const { data, error } = await chatService.createConversation(
        newConversationSubject.trim()
      );

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
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {!user ? (
        <Card className="w-full max-w-md mx-auto mt-8 shadow-lg">
          <CardBody className="text-center p-6">
            <div className="bg-taupe/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-taupe" />
            </div>
            <Typography variant="h5" color="blue-gray" className="font-medium">
              Sign in to access chat support
            </Typography>
            <Typography variant="paragraph" className="mt-2 text-gray-600">
              Please sign in to chat with our support team.
            </Typography>
            <Button
              variant="filled"
              size="lg"
              className="mt-6 bg-taupe hover:bg-taupe/90 shadow-md"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </CardBody>
        </Card>
      ) : loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Spinner className="h-12 w-12 text-taupe" />
          <Typography variant="lead" color="blue-gray">
            Loading conversations...
          </Typography>
        </div>
      ) : (
        <Card className="h-[600px] overflow-hidden shadow-lg">
          <div className="flex h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-brown-dark/30">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-brown-dark/50">
                <Typography
                  variant="h6"
                  className="font-medium text-brown-dark dark:text-beige-light"
                >
                  Conversations
                </Typography>
                <Button
                  variant="text"
                  size="sm"
                  className="flex items-center text-taupe normal-case"
                  onClick={() => setShowNewConversation(true)}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-1" />
                  New
                </Button>
              </div>

              <div className="overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2 text-blue-gray-300" />
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
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
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors ${
                        activeConversation?.id === conversation.id
                          ? "bg-gray-100 dark:bg-gray-800/70 border-l-4 border-l-taupe"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Typography
                            variant="h6"
                            className="text-sm font-medium text-brown-dark dark:text-beige-light"
                          >
                            {conversation.subject || "General Inquiry"}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-gray-500 dark:text-gray-400"
                          >
                            {conversation.admin_email
                              ? `Admin: ${conversation.admin_email}`
                              : "Waiting for admin"}
                          </Typography>
                        </div>
                        {conversation.unread_count > 0 && (
                          <Badge
                            content={conversation.unread_count}
                            color="red"
                            className="flex items-center justify-center"
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col bg-gray-50 dark:bg-brown-dark/20">
              {showNewConversation ? (
                <div className="flex flex-col h-full p-6">
                  <div className="mb-6">
                    <Typography
                      variant="h5"
                      className="font-medium text-brown-dark dark:text-beige-light"
                    >
                      New Conversation
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-gray-600 dark:text-gray-400 mt-1"
                    >
                      Start a new conversation with our support team
                    </Typography>
                  </div>
                  <Card className="p-4 mb-6 shadow-md">
                    <Input
                      type="text"
                      label="Subject"
                      size="lg"
                      value={newConversationSubject}
                      onChange={(e) =>
                        setNewConversationSubject(e.target.value)
                      }
                      className="mb-2"
                    />
                    <Typography
                      variant="small"
                      className="text-gray-600 dark:text-gray-400 mt-1"
                    >
                      Please provide a brief subject for your conversation
                    </Typography>
                  </Card>
                  <div className="flex space-x-3 mt-auto">
                    <Button
                      variant="outlined"
                      color="red"
                      className="flex-1 normal-case"
                      onClick={() => setShowNewConversation(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="filled"
                      className="flex-1 bg-taupe hover:bg-taupe/90 normal-case shadow-md"
                      onClick={handleCreateConversation}
                      disabled={!newConversationSubject.trim()}
                    >
                      Start Conversation
                    </Button>
                  </div>
                </div>
              ) : activeConversation ? (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-brown-dark/40 shadow-sm">
                    <Typography
                      variant="h5"
                      className="font-medium text-brown-dark dark:text-beige-light"
                    >
                      {activeConversation.subject || "General Inquiry"}
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {activeConversation.admin_email
                        ? `Support: ${activeConversation.admin_email}`
                        : "Urban Edge Support"}
                    </Typography>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-brown-dark/20">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user.id
                            ? "justify-end"
                            : "justify-start"
                        } mb-4`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                            message.sender_id === user.id
                              ? "bg-taupe text-white"
                              : "bg-white dark:bg-brown-dark/40 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          <Typography variant="small" className="font-normal">
                            {message.content}
                          </Typography>
                          <Typography
                            variant="small"
                            className={`text-xs mt-1 ${
                              message.sender_id === user.id
                                ? "text-blue-100"
                                : "text-blue-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {formatMessageTime(message.created_at)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-brown-dark/40">
                    <form onSubmit={handleSendMessage} className="w-full">
                      <div className="flex gap-2">
                        <div className="w-full">
                          <Input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="!border-blue-gray-200 focus:!border-blue-500 shadow-sm"
                            labelProps={{
                              className: "hidden",
                            }}
                            disabled={sending}
                            size="lg"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={!newMessage.trim() || sending}
                          className="p-2 flex items-center justify-center bg-taupe hover:bg-taupe/90 shadow-md"
                        >
                          <PaperAirplaneIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="bg-taupe/10 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                    <ChatBubbleLeftRightIcon className="h-10 w-10 text-taupe" />
                  </div>
                  <Typography
                    variant="h5"
                    className="mb-2 font-medium text-brown-dark dark:text-beige-light"
                  >
                    Select a conversation or start a new one
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-gray-600 dark:text-gray-400 max-w-md"
                  >
                    Choose an existing conversation from the list or create a
                    new one to start chatting with our support team.
                  </Typography>
                  <Button
                    variant="filled"
                    className="mt-6 bg-taupe hover:bg-taupe/90 shadow-md normal-case"
                    onClick={() => setShowNewConversation(true)}
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Start New Conversation
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatInterface;
