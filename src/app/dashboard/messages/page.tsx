'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/Loading';
import MessagesHeader from '@/components/dashboard/MessagesHeader';
import {
  ConversationList,
  MessageThread,
  MessageComposer,
  NewConversation
} from '@/components/messaging';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Refs for managing input focus and typing state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number>(0);

  // Mock online status and typing users for demo
  const [onlineUsers] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [typingUsers] = useState<Array<{ id: string; name: string }>>([]);

  // Utility functions
  const isUserOnline = (userId: string): boolean => onlineUsers.has(userId);

  const formatDisplayName = (participant: any) => {
    if (!participant) return { primary: 'Unknown', secondary: '' };

    const userType = participant.type || 'user';
    return {
      primary: participant.name || 'Unknown User',
      secondary: userType === 'artist' ? 'Artist' : userType === 'host' ? 'Host' : 'Fan'
    };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderAttachment = (message: any) => {
    if (!message.attachment) return null;

    const { fileName, fileUrl, fileType } = message.attachment;
    const isImage = fileType?.startsWith('image/');

    if (isImage) {
      return (
        <div className="mt-2">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-xs rounded-lg border border-neutral-200"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className="mt-2 p-2 bg-black/10 rounded border border-neutral-200">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          📎 {fileName}
        </a>
      </div>
    );
  };

  // Data fetching functions
  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchUserById = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    return null;
  };

  // Event handlers
  const handleConversationSelect = (conversationId: string) => {
    setStartConversationUserId(null);
    setNewConversationRecipient(null);
    setSelectedConversation(conversationId);
    window.history.replaceState({}, '', '/dashboard/messages');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((!messageText.trim() && !selectedFile) || sendingMessage) return;

    if (startConversationUserId) {
      // Handle new conversation
      setSendingMessage(true);
      try {
        const response = await fetch('/api/messages/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: startConversationUserId,
            content: messageText
          })
        });

        if (response.ok) {
          const newConversation = await response.json();
          setStartConversationUserId(null);
          setNewConversationRecipient(null);
          setSelectedConversation(newConversation.id);
          setMessageText('');
          await fetchConversations();
        }
      } catch (error) {
        console.error('Error creating conversation:', error);
      } finally {
        setSendingMessage(false);
      }
    } else if (selectedConversation) {
      // Handle existing conversation
      if (selectedFile) {
        await sendFileAttachment(selectedFile, messageText);
      } else {
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

          if (response.ok) {
            const newMessage = await response.json();
            setMessages([...messages, newMessage]);
            setMessageText('');
            await fetchConversations();
          }
        } catch (error) {
          console.error('Error sending message:', error);
        } finally {
          setSendingMessage(false);
        }
      }
    }
  };

  const sendFileAttachment = async (file: File, messageContent?: string) => {
    if (!selectedConversation || uploadingFile) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', selectedConversation);
      if (messageContent) {
        formData.append('content', messageContent);
      }

      const response = await fetch('/api/messages/attachment', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data]);
        setSelectedFile(null);
        setMessageText('');

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        await fetchConversations();
      }
    } catch (error) {
      console.error('Error sending attachment:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTyping = () => {
    const now = Date.now();
    lastTypingTimeRef.current = now;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (Date.now() - lastTypingTimeRef.current >= 1000) {
        // Stop typing indicator
      }
    }, 1000);
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      if (status === 'loading') return;

      setLoading(true);

      // Check URL parameters for starting a new conversation
      const hostIdParam = searchParams.get('hostId');
      const artistIdParam = searchParams.get('artistId');
      const userIdParam = searchParams.get('userId');

      const targetUserId = hostIdParam || artistIdParam || userIdParam;

      if (targetUserId) {
        setStartConversationUserId(targetUserId);
        const user = await fetchUserById(targetUserId);
        if (user) {
          setNewConversationRecipient(user);
        }
      }

      await fetchConversations();
      setLoading(false);
    };

    initializeData();
  }, [status, searchParams]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-white">
        <MessagesHeader />
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-white">
      <MessagesHeader />

      <div className="flex h-[calc(100vh-4.5rem)] bg-white">
        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onConversationSelect={handleConversationSelect}
          isUserOnline={isUserOnline}
          formatDisplayName={formatDisplayName}
        />

        {/* Message Thread or New Conversation */}
        {startConversationUserId && newConversationRecipient ? (
          <NewConversation
            recipient={newConversationRecipient}
            messageText={messageText}
            selectedFile={selectedFile}
            sendingMessage={sendingMessage}
            uploadingFile={uploadingFile}
            onMessageChange={setMessageText}
            onSendMessage={handleSendMessage}
            onFileSelect={handleFileSelect}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            onTyping={handleTyping}
            onCancel={() => {
              setStartConversationUserId(null);
              setNewConversationRecipient(null);
              router.push('/dashboard/messages');
            }}
            formatFileSize={formatFileSize}
            formatDisplayName={formatDisplayName}
            fileInputRef={fileInputRef}
          />
        ) : selectedConv ? (
          <div className="flex-1 flex flex-col">
            <MessageThread
              conversation={selectedConv}
              messages={messages}
              loadingMessages={loadingMessages}
              currentUserId={session?.user?.id || ''}
              typingUsers={typingUsers}
              isUserOnline={isUserOnline}
              formatDisplayName={formatDisplayName}
              renderAttachment={renderAttachment}
            />
            <MessageComposer
              messageText={messageText}
              selectedFile={selectedFile}
              sendingMessage={sendingMessage}
              uploadingFile={uploadingFile}
              onMessageChange={setMessageText}
              onSendMessage={handleSendMessage}
              onFileSelect={handleFileSelect}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              onTyping={handleTyping}
              formatFileSize={formatFileSize}
              fileInputRef={fileInputRef}
            />
          </div>
        ) : (
          <MessageThread
            conversation={null}
            messages={[]}
            loadingMessages={false}
            currentUserId={session?.user?.id || ''}
            typingUsers={[]}
            isUserOnline={isUserOnline}
            formatDisplayName={formatDisplayName}
            renderAttachment={renderAttachment}
          />
        )}
      </div>
    </div>
  );
}