import React, { useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface MessageComposerProps {
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
  formatFileSize: (size: number) => string;
  disabled?: boolean;
  placeholder?: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function MessageComposer({
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
  formatFileSize,
  disabled = false,
  placeholder = "Type a message...",
  fileInputRef
}: MessageComposerProps) {
  const isDisabled = disabled || sendingMessage || uploadingFile;
  const canSend = (messageText.trim() || selectedFile) && !isDisabled;

  return (
    <div className="p-4 border-t border-neutral-200 bg-white">
      {/* File attachment preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--color-sage)]/20 rounded flex items-center justify-center">
                <Paperclip className="w-4 h-4 text-[var(--color-french-blue)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-evergreen)]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[var(--color-french-blue)]">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onRemoveFile}
              className="text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              disabled={uploadingFile}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={onSendMessage} className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileChange}
          accept="image/*,application/pdf,.txt,.doc,.docx"
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFileSelect}
          disabled={isDisabled}
          className="text-neutral-600 border-neutral-200 hover:bg-neutral-50"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <Input
          value={messageText}
          onChange={(e) => {
            onMessageChange(e.target.value);
            onTyping();
          }}
          placeholder={placeholder}
          disabled={isDisabled}
          className="flex-1 border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent rounded-lg"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (canSend) {
                onSendMessage(e as any);
              }
            }
          }}
        />

        <Button
          type="submit"
          disabled={!canSend}
          className="bg-[var(--color-french-blue)] hover:bg-[var(--color-french-blue)]/90 text-white"
        >
          {sendingMessage || uploadingFile ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}