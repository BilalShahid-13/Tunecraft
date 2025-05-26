// import { getToken } from "next-auth/jwt";
// import { roles } from "./lib/Constant"; // Assuming this contains the role-to-route mapping

// export default async function middleware(req) {
//   console.log("🔔 middleware running on path:", new URL(req.url).pathname);
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   console.log("Token:", token);
//   console.log("Headers:", req.headers);
//   console.log("Cookies:", req.cookies.session);

//   // If no token and trying to access a role-based route, redirect to /Register
//   // if (!token) {
//   //   const roleRoutes = roles.map((r) => r.route);
//   //   const pathname = new URL(req.url).pathname;

//   //   // Only redirect if the path matches exactly
//   //   if (roleRoutes.some((route) => pathname === `/${route}`)) {
//   //     return NextResponse.redirect(new URL("/Register", req.url));
//   //   }
//   // }
//   // ... inside your default async function middleware(req) {
//   // ...
//   if (!token) {
//     const roleRoutes = roles.map((r) => r.route);
//     const pathname = new URL(req.url).pathname;

//     // Redirect if the path starts with any protected role route
//     if (roleRoutes.some((route) => pathname.startsWith(`/${route}`))) {
//       // Changed from '===' to 'startsWith'
//       console.log(
//         "🔔 Unauthenticated user attempting to access protected route:",
//         pathname,
//         "Redirecting to /Register"
//       );
//       return NextResponse.redirect(new URL("/Register", req.url));
//     }
//     // IMPORTANT: If no redirection is needed for this unauthenticated user
//     // (i.e., they are accessing a public page or /Register itself),
//     // ensure the request proceeds.
//     console.log(
//       "🔔 Unauthenticated user accessing non-protected path:",
//       pathname,
//       "Proceeding."
//     );
//     return NextResponse.next(); // Crucial to explicitly allow non-protected requests
//   }

//   // ... rest of your middleware logic for authenticated users
//   // If user is logged in, find their role-based route
//   const roleRoute = roles.find((r) => r.name === token?.role);

//   // If authenticated but trying to access a route not allowed for their role
//   if (
//     token &&
//     roleRoute &&
//     !new URL(req.url).pathname.includes(roleRoute?.route)
//   ) {
//     return NextResponse.redirect(new URL(`/${roleRoute?.route}`, req.url));
//   }

//   // Let the request proceed if no issues
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/Register", // Keep /Register if you want middleware to process it.
//     "/admin/:path*", // Matches /admin, /admin/dashboard, /admin/settings etc.
//     "/engineer/:path*", // Matches /engineer, /engineer/profile etc.
//     "/lyricist/:path*", // Matches /lyricist, /lyricist/songs etc.
//     "/singer/:path*", // Matches /singer, /singer/performances etc.
//   ],
// };

// src/middleware.ts
// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define your roles array - make sure this matches your actual roles
const roles = [
  { route: "lyricist" },
  { route: "engineer" },
  { route: "singer" },
  { route: "admin" },
];

export default withAuth(
  (req) => {
    try {
      const token = req.nextauth.token;
      const url = new URL(req.url);
      const pathname = url.pathname;

      // Add logging to help debug on Vercel
      console.log("🔍 Middleware Debug:", {
        pathname,
        hasToken: !!token,
        userRole: token?.role,
        host: url.host,
        origin: url.origin,
      });

      // Build protected paths
      const protectedPaths = roles.map((r) => `/${r.route}`);
      console.log("🛡️ Protected paths:", protectedPaths);

      // 1) NOT signed in → hitting any protectedPath? → send to /Register
      if (!token && protectedPaths.some((p) => pathname.startsWith(p))) {
        console.log("❌ No token, redirecting to Register");
        const registerUrl = new URL("/Register", req.url);
        return NextResponse.redirect(registerUrl);
      }

      // 2) signed in → check role-based access
      if (token && token.role) {
        const userRole = token.role;
        const myBase = `/${userRole}`;

        // Check if user is accessing a different role's path
        const isAccessingWrongRole = protectedPaths.some(
          (path) => pathname.startsWith(path) && !pathname.startsWith(myBase)
        );

        if (isAccessingWrongRole) {
          console.log(`🔄 Wrong role access, redirecting to: ${myBase}`);
          const roleUrl = new URL(myBase, req.url);
          return NextResponse.redirect(roleUrl);
        }
      }

      console.log("✅ Access allowed");
      return NextResponse.next();
    } catch (error) {
      console.error("💥 Middleware error:", error);
      // In case of error, allow the request to continue
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      // This callback determines if the middleware should run
      authorized: () => true, // Always run our custom logic above
    },
  }
);

export const config = {
  matcher: [
    // Match all role routes and their sub-paths
    ...roles.flatMap((r) => [`/${r.route}`, `/${r.route}/:path*`]),
  ],
};
