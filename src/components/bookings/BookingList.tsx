'use client';
import { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  SortAsc,
  SortDesc,
  RefreshCw
} from 'lucide-react';
import BookingCard, { BookingData } from './BookingCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Loading';

interface BookingListProps {
  viewType: 'artist' | 'host' | 'admin';
  onStatusUpdate?: (bookingId: string, status: string, data?: any) => Promise<void>;
  onRefresh?: () => Promise<void>;
  className?: string;
}

type SortField = 'date' | 'status' | 'created';
type SortDirection = 'asc' | 'desc';

export default function BookingList({ 
  viewType, 
  onStatusUpdate, 
  onRefresh,
  className = '' 
}: BookingListProps) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setError(null);
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await fetchBookings();
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Filter and sort bookings
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.artistName.toLowerCase().includes(term) ||
        booking.hostName.toLowerCase().includes(term) ||
        booking.venueName.toLowerCase().includes(term) ||
        booking.artistMessage?.toLowerCase().includes(term) ||
        booking.hostResponse?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'date':
          aValue = new Date(a.requestedDate).getTime();
          bValue = new Date(b.requestedDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'created':
          aValue = new Date(a.requestedAt).getTime();
          bValue = new Date(b.requestedAt).getTime();
          break;
        default:
          aValue = new Date(a.requestedDate).getTime();
          bValue = new Date(b.requestedDate).getTime();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, sortField, sortDirection]);

  // Handle status update with local update
  const handleStatusUpdate = async (bookingId: string, status: string, data?: any) => {
    if (onStatusUpdate) {
      await onStatusUpdate(bookingId, status, data);
      
      // Update local state optimistically
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: status as any,
              respondedAt: ['APPROVED', 'REJECTED'].includes(status) ? new Date().toISOString() : booking.respondedAt,
              confirmedAt: status === 'CONFIRMED' ? new Date().toISOString() : booking.confirmedAt,
              completedAt: status === 'COMPLETED' ? new Date().toISOString() : booking.completedAt,
              ...data
            }
          : booking
      ));
    }
  };

  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      all: bookings.length,
      PENDING: bookings.filter(b => b.status === 'PENDING').length,
      APPROVED: bookings.filter(b => b.status === 'APPROVED').length,
      CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
      REJECTED: bookings.filter(b => b.status === 'REJECTED').length,
      COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
      CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

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
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Failed to Load Bookings</h3>
        <p className="text-neutral-600 mb-4">{error}</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <p className="text-neutral-600">
          {filteredBookings.length} of {bookings.length} bookings
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-french-blue)] w-4 h-4" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-neutral-300 focus:border-[var(--color-french-blue)] focus:ring-[var(--color-french-blue)]"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-french-blue)] w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-neutral-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent"
          >
            <option value="all">All Status ({statusCounts.all})</option>
            <option value="PENDING">Pending ({statusCounts.PENDING})</option>
            <option value="APPROVED">Approved ({statusCounts.APPROVED})</option>
            <option value="CONFIRMED">Confirmed ({statusCounts.CONFIRMED})</option>
            <option value="COMPLETED">Completed ({statusCounts.COMPLETED})</option>
            <option value="REJECTED">Rejected ({statusCounts.REJECTED})</option>
            <option value="CANCELLED">Cancelled ({statusCounts.CANCELLED})</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="px-3 py-2 border border-neutral-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent"
          >
            <option value="date">Show Date</option>
            <option value="created">Created Date</option>
            <option value="status">Status</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? 
              <SortAsc className="w-4 h-4" /> : 
              <SortDesc className="w-4 h-4" />
            }
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => {
          if (status === 'all' || count === 0) return null;
          
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'PENDING': return 'bg-white text-[var(--color-french-blue)] border border-[var(--color-french-blue)] hover:bg-slate-50';
              case 'APPROVED': return 'bg-[var(--color-french-blue)] text-white border border-[var(--color-french-blue)] hover:bg-slate-600';
              case 'CONFIRMED': return 'bg-[var(--color-sage)] text-white border border-[var(--color-sage)] hover:bg-emerald-600';
              case 'COMPLETED': return 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50';
              case 'REJECTED': return 'bg-white text-red-600 border border-red-300 hover:bg-red-50';
              case 'CANCELLED': return 'bg-white text-neutral-500 border border-neutral-300 hover:bg-neutral-50';
              default: return 'bg-white text-neutral-600 border border-neutral-300';
            }
          };

          return (
            <Badge 
              key={status} 
              className={`${getStatusColor(status)} cursor-pointer`}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            >
              {status}: {count}
            </Badge>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 
              'No bookings match your filters' : 
              'No booking requests yet'
            }
          </h3>
          <p className="text-neutral-600">
            {searchTerm || statusFilter !== 'all' ? 
              'Try adjusting your search or filter criteria.' :
              viewType === 'artist' ? 
                'Start by browsing hosts and sending booking requests.' :
                'Booking requests will appear here when artists reach out.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              viewType={viewType}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}