// import { getToken } from "next-auth/jwt";
import { roles } from "./lib/Constant"; // Assuming this contains the role-to-route mapping

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

export default withAuth(
  (req) => {
    const token = req.nextauth.token; // your JWT payload
    const url = new URL(req.url);
    const pathname = url.pathname; // e.g. "/singer", "/admin/dashboard"

    // build an array of protected role-paths: ["/admin", "/singer", …]
    const protectedPaths = roles.map((r) => `/${r.route}`);

    // 1) NOT signed in → hitting any protectedPath? → send to /Register
    if (!token && protectedPaths.some((p) => pathname === p)) {
      return NextResponse.redirect(new URL("/Register", url));
    }

    // 2) signed in → dialing into someone else’s protectedPath?
    if (token) {
      // find what the user’s own base path would be
      const myBase = `/${token.role}`;
      // if they’re trying to hit *another* role’s root
      if (protectedPaths.includes(pathname) && pathname !== myBase) {
        return NextResponse.redirect(new URL(myBase, url));
      }
    }

    // otherwise allow through
    return NextResponse.next();
  },
  {
    callbacks: {
      // during dev/testing, let every request run your handler
      authorized: () => true,
    },
  }
);

// match all of your role routes (and sub-paths) in one go:
export const config = {
  matcher: roles.map((r) => `/${r.route}/:path*`),
};
