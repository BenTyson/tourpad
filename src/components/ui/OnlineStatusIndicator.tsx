import React from 'react';

interface OnlineStatusIndicatorProps {
  isOnline: boolean;
  lastSeen?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function OnlineStatusIndicator({ 
  isOnline, 
  lastSeen, 
  showLabel = false, 
  size = 'sm',
  className = '' 
}: OnlineStatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const getLastSeenText = () => {
    if (!lastSeen) return 'Last seen unknown';
    
    const now = Date.now();
    const diff = now - lastSeen;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Active now';
    if (minutes < 60) return `Active ${minutes}m ago`;
    if (hours < 24) return `Active ${hours}h ago`;
    return `Active ${days}d ago`;
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="relative">
        <div 
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            ${isOnline 
              ? 'bg-green-500 shadow-sm' 
              : 'bg-neutral-400'
            }
            ${isOnline ? 'animate-pulse' : ''}
          `}
        />
        {isOnline && (
          <div 
            className={`
              absolute inset-0 
              ${sizeClasses[size]} 
              rounded-full 
              bg-green-500 
              animate-ping 
              opacity-75
            `}
          />
        )}
      </div>
      
      {showLabel && (
        <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-neutral-500'}`}>
          {isOnline ? 'Online' : getLastSeenText()}
        </span>
      )}
    </div>
  );
}

// Utility component for displaying online status in profile images
export function ProfileImageWithStatus({ 
  children, 
  isOnline, 
  className = '' 
}: { 
  children: React.ReactNode; 
  isOnline: boolean; 
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute -bottom-0.5 -right-0.5">
        <OnlineStatusIndicator isOnline={isOnline} size="md" />
      </div>
    </div>
  );
}