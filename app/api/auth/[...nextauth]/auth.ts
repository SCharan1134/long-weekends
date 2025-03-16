import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
// import { generateUniqueCustomerId } from "@/util/generateUniqueCustomer";

export const authOptions: AuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          isEmailVerified: profile.email_verified,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          console.log("sign in started");
          const body = req.body;
          if (!credentials?.email || !credentials?.password) {
            console.error("Please enter both email and password");
            return null;
          }
          console.log("body acquired");

          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });
          console.log("user found", user);
          if (!user) {
            console.error("No user found with this email");
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            body?.password,
            user?.password as string
          );

          if (!passwordMatch) {
            console.error("Incorrect password");
            return null;
          }

          console.log("password matched");

          await prisma.user.update({
            where: { email: credentials?.email },
            data: {
              isActive: true,
              lastActive: new Date(), // Set the current date and time
            },
          });

          console.log("user updated");
          // console.log(user);
          return user;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, isNewUser }) {
      if (user && account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser && isNewUser) {
          // const customerId = await generateUniqueCustomerId();
          const date = new Date();
          await prisma.user.update({
            where: {
              id: dbUser.id,
            },
            data: {
              // customerId: customerId,
              isEmailVerified: true,
              emailVerified: date,
              isActive: true,
            },
          });
        }
      }

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email as string,
          },
        });
        // console.log("token", { token, user });
        // console.log(token, user, 12345);
        if (!dbUser) {
          token.id = user!.id;
          return token;
        }
        return {
          ...token,
          id: dbUser?.id,
          role: dbUser?.role,
          image: dbUser?.image,
          // EmailVerified: dbUser.emailVerified,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("session", { session, token, user });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          image: token.image as string | null | undefined,
        },
      };
      // return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", //Comments: Please remove the hardcoded values
};

export const getServerAuthSession = () => getServerSession(authOptions);
