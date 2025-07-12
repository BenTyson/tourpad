// Authentication utilities and types
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { User } from './db';

// Import NextAuth options
const authOptions = {
  providers: [],
  session: { strategy: 'jwt' as const },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.type = user.type;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub!;
        session.user.type = token.type;
        session.user.status = token.status;
      }
      return session;
    }
  }
};

export interface ExtendedUser extends User {
  type: 'artist' | 'host' | 'admin';
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
}

export interface AuthSession {
  user: ExtendedUser;
  expires: string;
}

// Get current session
export async function getSession(): Promise<AuthSession | null> {
  try {
    const session = await getServerSession(authOptions);
    return session as AuthSession | null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

// Check if user has specific role
export async function hasRole(role: 'artist' | 'host' | 'admin'): Promise<boolean> {
  const session = await getSession();
  return session?.user.type === role;
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

// Check if user account is approved
export async function isApproved(): Promise<boolean> {
  const session = await getSession();
  return session?.user.status === 'approved';
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate secure random token
export function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Middleware helpers for API routes
export function withAuth(handler: Function, options: {
  requireApproved?: boolean;
  requireRole?: 'artist' | 'host' | 'admin';
} = {}) {
  return async (req: any, res: any) => {
    const session = await getSession();
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (options.requireApproved && session.user.status !== 'approved') {
      return res.status(403).json({ error: 'Account not approved' });
    }
    
    if (options.requireRole && session.user.type !== options.requireRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    // Add user to request object
    req.user = session.user;
    
    return handler(req, res);
  };
}

// Admin-only middleware
export function withAdminAuth(handler: Function) {
  return withAuth(handler, { requireRole: 'admin', requireApproved: true });
}

// User validation utilities
export function validateUserPermissions(
  currentUser: ExtendedUser,
  targetUserId: string,
  requireAdmin: boolean = false
): boolean {
  // Admin can access anything
  if (currentUser.type === 'admin') {
    return true;
  }
  
  // If admin is required and user is not admin
  if (requireAdmin) {
    return false;
  }
  
  // User can only access their own data
  return currentUser.id === targetUserId;
}

// Check if user can access booking
export function canAccessBooking(
  currentUser: ExtendedUser,
  booking: { artistId: string; hostId: string }
): boolean {
  return (
    currentUser.type === 'admin' ||
    currentUser.id === booking.artistId ||
    currentUser.id === booking.hostId
  );
}

// Rate limiting utilities
const rateLimitMap = new Map();

export function rateLimit(key: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, []);
  }
  
  const requests = rateLimitMap.get(key);
  
  // Remove old requests outside the window
  const validRequests = requests.filter((time: number) => time > windowStart);
  
  if (validRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  validRequests.push(now);
  rateLimitMap.set(key, validRequests);
  
  return true; // Request allowed
}