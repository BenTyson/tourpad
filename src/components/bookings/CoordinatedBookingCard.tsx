'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar,
  MapPin,
  Users,
  Star,
  Music,
  Home,
  Clock,
  ArrowRight,
  Info,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CoordinatedBookingCardProps {
  showBooking: {
    id: string;
    hostId: string;
    hostName: string;
    venueName: string;
    date: string;
    time: string;
    location: string;
    status: 'confirmed' | 'pending' | 'cancelled';
  };
  lodgingBooking?: {
    id: string;
    hostId: string;
    hostName: string;
    venueName: string;
    checkIn: string;
    checkOut: string;
    location: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    distance: number;
  };
  onNotifyHosts?: () => void;
}

export default function CoordinatedBookingCard({ 
  showBooking, 
  lodgingBooking, 
  onNotifyHosts 
}: CoordinatedBookingCardProps) {
  const [isNotifying, setIsNotifying] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);

  const handleNotifyHosts = async () => {
    if (!onNotifyHosts) return;
    
    setIsNotifying(true);
    try {
      await onNotifyHosts();
      setHasNotified(true);
    } catch (error) {
      console.error('Failed to notify hosts:', error);
    } finally {
      setIsNotifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Music className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Performance</span>
            </div>
            {lodgingBooking && (
              <>
                <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Lodging</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Coordinated Booking
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Show Booking Details */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{showBooking.venueName}</h3>
              <p className="text-sm text-gray-600">Hosted by {showBooking.hostName}</p>
            </div>
            <Badge className={getStatusColor(showBooking.status)}>
              {showBooking.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{showBooking.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{showBooking.time}</span>
            </div>
            <div className="flex items-center text-gray-600 col-span-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{showBooking.location}</span>
            </div>
          </div>
        </div>

        {/* Lodging Booking Details */}
        {lodgingBooking && (
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{lodgingBooking.venueName}</h3>
                <p className="text-sm text-gray-600">Hosted by {lodgingBooking.hostName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(lodgingBooking.status)}>
                  {lodgingBooking.status}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {lodgingBooking.distance}mi away
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Check-in: {lodgingBooking.checkIn}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Check-out: {lodgingBooking.checkOut}</span>
              </div>
              <div className="flex items-center text-gray-600 col-span-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{lodgingBooking.location}</span>
              </div>
            </div>
          </div>
        )}

        {/* Coordination Actions */}
        {lodgingBooking && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-900 mb-1">Host Coordination</h4>
                <p className="text-sm text-yellow-800 mb-3">
                  Your show host and lodging host should be aware of each other to ensure smooth coordination for your visit.
                </p>
                
                {!hasNotified ? (
                  <Button
                    size="sm"
                    onClick={handleNotifyHosts}
                    disabled={isNotifying}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isNotifying ? 'Notifying...' : 'Notify Both Hosts'}
                  </Button>
                ) : (
                  <div className="flex items-center text-sm text-green-800">
                    <Check className="w-4 h-4 mr-2" />
                    <span>Both hosts have been notified of your coordinated booking</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Lodging Available */}
        {!lodgingBooking && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">No Lodging Arranged</h4>
                <p className="text-sm text-gray-600 mt-1">
                  You haven't arranged lodging for this show yet.
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Link href={`/lodging/search?showDate=${showBooking.date}&showLocation=${showBooking.location}&showHostId=${showBooking.hostId}`}>
                <Button size="sm" variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Find Lodging
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}