import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { validateData, loginSchema } from '@/lib/validation';
import { getCurrentUser } from '@/data/realTestData';

const handler = NextAuth({
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
        const validation = validateData(loginSchema, credentials);
        if (!validation.success) {
          return null;
        }

        try {
          // Use realistic test data for authentication
          const user = getCurrentUser(credentials.email);
          
          if (!user) {
            return null;
          }

          // For demo purposes, use simple password matching
          // In production, this would use bcrypt.compare with hashed passwords
          const validCredentials = [
            { email: 'admin@tourpad.com', password: 'admin123' },
            { email: 'sarah.artist@email.com', password: 'artist123' },
            { email: 'mike.host@email.com', password: 'host123' },
            { email: 'marcus.artist@email.com', password: 'artist123' },
            { email: 'emma.artist@email.com', password: 'artist123' },
            { email: 'lisa.host@email.com', password: 'host123' }
          ];

          const validCredential = validCredentials.find(
            cred => cred.email === credentials.email && cred.password === credentials.password
          );

          if (!validCredential) {
            return null;
          }

          // Check if user account is approved (except for admin)
          if (user.type !== 'admin' && user.status !== 'approved') {
            throw new Error('Account pending approval');
          }

          // Return user object that will be stored in the JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            type: user.type,
            status: user.status
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data in the JWT token
      if (user) {
        token.type = user.type;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      // Send user data to the client
      if (token) {
        session.user.id = token.sub!;
        session.user.type = token.type as string;
        session.user.status = token.status as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
});

export { handler as GET, handler as POST };
