'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface Notification {
  id: string;
  type: string;
  title: string;
  message?: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  readAt?: string | null;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
}

interface NotificationDropdownProps {
  onClose: () => void;
  onNotificationRead?: () => void;
}

export default function NotificationDropdown({ onClose, onNotificationRead }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds })
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            notificationIds.includes(n.id) 
              ? { ...n, isRead: true, readAt: new Date().toISOString() }
              : n
          )
        );
        onNotificationRead?.();
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setMarkingRead(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        );
        onNotificationRead?.();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setMarkingRead(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return <Calendar className="w-4 h-4" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4" />;
      case 'PAYMENT':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead([notification.id]);
    }
    if (notification.actionUrl) {
      onClose();
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">Notifications</h3>
        <div className="flex items-center space-x-2">
          {unreadNotifications.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              disabled={markingRead}
              className="text-xs"
            >
              {markingRead ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                'Mark all read'
              )}
            </Button>
          )}
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600">No notifications yet</p>
            <p className="text-sm text-neutral-500 mt-1">
              We'll let you know when something important happens
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    !notification.isRead ? 'bg-[var(--color-french-blue)]' : 'bg-neutral-200'
                  }`}>
                    <div className={!notification.isRead ? 'text-white' : 'text-neutral-600'}>
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      !notification.isRead ? 'font-semibold text-neutral-900' : 'text-neutral-700'
                    }`}>
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="text-sm text-neutral-600 mt-1">
                        {notification.message}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-neutral-500">
                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                      </p>
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          className="text-xs text-[var(--color-french-blue)] hover:underline"
                        >
                          {notification.actionText || 'View'}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-neutral-200">
          <Link href="/notifications">
            <Button variant="outline" size="sm" className="w-full">
              View all notifications
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}