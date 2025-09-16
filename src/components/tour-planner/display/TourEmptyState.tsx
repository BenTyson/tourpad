// Empty state when no tours exist
'use client';

import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface TourEmptyStateProps {
  onCreateTour: () => void;
}

export function TourEmptyState({ onCreateTour }: TourEmptyStateProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-[var(--color-french-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-[var(--color-french-blue)]" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            No Tours Planned Yet
          </h2>
          <p className="text-neutral-600 max-w-md mx-auto mb-8">
            Start planning your tours to let hosts know when you'll be in their area.
            Hosts can discover and book you based on your tour schedule.
          </p>
          <Button
            onClick={onCreateTour}
            className="bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Plan Your First Tour
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}