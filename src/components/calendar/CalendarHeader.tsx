'use client';
import Link from 'next/link';
import { ArrowLeft, Grid3X3, Calendar as CalendarIcon, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type ViewMode = 'month' | 'week' | 'list';

interface CalendarHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function CalendarHeader({ viewMode, onViewModeChange }: CalendarHeaderProps) {
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
            <h1 className="text-xl font-semibold text-neutral-900">Calendar</h1>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border border-neutral-200 bg-white p-1">
              <Button
                variant={viewMode === 'month' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('month')}
                className={viewMode === 'month' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('week')}
                className={viewMode === 'week' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
              >
                <CalendarIcon className="w-4 h-4 mr-1" />
                Week
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className={viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}