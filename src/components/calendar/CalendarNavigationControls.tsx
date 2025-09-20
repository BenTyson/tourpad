'use client';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CalendarNavigationControlsProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  eventCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarNavigationControls({
  currentDate,
  onDateChange,
  eventCount,
  showFilters,
  onToggleFilters
}: CalendarNavigationControlsProps) {
  const handlePreviousMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousMonth}
          className="hover:bg-primary-50 hover:text-primary-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 min-w-0">
          {/* Show short month name on mobile */}
          <span className="sm:hidden">{monthNames[currentDate.getMonth()].substring(0, 3)} {currentDate.getFullYear()}</span>
          <span className="hidden sm:block">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="hover:bg-primary-50 hover:text-primary-700"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFilters}
          className="hover:bg-primary-50 hover:text-primary-700"
        >
          <Filter className="w-4 h-4 mr-1" />
          <span className="hidden sm:block">Filters</span>
        </Button>
        <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 text-xs sm:text-sm">
          {/* Show shortened count on mobile */}
          <span className="sm:hidden">{eventCount}</span>
          <span className="hidden sm:block">{eventCount} {eventCount === 1 ? 'event' : 'events'}</span>
        </Badge>
      </div>
    </div>
  );
}