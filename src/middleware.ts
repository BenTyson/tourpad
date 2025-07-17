import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/how-it-works',
    '/login',
    '/register',
    '/artists',
    '/hosts',
    '/terms',
    '/privacy',
    '/contact',
    '/mission',
    '/faq',
    '/pricing',
    '/featured',
    '/fan-signup',
    '/social-media',
    '/coordination',
    '/stats',
    '/testimonials',
    '/artist-stats',
    '/host-stats'
  ];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get session
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (session.user.type !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Dashboard routes protection
  if (pathname.startsWith('/dashboard')) {
    // Check if user is approved (except for fans who pay directly)
    if (session.user.type !== 'fan' && session.user.status !== 'approved' && session.user.status !== 'active') {
      return NextResponse.redirect(new URL('/pending-approval', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};