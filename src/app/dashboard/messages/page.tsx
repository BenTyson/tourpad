'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Send,
  Paperclip,
  MoreVertical,
  User,
  Calendar,
  Music,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProfileImage } from '@/components/ui/ProfileImage';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import { OnlineStatusIndicator, ProfileImageWithStatus } from '@/components/ui/OnlineStatusIndicator';
import { useRealtimeMessaging } from '@/hooks/useRealtimeMessaging';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [startConversationUserId, setStartConversationUserId] = useState<string | null>(null);
  const [newConversationRecipient, setNewConversationRecipient] = useState<any>(null);
  
  // Refs for managing input focus and typing state
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number>(0);

  // Real-time messaging hook
  const {
    newMessages,
    updatedConversations,
    typingUsers,
    onlineStatus,
    startTyping,
    stopTyping,
    fetchOnlineStatus,
    clearNewMessages,
    clearUpdatedConversations,
    isUserOnline
  } = useRealtimeMessaging({
    conversationId: selectedConversation,
    pollInterval: 15000, // Poll every 15 seconds for active conversations
    typingTimeout: 3000,
    heartbeatInterval: 60000
  });

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: messageText
        })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      setMessages([...messages, data.message]);
      setMessageText('');
      
      // Update conversation list to reflect new message
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Start new conversation
  const startNewConversation = async (recipientId: string, initialMessage: string) => {
    setSendingMessage(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          initialMessage
        })
      });

      if (!response.ok) throw new Error('Failed to start conversation');
      
      const data = await response.json();
      setSelectedConversation(data.conversation.id);
      setStartConversationUserId(null);
      setNewConversationRecipient(null);
      setMessageText('');
      
      // Refresh conversations to show new one
      await fetchConversations();
      await fetchMessages(data.conversation.id);
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    // Check for startConversation query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const startConversationParam = urlParams.get('startConversation');
    
    if (startConversationParam) {
      setStartConversationUserId(startConversationParam);
      // Fetch recipient user info
      fetch(`/api/users/${startConversationParam}`)
        .then(res => res.json())
        .then(data => setNewConversationRecipient(data.user))
        .catch(err => console.error('Error fetching recipient:', err));
    }

    fetchConversations();
  }, [session, status, router]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Handle new messages from real-time polling
  useEffect(() => {
    if (newMessages.length > 0) {
      setMessages(prevMessages => {
        // Avoid duplicates by checking if message already exists
        const existingIds = new Set(prevMessages.map(m => m.id));
        const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
        
        if (uniqueNewMessages.length > 0) {
          return [...prevMessages, ...uniqueNewMessages];
        }
        return prevMessages;
      });
      
      // Clear processed messages
      clearNewMessages();
    }
  }, [newMessages, clearNewMessages]);

  // Handle conversation updates from real-time polling
  useEffect(() => {
    if (updatedConversations.length > 0) {
      setConversations(prevConversations => {
        const updatedConvMap = new Map(updatedConversations.map(c => [c.id, c]));
        
        // Update existing conversations or add new ones
        const updated = prevConversations.map(conv => 
          updatedConvMap.get(conv.id) || conv
        );
        
        // Add any completely new conversations
        const existingIds = new Set(prevConversations.map(c => c.id));
        const newConvs = updatedConversations.filter(c => !existingIds.has(c.id));
        
        const result = [...updated, ...newConvs].sort((a, b) => 
          new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()
        );
        
        return result;
      });
      
      // Clear processed updates
      clearUpdatedConversations();
    }
  }, [updatedConversations, clearUpdatedConversations]);

  // Fetch online status for conversation participants
  useEffect(() => {
    if (conversations.length > 0) {
      const participantIds = conversations.flatMap(conv => 
        conv.participants?.map((p: any) => p.id) || []
      );
      
      if (participantIds.length > 0) {
        fetchOnlineStatus([...new Set(participantIds)]);
      }
    }
  }, [conversations, fetchOnlineStatus]);

  // Handle typing indicator on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageText(value);
    
    // Send typing indicator if user is typing
    if (value.trim() && selectedConversation) {
      const now = Date.now();
      
      // Only send typing indicator if enough time has passed since last one
      if (now - lastTypingTimeRef.current > 2000) {
        startTyping();
        lastTypingTimeRef.current = now;
      }
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 1000);
    }
  };

  // Stop typing when input loses focus
  const handleInputBlur = () => {
    stopTyping();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Helper function to format display name with band/venue name
  const formatDisplayName = (participant: any): { primary: string; secondary: string } => {
    if (!participant) return { primary: 'Unknown', secondary: '' };
    
    const baseName = participant.name || 'Unknown';
    const stageName = participant.artist?.stageName;
    const venueName = participant.host?.venueName;
    
    if (participant.userType === 'ARTIST' && stageName && stageName !== baseName) {
      return {
        primary: stageName,
        secondary: baseName
      };
    } else if (participant.userType === 'HOST' && venueName) {
      return {
        primary: baseName,
        secondary: venueName
      };
    } else {
      return {
        primary: baseName,
        secondary: participant.userType?.toLowerCase() || ''
      };
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  
  // Debug logging
  console.log('Debug messaging state:', {
    selectedConversation,
    selectedConv: selectedConv?.id,
    startConversationUserId,
    newConversationRecipient: newConversationRecipient?.id,
    conversationsCount: conversations.length
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      {/* Conversation List - Left Sidebar */}
      <div className="w-full sm:w-1/3 lg:w-1/4 border-r border-neutral-200 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[var(--color-mist)] border-0 focus:ring-2 focus:ring-[var(--color-french-blue)]"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">No messages yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Start a conversation with an artist or host
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  // Clear new conversation state and select existing conversation
                  setStartConversationUserId(null);
                  setNewConversationRecipient(null);
                  setSelectedConversation(conv.id);
                  // Clear query parameters from URL
                  window.history.replaceState({}, '', '/dashboard/messages');
                }}
                className={`w-full p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-left ${
                  selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-[var(--color-french-blue)]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <ProfileImageWithStatus
                      isOnline={conv.participants.length > 0 ? isUserOnline(conv.participants[0]?.id) : false}
                    >
                      <ProfileImage 
                        user={conv.participants.length > 0 ? conv.participants[0] : null}
                        alt={conv.participants.length > 0 ? conv.participants[0]?.name : 'User'}
                        size="md"
                      />
                    </ProfileImageWithStatus>
                    <div>
                      {(() => {
                        const participant = conv.participants.length > 0 ? conv.participants[0] : null;
                        const displayName = formatDisplayName(participant);
                        return (
                          <>
                            <h4 className="font-medium text-sm text-neutral-900">
                              {displayName.primary}
                            </h4>
                            <p className="text-xs text-neutral-500">
                              {displayName.secondary && (
                                <span className="font-medium">{displayName.secondary}</span>
                              )}
                              {displayName.secondary && conv.lastMessageAt && (
                                <span className="mx-1">•</span>
                              )}
                              {conv.lastMessageAt && new Date(conv.lastMessageAt).toLocaleDateString()}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge className="bg-[var(--color-french-blue)] text-white">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-neutral-600 truncate mt-2">
                  {conv.lastMessage ? conv.lastMessage.content : 'No messages yet'}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Thread - Right Panel */}
      <div className="flex-1 flex flex-col">
        {startConversationUserId && newConversationRecipient ? (
          <>
            {/* New Conversation Header */}
            <div className="p-4 border-b border-neutral-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ProfileImage 
                    user={newConversationRecipient}
                    alt={newConversationRecipient?.name}
                    size="md"
                  />
                  <div>
                    {(() => {
                      const displayName = formatDisplayName(newConversationRecipient);
                      return (
                        <>
                          <h3 className="font-semibold text-neutral-900">
                            New message to {displayName.primary}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {displayName.secondary}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setStartConversationUserId(null);
                    setNewConversationRecipient(null);
                    router.push('/dashboard/messages');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* New Conversation Composer */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="p-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-[var(--color-french-blue)] mb-2">
                    Start a conversation
                  </h4>
                  <p className="text-sm text-neutral-600">
                    Send a message to {newConversationRecipient.name} to start your conversation.
                  </p>
                </div>
              </div>
              
              <div className="p-4 border-t border-neutral-200 bg-white">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder={`Write your message to ${newConversationRecipient.name}...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && messageText.trim() && !sendingMessage) {
                        startNewConversation(startConversationUserId, messageText);
                      }
                    }}
                    className="flex-1"
                    disabled={sendingMessage}
                  />
                  <Button 
                    size="sm"
                    disabled={!messageText.trim() || sendingMessage}
                    onClick={() => startNewConversation(startConversationUserId, messageText)}
                    className="bg-[var(--color-french-blue)] hover:bg-blue-600"
                  >
                    {sendingMessage ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : selectedConv ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-neutral-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ProfileImageWithStatus
                    isOnline={selectedConv.participants.length > 0 ? isUserOnline(selectedConv.participants[0]?.id) : false}
                  >
                    <ProfileImage 
                      user={selectedConv.participants.length > 0 ? selectedConv.participants[0] : null}
                      alt={selectedConv.participants.length > 0 ? selectedConv.participants[0]?.name : 'User'}
                      size="md"
                    />
                  </ProfileImageWithStatus>
                  <div>
                    {(() => {
                      const participant = selectedConv.participants.length > 0 ? selectedConv.participants[0] : null;
                      const displayName = formatDisplayName(participant);
                      const isOnline = participant ? isUserOnline(participant.id) : false;
                      return (
                        <>
                          <h3 className="font-semibold text-neutral-900">
                            {displayName.primary}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-neutral-500">
                              {displayName.secondary}
                            </p>
                            <OnlineStatusIndicator 
                              isOnline={isOnline}
                              showLabel={true}
                              size="sm"
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-neutral-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isOwnMessage = msg.senderId === session?.user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end space-x-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isOwnMessage && (
                        <ProfileImage 
                          user={msg.sender}
                          alt={msg.sender?.name}
                          size="sm"
                          className="mb-1"
                        />
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-[var(--color-french-blue)] text-white'
                            : 'bg-[var(--color-mist)] text-neutral-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-neutral-500'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {isOwnMessage && (
                        <ProfileImage 
                          user={session?.user}
                          alt={session?.user?.name}
                          size="sm"
                          className="mb-1"
                        />
                      )}
                    </div>
                  );
                })
              )}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="px-4 pb-2">
                  <TypingIndicator typingUsers={typingUsers} />
                </div>
              )}
            </div>

            {/* Message Composer */}
            <div className="p-4 border-t border-neutral-200 bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  ref={messageInputRef}
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && messageText.trim() && !sendingMessage) {
                      sendMessage();
                      stopTyping();
                    }
                  }}
                  className="flex-1"
                  disabled={sendingMessage}
                />
                <Button 
                  size="sm"
                  disabled={!messageText.trim() || sendingMessage}
                  onClick={sendMessage}
                  className="bg-[var(--color-french-blue)] hover:bg-blue-600"
                >
                  {sendingMessage ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-neutral-500">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}