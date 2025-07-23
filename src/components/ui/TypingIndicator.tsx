import React from 'react';

interface TypingUser {
  userId: string;
  userName: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  className?: string;
}

export function TypingIndicator({ typingUsers, className = '' }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
    } else {
      return `${typingUsers[0].userName} and ${typingUsers.length - 1} others are typing...`;
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm text-neutral-500 ${className}`}>
      <div className="flex space-x-1">
        <div className="typing-dot bg-neutral-400 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="typing-dot bg-neutral-400 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="typing-dot bg-neutral-400 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="italic">{getTypingText()}</span>
    </div>
  );
}

// CSS for custom typing animation (to be added to globals.css)
export const typingIndicatorStyles = `
  @keyframes typing-bounce {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
  
  .typing-dot {
    animation: typing-bounce 1.4s infinite ease-in-out;
  }
`;