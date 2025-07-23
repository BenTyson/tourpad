import React from 'react';
import { User } from 'lucide-react';
import { resolveProfileImageUrl } from '@/lib/profileImageUtils';

interface ProfileImageProps {
  src?: string | null;
  user?: any; // User object with all profile data
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10', 
  lg: 'w-12 h-12'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export function ProfileImage({ src, user, alt = 'Profile', size = 'md', className = '' }: ProfileImageProps) {
  const [imageError, setImageError] = React.useState(false);
  
  // Resolve the correct profile image URL
  const resolvedImageUrl = src || (user ? resolveProfileImageUrl(user) : null);
  
  if (!resolvedImageUrl || imageError) {
    return (
      <div className={`${sizeClasses[size]} bg-[var(--color-sage)] rounded-full flex items-center justify-center ${className}`}>
        <User className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }
  
  return (
    <img
      src={resolvedImageUrl}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
}