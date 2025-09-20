import React from 'react';
import Link from 'next/link';
import {
  Plus,
  Calendar,
  Mail,
  Bell,
  Users,
  Home,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuickActionsProps {
  userType: 'artist' | 'host' | 'fan' | 'admin';
}

export function QuickActions({ userType }: QuickActionsProps) {
  const getActions = () => {
    const commonActions = [
      {
        href: '/dashboard/messages',
        icon: Mail,
        title: 'Messages'
      },
      {
        href: '/dashboard/notifications',
        icon: Bell,
        title: 'Notifications'
      }
    ];

    const primaryAction = {
      artist: {
        href: '/hosts',
        icon: Plus,
        title: 'Find Venues'
      },
      host: {
        href: '/artists',
        icon: Plus,
        title: 'Find Artists'
      },
      fan: {
        href: '/artists',
        icon: Plus,
        title: 'Browse Concerts'
      },
      admin: {
        href: '/admin',
        icon: Users,
        title: 'Admin Panel'
      }
    };

    const roleSpecificActions = {
      artist: [
        {
          href: '/dashboard/tour-planner',
          icon: Calendar,
          title: 'Tour Planner'
        },
        {
          href: '/dashboard/music',
          icon: Music,
          title: 'Music & Media'
        }
      ],
      host: [
        {
          href: '/dashboard/calendar',
          icon: Calendar,
          title: 'Calendar'
        },
        {
          href: '/dashboard/venue',
          icon: Home,
          title: 'Venue Settings'
        }
      ],
      fan: [
        {
          href: '/dashboard/fan',
          icon: Calendar,
          title: 'My Events'
        },
        {
          href: '/hosts',
          icon: Home,
          title: 'Venues'
        }
      ],
      admin: [
        {
          href: '/admin/users',
          icon: Users,
          title: 'User Management'
        },
        {
          href: '/admin/reports',
          icon: Calendar,
          title: 'Reports'
        }
      ]
    };

    return [primaryAction[userType], ...roleSpecificActions[userType], ...commonActions];
  };

  const actions = getActions();

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          const isPrimary = index === 0;

          return (
            <Link key={action.href} href={action.href}>
              <Button
                variant={isPrimary ? "primary" : "outline"}
                className={`w-full justify-start h-auto py-3 ${isPrimary ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <IconComponent className="w-4 h-4 mr-3" />
                {action.title}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}