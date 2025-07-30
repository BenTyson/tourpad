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
    <div className="border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-transparent hover:bg-neutral-100 rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            </Link>
            <div className="h-6 w-px bg-neutral-200"></div>
            <h1 className="text-xl font-semibold text-neutral-900">Edit Profile</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={previewUrl} target="_blank">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-transparent hover:bg-neutral-100 rounded-md transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
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
      </div>
    </div>
  );
}