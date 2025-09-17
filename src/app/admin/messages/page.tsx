'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  ArrowLeft,
  Search,
  User,
  Music,
  Home,
  AlertTriangle,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { ProfileImage } from '@/components/ui/ProfileImage';
import { OnlineStatusIndicator, ProfileImageWithStatus } from '@/components/ui/OnlineStatusIndicator';
// import { useRealtimeMessaging } from '@/hooks/useRealtimeMessaging'; // Temporarily disabled

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'artist' | 'host' | 'flagged'>('all');

  // Temporarily disabled real-time messaging for stability testing
  const newMessages: any[] = [];
  const updatedConversations: any[] = [];
  const onlineStatus: any = {};

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (session.user?.type?.toLowerCase() !== 'admin') {
      router.push('/admin');
      return;
    }

    fetchConversations();
  }, [session, status, router]);

  // Update conversations when real-time data comes in
  useEffect(() => {
    if (updatedConversations && updatedConversations.length > 0) {
      setConversations(prev => {
        const updated = [...prev];
        updatedConversations.forEach((updatedConv: any) => {
          const index = updated.findIndex(c => c.id === updatedConv.id);
          if (index >= 0) {
            updated[index] = { ...updated[index], ...updatedConv };
          }
        });
        return updated;
      });
    }
  }, [updatedConversations]);

  // Update messages when new real-time messages come in
  useEffect(() => {
    if (newMessages && newMessages.length > 0 && selectedConversation) {
      const relevantMessages = newMessages.filter(msg => msg.conversationId === selectedConversation);
      if (relevantMessages.length > 0) {
        setMessages(prev => {
          const existing = new Set(prev.map(m => m.id));
          const fresh = relevantMessages.filter(m => !existing.has(m.id));
          return [...prev, ...fresh];
        });
      }
    }
  }, [newMessages, selectedConversation]);

  async function fetchConversations() {
    try {
      setLoading(true);
      const response = await fetch('/api/conversations');
      
      if (!response.ok) {
        console.error('Failed to fetch conversations:', response.status);
        return;
      }
      
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(conversationId: string) {
    try {
      setLoadingMessages(true);
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      
      if (!response.ok) {
        console.error('Failed to fetch messages:', response.status);
        return;
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }

  function handleConversationSelect(conversationId: string) {
    setSelectedConversation(conversationId);
    fetchMessages(conversationId);
  }

  function formatDisplayName(participant: any): string {
    if (!participant) return 'Unknown User';
    
    if (participant.name) {
      return participant.name;
    }
    
    if (participant.user?.name) {
      return participant.user.name;
    }
    
    return 'Unknown User';
  }


  function getUserTypeBadge(userType: string) {
    const type = userType?.toLowerCase();
    const colors = {
      artist: 'bg-purple-100 text-purple-800',
      host: 'bg-green-100 text-green-800',
      fan: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={`${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'} text-xs`}>
        {type || 'unknown'}
      </Badge>
    );
  }

  // Filter conversations based on search and filter type
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' || 
      conv.participants?.some((p: any) => 
        formatDisplayName(p).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'artist') return matchesSearch && conv.participants?.some((p: any) => p.user?.userType === 'ARTIST');
    if (filterType === 'host') return matchesSearch && conv.participants?.some((p: any) => p.user?.userType === 'HOST');
    if (filterType === 'flagged') return matchesSearch && conv.flagged;
    
    return matchesSearch;
  });

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
              <div className="h-6 w-px bg-neutral-200"></div>
              <h1 className="text-xl font-semibold text-neutral-900">Messages</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live monitoring
              </div>
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => fetchConversations()}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-73px)] flex">
        
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-neutral-200 flex flex-col">
          {/* Search & Filters */}
          <div className="p-4 border-b border-neutral-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-neutral-200 focus:border-neutral-300 focus:ring-1 focus:ring-neutral-300"
              />
            </div>
            
            <div className="flex space-x-1">
              {(['all', 'artist', 'host', 'flagged'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={filterType === filter ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterType(filter)}
                  className={`text-xs capitalize px-3 py-1 ${
                    filterType === filter 
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {filter === 'flagged' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
                <p className="text-sm text-neutral-500">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-px">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation.id)}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-neutral-100'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {conversation.participants?.[0] && (
                          <ProfileImageWithStatus
                            isOnline={onlineStatus[conversation.participants[0].id] || false}
                          >
                            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs">
                              {formatDisplayName(conversation.participants[0]).charAt(0)}
                            </div>
                          </ProfileImageWithStatus>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-neutral-900 truncate text-sm">
                            {conversation.participants?.map((p: any) => formatDisplayName(p)).join(' & ')}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">
                              {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          {conversation.participants?.map((p: any) => (
                            <div key={p.id} className="flex items-center">
                              {getUserTypeBadge(p.userType)}
                            </div>
                          ))}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-xs text-neutral-500 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                        {conversation.flagged && (
                          <div className="mt-2">
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Flagged
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-neutral-200 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {selectedConversationData?.participants?.map((p: any) => (
                        <ProfileImage
                          key={p.id}
                          user={p}
                          alt={formatDisplayName(p)}
                          size="sm"
                          className="ring-2 ring-white"
                        />
                      ))}
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900 text-sm">
                        {selectedConversationData?.participants?.map((p: any) => formatDisplayName(p)).join(' & ')}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        {selectedConversationData?.participants?.map((p: any) => (
                          <div key={p.id} className="flex items-center space-x-1">
                            <span className="text-xs text-neutral-500">{p.userType?.toLowerCase()}</span>
                            <OnlineStatusIndicator
                              isOnline={onlineStatus[p.id] || false}
                              showLabel={true}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin view
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="md" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
                      <p className="text-sm text-neutral-500">No messages yet</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => {
                      const sender = selectedConversationData?.participants?.find(
                        (p: any) => p.id === message.senderId
                      );
                      
                      return (
                        <div key={message.id} className="flex items-start space-x-3">
                          <ProfileImage
                            user={sender}
                            alt={formatDisplayName(sender)}
                            size="sm"
                            className="mt-0.5"
                          />
                          <div className="flex-grow">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-neutral-900 text-sm">
                                {formatDisplayName(sender)}
                              </span>
                              {getUserTypeBadge(sender?.userType)}
                              <span className="text-xs text-neutral-400">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-neutral-100 rounded-lg px-4 py-2 max-w-lg">
                              <p className="text-sm text-neutral-900">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Admin Notice */}
              <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
                <div className="flex items-center text-xs text-neutral-600">
                  <Shield className="w-3 h-3 mr-2" />
                  Admin monitoring - Read-only view for platform oversight
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                <h3 className="font-medium text-neutral-900 mb-2">Select a conversation</h3>
                <p className="text-sm text-neutral-500">Choose a conversation to monitor messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}