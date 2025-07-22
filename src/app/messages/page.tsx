'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockMessages } from '@/data/mockData';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please sign in to access your messages.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter messages for current user
  const userMessages = mockMessages.filter(msg => 
    msg.senderId === session.user.id || msg.recipientId === session.user.id
  );

  // Group messages by conversation
  const conversations = userMessages.reduce((acc, msg) => {
    const otherUserId = msg.senderId === session.user.id ? msg.recipientId : msg.senderId;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(msg);
    return acc;
  }, {} as Record<string, typeof userMessages>);

  // Sort conversations by most recent message
  const sortedConversations = Object.entries(conversations).sort(([, a], [, b]) => {
    const latestA = Math.max(...a.map(msg => new Date(msg.timestamp).getTime()));
    const latestB = Math.max(...b.map(msg => new Date(msg.timestamp).getTime()));
    return latestB - latestA;
  });

  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(new Date(timestamp));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Communicate with hosts and artists</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                  Conversations
                </h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {sortedConversations.length > 0 ? (
                    sortedConversations.map(([otherUserId, messages]) => {
                      const latestMessage = messages.sort((a, b) => 
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                      )[0];
                      const unreadCount = messages.filter(msg => 
                        !msg.read && msg.recipientId === session.user.id
                      ).length;
                      
                      return (
                        <button
                          key={otherUserId}
                          onClick={() => setSelectedConversation(otherUserId)}
                          className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                            selectedConversation === otherUserId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-3">
                              <UserCircleIcon className="w-8 h-8 text-gray-400" />
                              <span className="font-medium text-gray-900">{latestMessage.senderName}</span>
                            </div>
                            {unreadCount > 0 && (
                              <Badge variant="default" className="bg-blue-600 text-white">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {latestMessage.content}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(latestMessage.timestamp.toISOString())}
                          </p>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                      <p className="text-gray-600">Start a conversation by booking a venue or artist</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Message Header */}
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="w-8 h-8 text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {conversations[selectedConversation]?.[0]?.senderName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {session.user.type === 'host' ? 'Artist' : 'Host'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0 overflow-y-auto">
                    <div className="p-4 space-y-4">
                      {conversations[selectedConversation]
                        ?.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                        .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === session.user.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === session.user.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp.toISOString())}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newMessage.trim()) {
                            // TODO: Implement message sending
                            console.log('Send message:', newMessage);
                            setNewMessage('');
                          }
                        }}
                      />
                      <Button 
                        size="sm"
                        disabled={!newMessage.trim()}
                        onClick={() => {
                          if (newMessage.trim()) {
                            // TODO: Implement message sending
                            console.log('Send message:', newMessage);
                            setNewMessage('');
                          }
                        }}
                      >
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the left to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <EnvelopeIcon className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800">Demo Mode</h4>
              <p className="text-sm text-yellow-700">
                This is a preview of the messaging system. In the full version, you'll be able to send and receive real messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}