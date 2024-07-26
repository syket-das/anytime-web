import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

// Configuration options for authentication
export const authOptions = {
  // Callback to modify the session object
  callbacks: {
    session: ({ session, user }: { session: any; user: any }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },

  // Secret to encrypt cookies
  secret: process.env.NEXTAUTH_SECRET || "default-secret",

  // Prisma adapter to connect NextAuth.js with the database
  adapter: PrismaAdapter(prisma),
  // Authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};

// Utility function to retrieve the server session with authentication options
export const getServerAuthSession = () => getServerSession(authOptions);
