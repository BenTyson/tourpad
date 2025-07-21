'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Bell,
  Send,
  Check,
  Clock,
  User,
  MapPin,
  Calendar,
  Home,
  Music,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface BookingCoordinatorProps {
  showBooking: {
    id: string;
    hostId: string;
    hostName: string;
    venueName: string;
    date: string;
    time: string;
    location: string;
  };
  lodgingBooking: {
    id: string;
    hostId: string;
    hostName: string;
    venueName: string;
    checkIn: string;
    checkOut: string;
    location: string;
    distance: number;
  };
  onSendNotification: (notification: {
    recipients: string[];
    message: string;
    type: 'coordination' | 'introduction' | 'logistics';
  }) => Promise<void>;
}

export default function BookingCoordinator({ 
  showBooking, 
  lodgingBooking, 
  onSendNotification 
}: BookingCoordinatorProps) {
  const [activeTab, setActiveTab] = useState<'notify' | 'templates' | 'history'>('notify');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const messageTemplates = [
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

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSendNotification({
        recipients: [showBooking.hostId, lodgingBooking.hostId],
        message: notificationMessage,
        type: 'coordination'
      });
      
      // Add to local history
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        message: notificationMessage,
        timestamp: new Date().toISOString(),
        recipients: [showBooking.hostName, lodgingBooking.hostName],
        status: 'sent'
      }]);
      
      setNotificationMessage('');
      setSelectedTemplate('');
    } catch (error) {
      console.error('Failed to send notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateSelect = (template: typeof messageTemplates[0]) => {
    setSelectedTemplate(template.id);
    setNotificationMessage(template.message);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Host Coordination</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {lodgingBooking.distance}mi apart
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Show Details */}
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Music className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Performance</h4>
                <p className="text-sm text-gray-600">{showBooking.venueName}</p>
                <p className="text-sm text-gray-600">{showBooking.hostName}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {showBooking.date} at {showBooking.time}
                </div>
              </div>
            </div>

            {/* Lodging Details */}
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Home className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Lodging</h4>
                <p className="text-sm text-gray-600">{lodgingBooking.venueName}</p>
                <p className="text-sm text-gray-600">{lodgingBooking.hostName}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {lodgingBooking.checkIn} to {lodgingBooking.checkOut}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-6">
            {[
              { id: 'notify', label: 'Send Notification', icon: Send },
              { id: 'templates', label: 'Templates', icon: MessageCircle },
              { id: 'history', label: 'History', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'notify' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to both hosts
              </label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                rows={6}
                placeholder="Write a message to coordinate between your show host and lodging host..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Will be sent to {showBooking.hostName} and {lodgingBooking.hostName}
              </div>
              <Button
                onClick={handleSendNotification}
                disabled={!notificationMessage.trim() || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose a template to get started, then customize as needed:
            </p>
            {messageTemplates.map(template => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{template.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{template.message}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications sent yet</h3>
                <p className="text-gray-600">
                  Coordination messages will appear here once you send them.
                </p>
              </div>
            ) : (
              notifications.map(notification => (
                <div key={notification.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Sent to {notification.recipients.join(', ')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}