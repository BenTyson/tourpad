// Coordination utilities for managing relationships between show and lodging bookings

export interface CoordinatedBooking {
  id: string;
  artistId: string;
  showBookingId: string;
  lodgingBookingId?: string;
  coordinationStatus: 'none' | 'pending' | 'coordinated' | 'failed';
  notificationsSent: {
    id: string;
    recipients: string[];
    message: string;
    type: 'coordination' | 'introduction' | 'logistics';
    timestamp: string;
    status: 'sent' | 'delivered' | 'failed';
  }[];
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingNotification {
  id: string;
  fromUserId: string;
  toUserIds: string[];
  message: string;
  type: 'coordination' | 'introduction' | 'logistics' | 'emergency';
  relatedBookings: string[];
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: {
    showDate?: string;
    showLocation?: string;
    lodgingLocation?: string;
    distance?: number;
  };
}

// Mock coordination data for testing
export const testCoordinatedBookings: CoordinatedBooking[] = [
  {
    id: 'coord1',
    artistId: 'artist1',
    showBookingId: 'booking1',
    lodgingBookingId: 'lodging1',
    coordinationStatus: 'coordinated',
    notificationsSent: [
      {
        id: 'notif1',
        recipients: ['host1', 'host3'],
        message: 'Hi Mike and Sarah,\n\nI wanted to introduce you both as you\'ll be hosting me during my visit. Mike is hosting my performance at The Wilson House on 2025-02-15, and Sarah is providing lodging at Cozy Guest Suite.\n\nI\'m looking forward to working with both of you to make this a great experience!',
        type: 'introduction',
        timestamp: '2025-01-15T10:00:00Z',
        status: 'delivered'
      }
    ],
    distance: 3.2,
    createdAt: '2025-01-15T09:30:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }
];

export const testNotifications: BookingNotification[] = [
  {
    id: 'notif1',
    fromUserId: 'artist1',
    toUserIds: ['host1', 'host3'],
    message: 'Hi Mike and Sarah,\n\nI wanted to introduce you both as you\'ll be hosting me during my visit. Mike is hosting my performance at The Wilson House on 2025-02-15, and Sarah is providing lodging at Cozy Guest Suite.\n\nI\'m looking forward to working with both of you to make this a great experience!',
    type: 'introduction',
    relatedBookings: ['booking1', 'lodging1'],
    timestamp: '2025-01-15T10:00:00Z',
    status: 'delivered',
    metadata: {
      showDate: '2025-02-15',
      showLocation: 'Nashville, TN',
      lodgingLocation: 'Nashville, TN',
      distance: 3.2
    }
  }
];

// Calculate distance between two coordinate points (mock implementation)
export function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  // Haversine formula for calculating distance between two points on Earth
  const R = 3959; // Earth's radius in miles
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Get coordinated booking by show booking ID
export function getCoordinatedBooking(showBookingId: string): CoordinatedBooking | null {
  return testCoordinatedBookings.find(cb => cb.showBookingId === showBookingId) || null;
}

// Create a new coordinated booking
export function createCoordinatedBooking(
  artistId: string,
  showBookingId: string,
  lodgingBookingId?: string
): CoordinatedBooking {
  const newBooking: CoordinatedBooking = {
    id: `coord_${Date.now()}`,
    artistId,
    showBookingId,
    lodgingBookingId,
    coordinationStatus: lodgingBookingId ? 'pending' : 'none',
    notificationsSent: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  testCoordinatedBookings.push(newBooking);
  return newBooking;
}

// Send coordination notification
export async function sendCoordinationNotification(
  fromUserId: string,
  toUserIds: string[],
  message: string,
  type: BookingNotification['type'],
  relatedBookings: string[],
  metadata?: BookingNotification['metadata']
): Promise<BookingNotification> {
  // Mock API call - in real implementation, this would call backend
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const notification: BookingNotification = {
    id: `notif_${Date.now()}`,
    fromUserId,
    toUserIds,
    message,
    type,
    relatedBookings,
    timestamp: new Date().toISOString(),
    status: 'sent',
    metadata
  };
  
  testNotifications.push(notification);
  
  // Update coordinated booking with notification
  const showBookingId = relatedBookings[0];
  const coordBooking = getCoordinatedBooking(showBookingId);
  if (coordBooking) {
    coordBooking.notificationsSent.push({
      id: notification.id,
      recipients: toUserIds,
      message,
      type,
      timestamp: notification.timestamp,
      status: 'sent'
    });
    coordBooking.coordinationStatus = 'coordinated';
    coordBooking.updatedAt = new Date().toISOString();
  }
  
  return notification;
}

// Get notifications for a user
export function getUserNotifications(userId: string): BookingNotification[] {
  return testNotifications.filter(n => 
    n.fromUserId === userId || n.toUserIds.includes(userId)
  );
}

// Get distance between show and lodging locations
export function getBookingDistance(
  showLocation: { lat: number; lng: number },
  lodgingLocation: { lat: number; lng: number }
): number {
  return calculateDistance(showLocation, lodgingLocation);
}

// Format distance for display
export function formatDistance(miles: number): string {
  if (miles < 1) {
    return `${(miles * 5280).toFixed(0)} ft`;
  }
  return `${miles.toFixed(1)} mi`;
}

// Generate notification templates
export function generateNotificationTemplates(
  showBooking: any,
  lodgingBooking: any
): Array<{ id: string; title: string; message: string }> {
  return [
    {
      id: 'introduction',
      title: 'Host Introduction',
      message: `Hi ${showBooking.hostName} and ${lodgingBooking.hostName},\n\nI wanted to introduce you both as you'll be hosting me during my visit. ${showBooking.hostName} is hosting my performance at ${showBooking.venueName} on ${showBooking.date}, and ${lodgingBooking.hostName} is providing lodging at ${lodgingBooking.venueName}.\n\nI'm looking forward to working with both of you to make this a great experience!`
    },
    {
      id: 'logistics',
      title: 'Logistics Coordination',
      message: `Hi both,\n\nI wanted to coordinate some logistics for my visit:\n\n• Show: ${showBooking.date} at ${showBooking.time} at ${showBooking.venueName}\n• Lodging: ${lodgingBooking.checkIn} to ${lodgingBooking.checkOut} at ${lodgingBooking.venueName}\n• Distance: ${lodgingBooking.distance} miles between venues\n\nPlease let me know if you need any additional information from each other or if there are any coordination details I should be aware of.`
    },
    {
      id: 'emergency',
      title: 'Emergency Contacts',
      message: `Hi ${showBooking.hostName} and ${lodgingBooking.hostName},\n\nFor safety and coordination purposes, I wanted to share each other's contact information:\n\n• Show Host: ${showBooking.hostName} at ${showBooking.venueName}\n• Lodging Host: ${lodgingBooking.hostName} at ${lodgingBooking.venueName}\n\nThis way you can reach each other if needed during my visit.`
    }
  ];
}

// Check if hosts should be notified about coordination
export function shouldNotifyHosts(coordBooking: CoordinatedBooking): boolean {
  return coordBooking.lodgingBookingId && 
         coordBooking.coordinationStatus === 'pending' &&
         coordBooking.notificationsSent.length === 0;
}

// Get coordination status display
export function getCoordinationStatusDisplay(status: CoordinatedBooking['coordinationStatus']): {
  text: string;
  color: string;
} {
  switch (status) {
    case 'none':
      return { text: 'No lodging arranged', color: 'gray' };
    case 'pending':
      return { text: 'Coordination pending', color: 'yellow' };
    case 'coordinated':
      return { text: 'Hosts coordinated', color: 'green' };
    case 'failed':
      return { text: 'Coordination failed', color: 'red' };
    default:
      return { text: 'Unknown status', color: 'gray' };
  }
}