import React from 'react';
import {
  ArrowLeft,
  Share2,
  Heart,
  Copy,
  Mail,
  Twitter
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface HostProfileHeroProps {
  host: {
    id: string;
    name: string;
    city: string;
    state: string;
    venueName: string;
    venueType: string;
    rating: number;
    reviewCount: number;
  };
  isFollowing: boolean;
  showShareMenu: boolean;
  onToggleFollow: () => void;
  onToggleShare: () => void;
}

export function HostProfileHero({
  host,
  isFollowing,
  showShareMenu,
  onToggleFollow,
  onToggleShare
}: HostProfileHeroProps) {
  return (
    <>
      {/* Enhanced Navigation Bar with backdrop blur */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/hosts">
              <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to hosts
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary-50 hover:text-primary-700"
                  onClick={onToggleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <Copy className="w-4 h-4 mr-3" />
                      Copy Link
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <Mail className="w-4 h-4 mr-3" />
                      Email
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <Twitter className="w-4 h-4 mr-3" />
                      Twitter
                    </button>
                  </div>
                )}
              </div>
              <Button
                variant={isFollowing ? "primary" : "outline"}
                size="sm"
                className={isFollowing ? "bg-primary-600 hover:bg-primary-700" : "hover:bg-primary-50 hover:text-primary-700 hover:border-primary-400"}
                onClick={onToggleFollow}
              >
                <Heart className="w-4 h-4 mr-2" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}