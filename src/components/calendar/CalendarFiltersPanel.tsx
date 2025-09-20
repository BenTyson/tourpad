'use client';
import { Button } from '@/components/ui/Button';

interface CalendarFiltersPanelProps {
  statusFilter: string;
  typeFilter: 'all' | 'booking' | 'concert';
  onStatusFilterChange: (status: string) => void;
  onTypeFilterChange: (type: 'all' | 'booking' | 'concert') => void;
  onClearFilters: () => void;
}

export function CalendarFiltersPanel({
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange,
  onClearFilters
}: CalendarFiltersPanelProps) {
  return (
    <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Event Type</label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as 'all' | 'booking' | 'concert')}
            className="w-full p-2 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            <option value="booking">Bookings</option>
            <option value="concert">Concerts</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}