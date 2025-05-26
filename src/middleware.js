import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const userRole = req.nextauth.token?.role;

    console.log(`Path: ${pathname}, Role: ${userRole}`);

    // Role-based routing
    const roleRoutes = {
      admin: "/admin",
      singer: "/singer",
      engineer: "/engineer",
      lyricist: "/lyricist",
    };

    const allowedPath = roleRoutes[userRole];

    // If user is accessing wrong role route, redirect to their route
    if (allowedPath && !pathname.startsWith(allowedPath)) {
      const otherRoutes = Object.values(roleRoutes).filter(
        (route) => route !== allowedPath
      );

      if (otherRoutes.some((route) => pathname.startsWith(route))) {
        console.log(
          `Redirecting ${userRole} from ${pathname} to ${allowedPath}`
        );
        return NextResponse.redirect(new URL(allowedPath, req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const protectedRoutes = ["/admin", "/singer", "/engineer", "/lyricist"];

        // Allow access to non-protected routes
        if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
    pages: {
      signIn: "/Register",
    },
  }
);

export const config = {
  matcher: [
    "/Register",
    "/lyricist/:path*",
    "/engineer/:path*",
    "/singer/:path*",
    "/admin/:path*",
  ],
};
