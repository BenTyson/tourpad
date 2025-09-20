import React from 'react';
import { Button } from '@/components/ui/Button';
import { ProfileImage } from '@/components/ui/ProfileImage';
import { MessageComposer } from './MessageComposer';

interface NewConversationProps {
  recipient: {
    id: string;
    name: string;
    type?: string;
    profileImageUrl?: string;
  };
  messageText: string;
  selectedFile: File | null;
  sendingMessage: boolean;
  uploadingFile: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onFileSelect: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onTyping: () => void;
  onCancel: () => void;
  formatFileSize: (size: number) => string;
  formatDisplayName: (participant: any) => {
    primary: string;
    secondary: string;
  };
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function NewConversation({
  recipient,
  messageText,
  selectedFile,
  sendingMessage,
  uploadingFile,
  onMessageChange,
  onSendMessage,
  onFileSelect,
  onFileChange,
  onRemoveFile,
  onTyping,
  onCancel,
  formatFileSize,
  formatDisplayName,
  fileInputRef
}: NewConversationProps) {
  const displayName = formatDisplayName(recipient);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* New Conversation Header */}
      <div className="p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ProfileImage
              user={recipient}
              alt={recipient.name}
              size="md"
            />
            <div>
              <h3 className="font-semibold text-neutral-900">
                {displayName.primary}
              </h3>
              <p className="text-sm text-neutral-500">
                {displayName.secondary}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="p-4">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-[var(--color-french-blue)] mb-2">
              Start a conversation
            </h4>
            <p className="text-sm text-neutral-600">
              Send a message to {recipient.name} to start your conversation.
            </p>
          </div>
        </div>

        {/* Message Composer */}
        <MessageComposer
          messageText={messageText}
          selectedFile={selectedFile}
          sendingMessage={sendingMessage}
          uploadingFile={uploadingFile}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onFileSelect={onFileSelect}
          onFileChange={onFileChange}
          onRemoveFile={onRemoveFile}
          onTyping={onTyping}
          formatFileSize={formatFileSize}
          placeholder={`Send a message to ${recipient.name}...`}
          fileInputRef={fileInputRef}
        />
      </div>
    </div>
  );
}