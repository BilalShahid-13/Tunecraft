import User from "@/Schema/User";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import client from "./db";
import { dbConnect } from "./dbConnect";

export const authOptions = {
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt", // Use JWT for session management
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" }, // Include username and role here if necessary
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        await dbConnect();

        // Sign-up logic
        if (credentials?.username && credentials?.role) {
          const existingUser = await User.findOne({
            email: credentials.email,
          });
          if (existingUser) throw new Error("User already exists");

          const hashedPassword = await bcrypt.hash(credentials.password, 12);
          const user = await User.create({
            username: credentials.username,
            email: credentials.email,
            password: hashedPassword,
            role: credentials.role,
          });

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
          };
        }

        // Sign-in logic
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
    Credentials({
      name: "signin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        // Sign-in logic
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
    Credentials({
      name: "updateEmail",
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        await dbConnect();

        // Sign-in logic
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No email found");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
    Credentials({
      name: "updateUsername",
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        await dbConnect();

        // Sign-in logic
        const user = await User.findOne({ email: credentials?.username });
        if (!user) throw new Error("No username found");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/Register", // Ensure this page is set for the sign-in flow
    signUp: "/Register", // Same for sign-up
  },

  trustHost: true,
  secret: process.env.AUTH_SECRET, // Ensure this is set for secure sessions
  // cookies: {
  //   sessionToken: {
  //     name: "__Secure-next-auth.session-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: true,
  //       domain: process.env.NEXTAUTH_URL?.replace(/https?:\/\//, ""),
  //     },
  //   },
  // },
};
