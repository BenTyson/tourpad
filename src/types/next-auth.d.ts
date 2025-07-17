import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      type: string;
      status: string;
      emailVerified: boolean;
      profile?: any;
      artist?: any;
      host?: any;
      fan?: any;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    type: string;
    status: string;
    emailVerified: boolean;
    profile?: any;
    artist?: any;
    host?: any;
    fan?: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    type: string;
    status: string;
    emailVerified: boolean;
    profile?: any;
    artist?: any;
    host?: any;
    fan?: any;
  }
}