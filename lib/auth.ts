import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authoptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'email', type: 'text', placeholder: '' },
        password: { label: 'password', type: 'password', placeholder: '' },
      },
      async authorize(credentials: any) {
        return {
          id: 'user1',
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope:
            'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user = {
        name: token.name,
        email: token.email,
        picture: token.picture,
        accessToken: token.accessToken,
        id: token.id,
      };
      return session;
    },
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at * 1000; // Convert to milliseconds
      }

      // Check if the token is about to expire and refresh it
      if (token.expiresAt && Date.now() > token.expiresAt - 60000) { // Refresh if less than 1 minute left
        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID || '',
              client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken,
            }),
          });

          const tokens = await response.json();

          if (!response.ok) throw tokens;

          token.accessToken = tokens.access_token;
          token.expiresAt = Date.now() + (tokens.expires_in * 1000);
        } catch (error) {
          console.error('Error refreshing access token', error);
        }
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
};
