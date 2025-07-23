'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Search, 
  Filter,
  MoreVertical,
  User,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProfileImage } from '@/components/ui/ProfileImage';

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);

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

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Debug logging
    console.log('Admin messages auth check:', {
      session: session?.user,
      userType: session?.user?.type,
      isAdmin: session?.user?.type === 'admin'
    });
    
    if (session.user.type !== 'admin') {
      router.push('/admin'); // Redirect to admin panel if not admin
      return;
    }

    fetchConversations();
  }, [session, status, router]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Helper function to format display name with band/venue name
  const formatDisplayName = (participant: any) => {
    if (!participant) return 'Unknown';
    
    const baseName = participant.name;
    const stageName = participant.artist?.stageName;
    const venueName = participant.host?.venueName;
    
    if (participant.userType === 'ARTIST' && stageName && stageName !== baseName) {
      return {
        primary: stageName,
        secondary: baseName,
        type: 'Artist'
      };
    } else if (participant.userType === 'HOST' && venueName) {
      return {
        primary: baseName,
        secondary: venueName,
        type: 'Host'
      };
    } else {
      return {
        primary: baseName,
        secondary: participant.userType?.toLowerCase(),
        type: participant.userType || 'User'
      };
    }
  };

  // Get conversation participants display
  const getConversationDisplay = (conv: any) => {
    if (conv.participants.length === 0) {
      return { primary: 'Unknown Conversation', secondary: '', participants: [] };
    }
    
    const participantDisplays = conv.participants.map(formatDisplayName);
    const primaryText = participantDisplays.map(p => p.primary).join(' & ');
    const typeText = participantDisplays.map(p => p.type).join(' ↔ ');
    
    return {
      primary: primaryText,
      secondary: typeText,
      participants: participantDisplays
    };
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    const display = getConversationDisplay(conv);
    return display.primary.toLowerCase().includes(searchTerm.toLowerCase()) ||
           display.secondary.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (conv.lastMessage?.content || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Platform Messages</h1>
                <p className="text-neutral-600 mt-1">Monitor all conversations between artists and hosts</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">
                {conversations.length} Total Conversations
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b border-neutral-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[var(--color-mist)] border-0 focus:ring-2 focus:ring-[var(--color-french-blue)]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500">
                      {searchTerm ? 'No conversations match your search' : 'No conversations found'}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const display = getConversationDisplay(conv);
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-left ${
                          selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-[var(--color-french-blue)]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <ProfileImage 
                              user={conv.participants.length > 0 ? conv.participants[0] : null}
                              alt={conv.participants.length > 0 ? conv.participants[0]?.name : 'User'}
                              size="md"
                            />
                            <div>
                              <h4 className="font-medium text-sm text-neutral-900">
                                {display.primary}
                              </h4>
                              <p className="text-xs text-neutral-500">
                                {display.secondary}
                                {conv.lastMessageAt && (
                                  <>
                                    <span className="mx-1">•</span>
                                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-[var(--color-french-blue)] text-white">
                            {conv.unreadCount || conv.messages?.length || 0}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 truncate">
                          {conv.lastMessage ? conv.lastMessage.content : 'No messages yet'}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            {selectedConv ? (
              <Card className="h-[600px] flex flex-col">
                {/* Conversation Header */}
                <div className="p-4 border-b border-neutral-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ProfileImage 
                        user={selectedConv.participants.length > 0 ? selectedConv.participants[0] : null}
                        alt={selectedConv.participants.length > 0 ? selectedConv.participants[0]?.name : 'User'}
                        size="md"
                      />
                      <div>
                        {(() => {
                          const display = getConversationDisplay(selectedConv);
                          return (
                            <>
                              <h3 className="font-semibold text-neutral-900">
                                {display.primary}
                              </h3>
                              <p className="text-sm text-neutral-500">
                                {display.secondary}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Admin Monitoring
                      </Badge>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
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
                      <p>No messages in this conversation.</p>
                    </div>
                  ) : (
                    messages.map((msg: any) => {
                      const senderDisplay = formatDisplayName(msg.sender);
                      return (
                        <div
                          key={msg.id}
                          className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-50"
                        >
                          <div className="flex-shrink-0">
                            <ProfileImage 
                              user={msg.sender}
                              alt={msg.sender?.name}
                              size="sm"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm text-neutral-900">
                                {senderDisplay.primary}
                              </span>
                              <Badge 
                                className={`text-xs ${
                                  msg.sender.userType === 'ARTIST' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {senderDisplay.type}
                              </Badge>
                              <span className="text-xs text-neutral-500">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-700">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Admin Notice */}
                <div className="p-4 border-t border-neutral-200 bg-yellow-50">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      <strong>Admin View:</strong> You are monitoring this conversation. Messages are not marked as read by your viewing.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Choose a conversation from the list to monitor messages
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}