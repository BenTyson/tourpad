import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { JWT } from 'next-auth/jwt';

// Define route configuration type
type RouteConfig = {
  requireRole?: 'artist' | 'host' | 'admin';
  requireApproved?: boolean;
  requireAuth?: boolean;
};

// Define protected routes and their requirements
const protectedRoutes: Record<string, RouteConfig> = {
  // Admin routes - require admin role
  '/admin': { requireRole: 'admin', requireApproved: true },
  
  // Dashboard routes - require authentication and approval
  '/dashboard': { requireApproved: true },
  
  // Booking routes - require authentication
  '/bookings': { requireAuth: true },
  
  // Payment routes - require authentication  
  '/payment': { requireAuth: true },
  '/subscription': { requireAuth: true },
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/artists',
  '/hosts', 
  '/register',
  '/login',
  '/api/auth',
  '/api/register'
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    // Token is passed through the req parameter in the withAuth middleware
    const token = (req as any).nextauth?.token as JWT | null;

    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Check if route requires authentication
    const routeConfig = Object.entries(protectedRoutes).find(([route]) => 
      pathname.startsWith(route)
    )?.[1];

    if (!routeConfig) {
      return NextResponse.next();
    }

    // Require authentication for protected routes
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Check role requirements
    if ('requireRole' in routeConfig && routeConfig.requireRole && token?.type !== routeConfig.requireRole) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Check approval requirements
    if ('requireApproved' in routeConfig && routeConfig.requireApproved && token?.status !== 'approved') {
      return NextResponse.redirect(new URL('/pending-approval', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow public routes
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }
        
        // For protected routes, check if user has token
        return !!token;
      },
    },
  }
);

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\.png$|.*\.jpg$|.*\.svg$).*)'
  ]
};
