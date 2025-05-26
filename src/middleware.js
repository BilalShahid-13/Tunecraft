import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { roles } from "./lib/Constant";

export default withAuth(
  // This middleware function runs AFTER authorization check passes
  function middleware(req) {
    console.log("Middleware req token:", req.nextauth.token);

    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (token) {
      const userRole = token.role;
      const roleRoute = roles.find((r) => r.name === userRole);

      if (roleRoute) {
        const allowedPath = `/${roleRoute.route}`;

        // If user is trying to access a different role's route
        const otherRoleRoutes = roles
          .filter((r) => r.name !== userRole)
          .map((r) => `/${r.route}`);

        if (otherRoleRoutes.some((route) => pathname.startsWith(route))) {
          console.log(
            `Role violation: ${userRole} trying to access ${pathname}`
          );
          return NextResponse.redirect(new URL(allowedPath, req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const protectedRoutes = ["/admin", "/singer", "/engineer", "/lyricist"];

        // If it's not a protected route, allow access
        if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // If it's a protected route, require authentication
        if (!token) {
          console.log("No token, denying access");
          return false; // This will redirect to sign-in page
        }

        // If authenticated, allow access (role checking happens in middleware above)
        console.log("Token found, allowing access");
        return true;
      },
    },
    pages: {
      signIn: "/Register", // Redirect here when unauthorized
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
