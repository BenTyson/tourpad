import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      type: 'artist' | 'host' | 'admin';
      status: 'pending' | 'approved' | 'suspended' | 'rejected';
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    type: 'artist' | 'host' | 'admin';
    status: 'pending' | 'approved' | 'suspended' | 'rejected';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    type: 'artist' | 'host' | 'admin';
    status: 'pending' | 'approved' | 'suspended' | 'rejected';
  }
}
