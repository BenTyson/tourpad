import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  senderId: string;
  recipientId: string;
}

interface MessagingCenterProps {
  messages: Message[];
  currentUserId: string;
  className?: string;
}

export function MessagingCenter({
  messages,
  currentUserId,
  className = ''
}: MessagingCenterProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Recent Messages</h2>
          <p className="text-sm text-neutral-600 mt-1">Latest conversations</p>
        </div>
        <Link href="/dashboard/messages">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            View All
          </Button>
        </Link>
      </div>
      <div className="p-6">
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.slice(0, 3).map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg border transition-colors hover:bg-neutral-50 ${
                  !message.read && message.recipientId === currentUserId
                    ? 'bg-primary-50 border-primary-200'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-neutral-900">{message.senderName}</h4>
                  <span className="text-xs text-neutral-500">
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric'
                    }).format(new Date(message.timestamp))}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {message.content}
                </p>
                {!message.read && message.recipientId === currentUserId && (
                  <div className="mt-2">
                    <Button size="sm" variant="outline">Reply</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-sm text-neutral-600">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}