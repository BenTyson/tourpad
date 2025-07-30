'use client';
import Link from 'next/link';
import { ArrowLeft, Eye, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Session } from 'next-auth';

interface ProfileHeaderProps {
  isArtist: boolean;
  session: Session;
  hasChanges: boolean;
  loading: boolean;
  onSave: () => void;
}

export default function ProfileHeader({ 
  isArtist, 
  session, 
  hasChanges, 
  loading, 
  onSave 
}: ProfileHeaderProps) {
  // Generate preview URL based on user type
  const previewUrl = isArtist 
    ? `/artists/${session.user.artist?.id || session.user.id}`
    : `/hosts/cmd8zfdyf000aluf9h4l2k90w`; // Default host ID for now

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Profile</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <Link href={previewUrl} target="_blank">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </Link>
        {hasChanges && (
          <>
            <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Unsaved
            </Badge>
            <Button onClick={onSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}