// Tour planner header component
'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TourPlannerHeaderProps {
  showCreateButton: boolean;
  onCreateTour: () => void;
}

export function TourPlannerHeader({
  showCreateButton,
  onCreateTour
}: TourPlannerHeaderProps) {
  return (
    <div className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-[var(--color-mist)] hover:text-[var(--color-french-blue)]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <h1 className="text-xl font-semibold text-neutral-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-[var(--color-french-blue)]" />
            Tour Planner
          </h1>

          <div className="flex items-center">
            {showCreateButton && (
              <Button
                onClick={onCreateTour}
                className="bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Plan New Tour
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}