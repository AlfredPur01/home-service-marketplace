import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { ConnectToDB } from "@/mongodb/database";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid Email or Password");
        }
        
        await ConnectToDB();

        /* Check if the user exists */
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        /* Compare password */
        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid Email or Password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      try {
        await ConnectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          session.user.name = sessionUser.username;
          session.user.image = sessionUser.profileImage;
        }
      } catch (error) {
        console.error("Error in session callback:", error.message);
      }
      return session;
    },

    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          await ConnectToDB();

          // Check if the user exists
          let user = await User.findOne({ email: profile.email });

          if (!user) {
            user = await User.create({
              email: profile.email,
              username: profile.name,
              profileImage: profile.picture || '',              booking: [],
              service: [],
            });
          }

          return true; // Allow the sign-in
        } catch (error) {
          console.error("Error during sign-in:", error.message);
          return false; // Deny the sign-in
        }
      }
      return true; // Allow the sign-in for other providers
    },
  },
});

export { handler as GET, handler as POST };
