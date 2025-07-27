import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { loginSchema } from './validation';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Validate input
        const validation = loginSchema.safeParse(credentials);
        if (!validation.success) {
          return null;
        }

        const { email, password } = validation.data;

        try {
          // Find user with profile
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
              profile: true,
              artist: true,
              host: true,
              fan: true
            }
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return null;
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.profileImageUrl || undefined,
            type: user.userType.toLowerCase(),
            status: user.status.toLowerCase(),
            emailVerified: user.emailVerified,
            profile: user.profile,
            artist: user.artist,
            host: user.host,
            fan: user.fan
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // Handle Google OAuth profile
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          type: 'fan',
          status: 'active',
          emailVerified: profile.email_verified
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Include user data in JWT token
      if (user) {
        token.type = user.type;
        token.status = user.status;
        token.emailVerified = Boolean(user.emailVerified);
        token.profile = user.profile;
        token.artist = user.artist;
        token.host = user.host;
        token.fan = user.fan;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        // Update token with new session data
        token.name = session.user.name;
        token.email = session.user.email;
        token.picture = session.user.image;
      }

      return token;
    },
    async session({ session, token }) {
      // Include user data in session
      if (token) {
        session.user.id = token.sub!;
        session.user.type = token.type as string;
        session.user.status = token.status as string;
        session.user.emailVerified = Boolean(token.emailVerified) as any;
        session.user.profile = token.profile as any;
        session.user.artist = token.artist as any;
        session.user.host = token.host as any;
        session.user.fan = token.fan as any;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth sign in
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (!existingUser) {
            // Create new user for OAuth
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                profileImageUrl: user.image,
                userType: 'FAN', // Default to fan for OAuth users
                status: 'ACTIVE',
                emailVerified: true,
                oauthProvider: account.provider,
                oauthId: account.providerAccountId,
                termsAcceptedAt: new Date(),
                privacyPolicyAcceptedAt: new Date(),
                profile: {
                  create: {
                    bio: 'House concert enthusiast',
                    preferences: {
                      notifications: { email: true, push: false },
                      privacy: { profileVisibility: 'public' }
                    }
                  }
                }
              }
            });
          }

          return true;
        } catch (error) {
          console.error('OAuth sign in error:', error);
          return false;
        }
      }

      return true;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  debug: false
});

// Helper function to get current user
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

// Helper function to require authentication
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

// Helper function to require specific user type
export async function requireUserType(allowedTypes: string[]) {
  const user = await requireAuth();
  if (!allowedTypes.includes(user.type)) {
    throw new Error(`Access denied. Required user type: ${allowedTypes.join(' or ')}`);
  }
  return user;
}

// Helper function to require approval status
export async function requireApproval() {
  const user = await requireAuth();
  if (user.status !== 'active' && user.status !== 'approved') {
    throw new Error('User approval required');
  }
  return user;
}