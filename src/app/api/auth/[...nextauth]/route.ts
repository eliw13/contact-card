import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow the admin email to sign in
      const adminEmail = process.env.ADMIN_EMAIL;
      
      if (user.email === adminEmail) {
        return true;
      }
      
      // Deny access for everyone else
      return false;
    },
    async session({ session, token }) {
      // Add admin flag to session
      if (session.user) {
        session.user.isAdmin = session.user.email === process.env.ADMIN_EMAIL;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // Redirect to home page for sign in
    error: '/', // Redirect to home page on error
  },
});

export { handler as GET, handler as POST };
