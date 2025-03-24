import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";
// import { generateUniqueCustomerId } from "@/util/generateUniqueCustomer";

export const authOptions: AuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const body = req.body;
          if (!credentials?.email || !credentials?.password) {
            console.error("Please enter both email and password");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });

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
            await logUserActivity(
              user.id,
              UserActionType.FAILED_LOGIN_ATTEMPT,
              {
                ip: req?.headers?.["x-forwarded-for"] || "Unknown",
                userAgent: req?.headers?.["user-agent"] || "Unknown",
              }
            );
            return null;
          }

          await prisma.user.update({
            where: { email: credentials?.email },
            data: {
              isActive: true,
              lastActive: new Date(), // Set the current date and time
            },
          });

          await logUserActivity(user.id, UserActionType.LOGIN, {
            ip: req?.headers?.["x-forwarded-for"] || "Unknown",
            userAgent: req?.headers?.["user-agent"] || "Unknown",
          });
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

        if (dbUser) {
          await logUserActivity(dbUser.id, UserActionType.LOGIN, {
            provider: "google",
          });
        }
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

          return {
            ...token,
            id: dbUser.id,
            role: dbUser.role,
            image: dbUser.image,
            isEmailVerified: dbUser.isEmailVerified,
            isNewUser: isNewUser,
          };
        }
      }

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email as string,
          },
        });

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
          isEmailVerified: dbUser.isEmailVerified,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          image: token.image as string | null | undefined,
          isEmailVerified: token.isEmailVerified,
        },
      };
      // return session;
    },
    async redirect({
      url,
      baseUrl,
      token,
    }: {
      url: string;
      baseUrl: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      token?: any;
    }) {
      // Redirect new users to the personal-information page
      if (token?.isNewUser) {
        return `${baseUrl}/personal-information?email=${encodeURIComponent(
          token.email
        )}`;
      }
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/sign-in",
    newUser: "/personal-information",
  },
  events: {
    async signOut({ session }) {
      if (session?.user) {
        await logUserActivity(session.user.id, UserActionType.LOGOUT, {});
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", //Comments: Please remove the hardcoded values
};

export const getServerAuthSession = () => getServerSession(authOptions);
