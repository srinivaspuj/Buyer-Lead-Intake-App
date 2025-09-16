import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'demo',
      credentials: {},
      async authorize() {
        return {
          id: 'demo-user-id',
          email: 'demo@example.com',
          name: 'Demo User',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };