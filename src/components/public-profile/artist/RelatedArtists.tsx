'use client';
import Link from 'next/link';
import { Music, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface RelatedArtist {
  id: string;
  name: string;
  location: string;
  bio?: string;
  rating?: number;
  bandMembers?: any[];
}

interface RelatedArtistsProps {
  artists: RelatedArtist[];
}

export default function RelatedArtists({ artists }: RelatedArtistsProps) {
  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-neutral-50 to-secondary-50 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">Similar Artists</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {artists.map(relatedArtist => (
          <Link key={relatedArtist.id} href={`/artists/${relatedArtist.id}`}>
            <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {relatedArtist.name}
                    </h3>
                    <p className="text-sm text-neutral-600">{relatedArtist.location}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 line-clamp-2">{relatedArtist.bio || 'Professional musician'}</p>
                <div className="flex items-center mt-4 text-sm text-neutral-600">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{relatedArtist.rating || 'N/A'}</span>
                  <span className="mx-2">•</span>
                  <span>{relatedArtist.bandMembers?.length || 1} member{(relatedArtist.bandMembers?.length || 1) > 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}