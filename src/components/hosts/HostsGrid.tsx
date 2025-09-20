'use client';
import { Button } from '@/components/ui/Button';
import { HostCard } from '@/components/cards/HostCard';

interface Filters {
  minAttendance: string;
  maxDoorFee: string;
  amenities: {
    parking: boolean;
    wifi: boolean;
    soundSystem: boolean;
    kidFriendly: boolean;
    bnbOffered: boolean;
    accessible: boolean;
  };
}

interface HostsGridProps {
  hosts: any[];
  filteredHosts: any[];
  onClearFilters: () => void;
}

export function HostsGrid({ hosts, filteredHosts, onClearFilters }: HostsGridProps) {
  return (
    <>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {filteredHosts.length} Host{filteredHosts.length !== 1 ? 's' : ''} Found
        </h2>
      </div>

      {/* Host Grid */}
      {filteredHosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHosts.map((host) => (
            <HostCard key={host?.id || Math.random()} host={host} showBookingButton={true} />
          ))}
        </div>
      ) : hosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hosts are currently available in the database.</p>
          <p className="text-gray-400 text-sm mt-2">Hosts need to complete their profiles and be approved to appear here.</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hosts match your search criteria.</p>
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
}