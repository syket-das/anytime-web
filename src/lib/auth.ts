import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createWallet } from "./createWallet";
import { prisma } from "./db";

// Configuration options for authentication
export const authOptions = {
  // Callback to modify the session object
  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      };
    },

    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === "google" && user.email) {
        const userExist = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        if (!userExist) {
          const { address, privateKey } = await createWallet();

          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
            },
          });

          if (!address || !privateKey || !newUser) {
            return false;
          }
          await prisma.depositWallet.create({
            data: {
              address,
              privateKey,
              publicKey: address,
              userId: newUser.id,
            },
          });

          return true;
        }

        return true;
      } else {
        return false;
      }
    },

    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }

      return {
        ...token,
      };
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
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
