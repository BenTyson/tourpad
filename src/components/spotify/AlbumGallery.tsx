'use client';

import { useState } from 'react';
import { ExternalLink, Music, Calendar, Disc } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SpotifyAlbum {
  id: string;
  spotifyId: string;
  name: string;
  albumType: string;
  releaseDate: string;
  imageUrl: string | null;
  spotifyUrl: string;
  totalTracks: number;
}

interface AlbumGalleryProps {
  albums: SpotifyAlbum[];
  artistName: string;
  className?: string;
  showAllByDefault?: boolean;
  maxInitialDisplay?: number;
}

export default function AlbumGallery({ 
  albums, 
  artistName, 
  className = '',
  showAllByDefault = false,
  maxInitialDisplay = 6
}: AlbumGalleryProps) {
  const [showAll, setShowAll] = useState(showAllByDefault);
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);

  if (albums.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Disc className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-500 mb-2">
          No Albums Found
        </h3>
        <p className="text-neutral-400">
          This artist hasn't released any albums on Spotify yet.
        </p>
      </div>
    );
  }

  const displayedAlbums = showAll ? albums : albums.slice(0, maxInitialDisplay);
  const hasMoreAlbums = albums.length > maxInitialDisplay;

  const getAlbumTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'album':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'single':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      case 'ep':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'compilation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Disc className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-neutral-900">
            Discography
          </h3>
          <Badge className="bg-neutral-100 text-neutral-700 border-neutral-200">
            {albums.length} {albums.length === 1 ? 'Release' : 'Releases'}
          </Badge>
        </div>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        {displayedAlbums.map((album) => (
          <div
            key={album.id}
            className="group relative"
            onMouseEnter={() => setHoveredAlbum(album.id)}
            onMouseLeave={() => setHoveredAlbum(null)}
          >
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-neutral-200 hover:border-primary-300">
              {/* Album Cover */}
              <div className="aspect-square relative bg-gradient-to-br from-neutral-100 to-neutral-200">
                {album.imageUrl ? (
                  <img
                    src={album.imageUrl}
                    alt={`${album.name} by ${artistName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-12 h-12 text-neutral-400" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div 
                  className={`absolute inset-0 bg-black transition-opacity duration-300 flex items-center justify-center ${
                    hoveredAlbum === album.id ? 'bg-opacity-60' : 'bg-opacity-0'
                  }`}
                >
                  <a
                    href={album.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                      hoveredAlbum === album.id 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <ExternalLink className="w-5 h-5 text-neutral-800" />
                  </a>
                </div>

                {/* Album Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge 
                    className={`text-xs font-medium border ${getAlbumTypeColor(album.albumType)}`}
                  >
                    {album.albumType.toUpperCase()}
                  </Badge>
                </div>

                {/* Track Count Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black bg-opacity-70 text-white text-xs border-none">
                    {album.totalTracks} {album.totalTracks === 1 ? 'track' : 'tracks'}
                  </Badge>
                </div>
              </div>

              {/* Album Info */}
              <CardContent className="p-3">
                <div className="space-y-2">
                  {/* Album Name */}
                  <h4 className="font-medium text-neutral-900 text-sm leading-tight line-clamp-2 group-hover:text-primary-700 transition-colors">
                    {album.name}
                  </h4>
                  
                  {/* Release Date */}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span className="text-xs text-neutral-600">
                      {formatReleaseDate(album.releaseDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreAlbums && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="border-neutral-300 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
          >
            <Disc className="w-4 h-4 mr-2" />
            {showAll 
              ? `Show Less` 
              : `Show All ${albums.length} Albums`
            }
          </Button>
        </div>
      )}

      {/* Album Statistics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {(() => {
          const albumTypes = albums.reduce((acc, album) => {
            acc[album.albumType] = (acc[album.albumType] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const totalTracks = albums.reduce((sum, album) => sum + album.totalTracks, 0);
          const latestRelease = albums.length > 0 
            ? albums.reduce((latest, album) => 
                new Date(album.releaseDate) > new Date(latest.releaseDate) ? album : latest
              )
            : null;

          return (
            <>
              {/* Total Albums */}
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <div className="flex items-center space-x-3">
                  <Disc className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="font-semibold text-primary-900">
                      {albums.length}
                    </div>
                    <div className="text-sm text-primary-700">
                      Total Releases
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Tracks */}
              <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-secondary-600" />
                  <div>
                    <div className="font-semibold text-secondary-900">
                      {totalTracks}
                    </div>
                    <div className="text-sm text-secondary-700">
                      Total Tracks
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Release */}
              {latestRelease && (
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-neutral-600" />
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {formatReleaseDate(latestRelease.releaseDate)}
                      </div>
                      <div className="text-sm text-neutral-700">
                        Latest Release
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Most Common Type */}
              {Object.keys(albumTypes).length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      {Object.entries(albumTypes)
                        .sort(([,a], [,b]) => b - a)[0][0]
                        .toUpperCase()}
                    </Badge>
                    <div>
                      <div className="font-semibold text-yellow-900">
                        {Object.entries(albumTypes)
                          .sort(([,a], [,b]) => b - a)[0][1]}
                      </div>
                      <div className="text-sm text-yellow-700">
                        Most Common
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}