'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ApplicationFilters } from '@/components/admin/ApplicationFilters';
import { ApplicationCard } from '@/components/admin/ApplicationCard';
import { PhotoLightbox } from '@/components/admin/PhotoLightbox';

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  status: string;
  createdAt: string;
  profile?: {
    bio?: string;
    phone?: string;
    socialLinks?: any;
  };
}

interface MediaItem {
  fileUrl: string;
  title?: string;
}

interface Host extends User {
  host?: {
    city: string;
    state: string;
    venueType: string;
    venueName?: string;
    venueDescription?: string;
    indoorCapacity?: number;
    outdoorCapacity?: number;
    venuePhotoUrl?: string;
    applicationSubmittedAt?: string;
    media?: MediaItem[];
    lodgingDetails?: any;
  };
}

interface Artist extends User {
  artist?: {
    stageName?: string;
    genres: string[];
    performanceVideoUrl?: string;
    pressPhotoUrl?: string;
    applicationSubmittedAt?: string;
    media?: MediaItem[];
    bandMembers?: any[];
  };
}

type Application = Host | Artist;

// Helper function to convert video URLs to embed format
const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return null;
};


export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'host' | 'artist'>('all');
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photos: MediaItem[], startIndex: number) => {
    setSelectedPhotos(photos);
    setCurrentPhotoIndex(startIndex);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedPhotos([]);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length);
  };

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${userId}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${userId}/reject`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.userType.toLowerCase() === filter;
  });

  const applicationCounts = {
    all: applications.length,
    host: applications.filter(a => a.userType.toLowerCase() === 'host').length,
    artist: applications.filter(a => a.userType.toLowerCase() === 'artist').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-transparent hover:bg-neutral-100 rounded-md transition-colors">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Admin
                </button>
              </Link>
              <div className="h-6 w-px bg-neutral-200"></div>
              <h1 className="text-xl font-semibold text-neutral-900">Applications</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Filters */}
        <ApplicationFilters
          filter={filter}
          onFilterChange={setFilter}
          applicationCounts={applicationCounts}
        />

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No pending applications at this time.' 
                  : `No pending ${filter} applications at this time.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onApprove={handleApprove}
                onReject={handleReject}
                onPhotoClick={openLightbox}
                getVideoEmbedUrl={getVideoEmbedUrl}
              />
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <PhotoLightbox
          isOpen={showLightbox}
          photos={selectedPhotos}
          currentIndex={currentPhotoIndex}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
      </div>
    </div>
  );
}