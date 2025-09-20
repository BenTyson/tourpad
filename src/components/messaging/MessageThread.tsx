import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProfileImage } from '@/components/ui/ProfileImage';
import { ProfileImageWithStatus, OnlineStatusIndicator } from '@/components/ui/OnlineStatusIndicator';
import { LoadingSpinner } from '@/components/ui/Loading';
import { TypingIndicator } from '@/components/ui/TypingIndicator';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    profileImageUrl?: string;
  };
  attachment?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  };
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    type?: string;
    profileImageUrl?: string;
  }>;
}

interface MessageThreadProps {
  conversation: Conversation | null;
  messages: Message[];
  loadingMessages: boolean;
  currentUserId: string;
  typingUsers: Array<{ id: string; name: string }>;
  isUserOnline: (userId: string) => boolean;
  formatDisplayName: (participant: any) => {
    primary: string;
    secondary: string;
  };
  renderAttachment: (message: Message) => React.ReactNode;
}

export function MessageThread({
  conversation,
  messages,
  loadingMessages,
  currentUserId,
  typingUsers,
  isUserOnline,
  formatDisplayName,
  renderAttachment
}: MessageThreadProps) {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Select a conversation</h3>
          <p className="text-neutral-500">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  const participant = conversation.participants.length > 0 ? conversation.participants[0] : null;
  const displayName = participant ? formatDisplayName(participant) : { primary: 'Unknown', secondary: '' };
  const isOnline = participant ? isUserOnline(participant.id) : false;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Thread Header */}
      <div className="p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ProfileImageWithStatus isOnline={isOnline}>
              <ProfileImage
                user={participant}
                alt={participant?.name || 'User'}
                size="md"
              />
            </ProfileImageWithStatus>
            <div>
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
          messages.map((msg: Message) => {
            const isOwnMessage = msg.senderId === currentUserId;
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
                  {renderAttachment(msg)}
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
                    user={{
                      id: currentUserId,
                      name: 'You',
                      profileImageUrl: ''
                    }}
                    alt="You"
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
    </div>
  );
}