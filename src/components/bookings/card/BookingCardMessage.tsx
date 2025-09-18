'use client';
import { MessageSquare } from 'lucide-react';

interface BookingCardMessageProps {
  artistMessage?: string | null;
}

export function BookingCardMessage({ artistMessage }: BookingCardMessageProps) {
  if (!artistMessage) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-white border border-neutral-200 rounded-md">
      <div className="flex items-start space-x-2">
        <MessageSquare className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-700">Artist Message:</p>
          <p className="text-sm text-neutral-600 mt-1">{artistMessage}</p>
        </div>
      </div>
    </div>
  );
}