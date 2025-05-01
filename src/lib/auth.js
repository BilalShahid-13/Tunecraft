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
    // EmailProvider({
    //   server: process.env.SMTP_HOST,
    //   // {
    //   //   host: process.env.SMTP_HOST,
    //   //   port: process.env.EMAIL_SERVER_HOST,
    //   //   auth: {
    //   //     user: process.env.GOOGLE_APP_USER,
    //   //     pass: process.env.GOOGLE_APP_PASSWORD,
    //   //   },
    //   // },
    //   from: process.env.EMAIL_FROM,
    //   sendVerificationRequest: async ({ identifier: email }) => {
    //     await sendVerificationRequest({
    //       identifier: email,
    //       url: "http://localhost:3000/verify-email",
    //       provider: {
    //         server: process.env.SMTP_HOST,
    //         from: process.env.EMAIL_FROM,
    //       },
    //     });
    //   },
    //   async generateVerificationToken() {
    //     return "ABC123";
    //   },
    //   normalizeIdentifier(identifier) {
    //     // Get the first two elements only,
    //     // separated by `@` from user input.
    //     let [local, domain] = identifier.toLowerCase().trim().split("@")
    //     // The part before "@" can contain a ","
    //     // but we remove it on the domain part
    //     domain = domain.split(",")[0]
    //     return `${local}@${domain}`
    //   },
    // }),
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
    // async redirect({ url, baseUrl, token }) {
    //   // Check if the user's role matches any role in the roles array
    //   const role = roles.find(r => r.name === token?.role);
    //   if (role) {
    //     // Redirect to the corresponding route based on role
    //     return `${baseUrl}${role.route}`;
    //   }
    //   // Default redirect if no role matches
    //   return baseUrl;
    // },
  },
  pages: {
    signIn: "/Register", // Ensure this page is set for the sign-in flow
    signUp: "/Register", // Same for sign-up
  },

  trustHost: true,
  secret: process.env.AUTH_SECRET, // Ensure this is set for secure sessions
};
