'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, 
  X,
  UserCircle,
  Home,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dynamic navigation based on user status and type
  const getNavigation = () => {
    const baseNavigation = [
      { name: 'How It Works', href: '/how-it-works', requiresAuth: false },
    ];

    // Only show browse links to approved/active users, fans with active payment, or non-authenticated users (as teasers)
    if (!session || 
        (session && (session.user.status === 'approved' || session.user.status === 'active')) ||
        (session && session.user.type === 'fan' && session.user.paymentStatus === 'active')) {
      // Customize link text based on user type
      const browseArtistsText = (session && session.user.type === 'fan') ? 'Find Concerts' : 'Browse Artists';
      const findHostsText = (session && session.user.type === 'fan') ? 'Find Venues' : 'Find Hosts';
      
      baseNavigation.unshift(
        { name: findHostsText, href: '/hosts', requiresAuth: false },
        { name: browseArtistsText, href: '/artists', requiresAuth: false }
      );
      
      // Add Map link for approved/active users or fans with active payment
      if (session && 
          ((session.user.status === 'approved' || session.user.status === 'active') ||
           (session.user.type === 'fan' && session.user.paymentStatus === 'active'))) {
        baseNavigation.push(
          { name: 'Map', href: '/map', requiresAuth: true }
        );
      }
    }

    // Add conditional navigation items for authenticated users
    if (session) {
      const userStatus = session.user.status;
      const userType = session.user.type;

      // Add status-specific items
      if (userStatus === 'pending') {
        baseNavigation.push(
          { name: 'Application Status', href: '/account/status', requiresAuth: true, highlight: true }
        );
      } else if (userStatus === 'approved' || userStatus === 'active') {
        // Full access for approved/active users
        if (userType === 'artist') {
          baseNavigation.push(
            { name: 'My Bookings', href: '/dashboard', requiresAuth: true }
          );
        } else if (userType === 'host') {
          baseNavigation.push(
            { name: 'My Venue', href: '/dashboard', requiresAuth: true }
          );
        }
      } else if (userType === 'fan' && session.user.paymentStatus === 'active') {
        // Fans with active payment get full access
        baseNavigation.push(
          { name: 'My Concerts', href: '/dashboard', requiresAuth: true },
          { name: 'Discover Shows', href: '/artists', requiresAuth: true }
        );
      } else if (userType === 'fan' && session.user.paymentStatus !== 'active') {
        // Fans with expired payment get limited access
        baseNavigation.push(
          { name: 'Renew Membership', href: '/payment/fan', requiresAuth: true, highlight: true }
        );
      }
    }

    return baseNavigation;
  };

  const navigation = getNavigation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                TourPad
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  item.highlight 
                    ? 'bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                {/* Welcome message */}
                <div className="text-sm text-gray-700">
                  Welcome, <span className="font-medium text-gray-900">{session.user?.name}</span>
                </div>
                
                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <UserCircle className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-900">{session.user?.name}</div>
                          <div className="text-xs text-gray-600">{session.user?.email}</div>
                          <div className="text-xs text-blue-600 mt-1 capitalize">{session.user?.type}</div>
                        </div>
                        {(session.user?.status === 'approved' || session.user?.status === 'active') ? (
                          <Link 
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                        ) : (
                          <Link 
                            href="/account/status"
                            className="block px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 font-medium"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Check Application Status
                          </Link>
                        )}
                        {session.user?.type === 'admin' && (
                          <Link 
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            {session && (
              <div className="px-3 py-2 mb-3 bg-gray-50 rounded-lg mx-3">
                <div className="text-sm font-medium text-gray-900">{session.user?.name}</div>
                <div className="text-xs text-gray-600">{session.user?.email}</div>
                <div className="text-xs text-blue-600 mt-1 capitalize">{session.user?.type}</div>
              </div>
            )}
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 transition-colors ${
                    item.highlight 
                      ? 'bg-primary-100 text-primary-700 rounded-lg mx-3 hover:bg-primary-200' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {session && (
                <>
                  {(session.user?.status === 'approved' || session.user?.status === 'active') ? (
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/account/status"
                      className="block px-3 py-2 text-primary-600 hover:text-primary-700 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Check Application Status
                    </Link>
                  )}
                  {session.user?.type === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!session && (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}