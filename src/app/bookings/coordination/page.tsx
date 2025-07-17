'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Star,
  Music,
  Home,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import CoordinatedBookingCard from '@/components/bookings/CoordinatedBookingCard';
import BookingCoordinator from '@/components/bookings/BookingCoordinator';
import { sendCoordinationNotification } from '@/lib/coordination';
import { testHosts } from '@/data/realTestData';

export default function BookingCoordinationPage() {
  const searchParams = useSearchParams();
  const showBookingId = searchParams.get('showBookingId');
  const lodgingBookingId = searchParams.get('lodgingBookingId');
  
  // Mock booking data - in real app would fetch from API
  const [showBooking] = useState({
    id: showBookingId || 'booking1',
    hostId: 'host1',
    hostName: 'Mike Wilson',
    venueName: 'The Wilson House',
    date: '2025-02-15',
    time: '7:00 PM',
    location: 'Nashville, TN',
    status: 'confirmed' as const
  });
  
  const [lodgingBooking] = useState(lodgingBookingId ? {
    id: lodgingBookingId,
    hostId: 'host3',
    hostName: 'Sarah Martinez',
    venueName: 'Cozy Guest Suite',
    checkIn: '2025-02-15',
    checkOut: '2025-02-16',
    location: 'Nashville, TN',
    status: 'confirmed' as const,
    distance: 3.2
  } : undefined);
  
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const handleNotifyHosts = async () => {
    if (!lodgingBooking) return;
    
    // Mock notification sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newNotification = {
      id: Date.now().toString(),
      message: `Host coordination notification sent for ${showBooking.date} booking`,
      timestamp: new Date().toISOString(),
      recipients: [showBooking.hostName, lodgingBooking.hostName],
      status: 'sent'
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };
  
  const handleSendNotification = async (notification: {
    recipients: string[];
    message: string;
    type: 'coordination' | 'introduction' | 'logistics';
  }) => {
    // Mock sending notification
    await sendCoordinationNotification(
      'artist1', // current user
      notification.recipients,
      notification.message,
      notification.type,
      [showBooking.id, lodgingBooking?.id].filter(Boolean),
      {
        showDate: showBooking.date,
        showLocation: showBooking.location,
        lodgingLocation: lodgingBooking?.location,
        distance: lodgingBooking?.distance
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookings
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Coordination
          </h1>
          <p className="text-gray-600">
            Manage coordination between your show and lodging hosts
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coordinated Booking Card */}
            <CoordinatedBookingCard 
              showBooking={showBooking}
              lodgingBooking={lodgingBooking}
              onNotifyHosts={handleNotifyHosts}
            />
            
            {/* Coordination Tools */}
            {lodgingBooking && (
              <BookingCoordinator 
                showBooking={showBooking}
                lodgingBooking={lodgingBooking}
                onSendNotification={handleSendNotification}
              />
            )}
            
            {/* No Lodging State */}
            {!lodgingBooking && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Lodging Arranged
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't arranged lodging for this show yet. Find accommodation near your performance venue.
                  </p>
                  <Link href={`/lodging/search?showDate=${showBooking.date}&showLocation=${showBooking.location}&showHostId=${showBooking.hostId}`}>
                    <Button>
                      <Home className="w-4 h-4 mr-2" />
                      Find Lodging
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/bookings/${showBooking.id}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Music className="w-4 h-4 mr-2" />
                    View Show Details
                  </Button>
                </Link>
                {lodgingBooking && (
                  <Link href={`/lodging/booking/${lodgingBooking.id}`}>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Home className="w-4 h-4 mr-2" />
                      View Lodging Details
                    </Button>
                  </Link>
                )}
                <Link href={`/lodging/search?showDate=${showBooking.date}&showLocation=${showBooking.location}&showHostId=${showBooking.hostId}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    {lodgingBooking ? 'Change Lodging' : 'Find Lodging'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Coordination Tips */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Coordination Tips</h3>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Introduce your hosts</p>
                    <p className="text-gray-600">Let both hosts know about each other for better coordination</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Share logistics</p>
                    <p className="text-gray-600">Communicate timing, locations, and any special requirements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Plan transportation</p>
                    <p className="text-gray-600">Coordinate travel between venues if needed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Emergency contacts</p>
                    <p className="text-gray-600">Make sure hosts can reach each other if needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {notifications.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}