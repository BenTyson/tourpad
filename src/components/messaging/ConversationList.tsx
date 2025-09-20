import React from 'react';
import { MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ProfileImage } from '@/components/ui/ProfileImage';
import { ProfileImageWithStatus } from '@/components/ui/OnlineStatusIndicator';

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    type?: string;
    profileImageUrl?: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount?: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onConversationSelect: (conversationId: string) => void;
  isUserOnline: (userId: string) => boolean;
  formatDisplayName: (participant: any) => {
    primary: string;
    secondary: string;
  };
}

export function ConversationList({
  conversations,
  selectedConversation,
  searchTerm,
  onSearchChange,
  onConversationSelect,
  isUserOnline,
  formatDisplayName
}: ConversationListProps) {
  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    return conv.participants.some(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="w-full sm:w-1/3 lg:w-1/4 border-r border-neutral-200 flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent rounded-lg"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">
              {searchTerm ? 'No conversations found' : 'No messages yet'}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {searchTerm ? 'Try a different search term' : 'Start a conversation with an artist or host'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const participant = conv.participants.length > 0 ? conv.participants[0] : null;
            const displayName = participant ? formatDisplayName(participant) : { primary: 'Unknown', secondary: '' };
            const isOnline = participant ? isUserOnline(participant.id) : false;

            return (
              <button
                key={conv.id}
                onClick={() => onConversationSelect(conv.id)}
                className={`w-full p-4 border-b border-[var(--color-sage)]/20 hover:bg-[var(--color-mist)]/50 transition-colors text-left ${
                  selectedConversation === conv.id ? 'bg-[var(--color-mist)] border-l-4 border-l-[var(--color-french-blue)]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <ProfileImageWithStatus isOnline={isOnline}>
                      <ProfileImage
                        user={participant}
                        alt={participant?.name || 'User'}
                        size="md"
                      />
                    </ProfileImageWithStatus>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-neutral-900 truncate">
                          {displayName.primary}
                        </h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-neutral-400 ml-2">
                            {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 truncate">
                        {displayName.secondary}
                      </p>
                    </div>
                  </div>
                  {(conv.unreadCount || 0) > 0 && (
                    <div className="bg-[var(--color-french-blue)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                {conv.lastMessage && (
                  <div className="mt-2">
                    <p className="text-sm text-neutral-600 truncate">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}