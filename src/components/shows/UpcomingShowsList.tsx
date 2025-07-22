'use client';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import ShowCard, { ShowData } from './ShowCard';
import { LoadingSpinner } from '@/components/ui/Loading';

interface UpcomingShowsListProps {
  viewType: 'artist' | 'host' | 'admin';
  className?: string;
}

export default function UpcomingShowsList({ viewType, className = '' }: UpcomingShowsListProps) {
  const [shows, setShows] = useState<ShowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setError(null);
      const response = await fetch('/api/shows');
      
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      
      const data = await response.json();
      setShows(data.shows || []);
    } catch (err) {
      console.error('Error fetching shows:', err);
      setError(err instanceof Error ? err.message : 'Failed to load shows');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center py-12`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} text-center py-12`}>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (shows.length === 0) {
    return (
      <div className={`${className} text-center py-12`}>
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          No upcoming shows
        </h3>
        <p className="text-neutral-600">
          {viewType === 'artist' 
            ? 'Your confirmed shows will appear here'
            : viewType === 'host'
            ? 'Shows at your venue will appear here once confirmed'
            : 'All confirmed shows will appear here'
          }
        </p>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      {shows.map((show) => (
        <ShowCard
          key={show.id}
          show={show}
          viewType={viewType}
        />
      ))}
    </div>
  );
}