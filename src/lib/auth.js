// Simplified auth configuration without NextAuth to avoid openid-client issues
import prisma from "./prisma";

export const authOptions = {
  providers: [], // No OAuth providers to avoid openid-client issues
  callbacks: {
    async signIn({ user, account, profile }) {
      return true; // Allow all sign-ins for now
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
};

// Export a simple function instead of NextAuth instance
export function getAuthConfig() {
  return authOptions;
}