import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { roles } from "./lib/Constant";

const protectedRoutes = ["/admin", "/singer", "/engineer", "/lyricist"];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // Handle Register page - redirect authenticated users to their role-based page
  if (pathname.startsWith("/Register")) {
    if (token) {
      const roleRoute = roles.find((r) => r.name === token?.role);
      if (roleRoute) {
        const allowedPath = `/${roleRoute.route}`;
        return NextResponse.redirect(new URL(allowedPath, req.url));
      }
    }
    // If not authenticated, allow access to Register page
    return NextResponse.next();
  }

  // Handle protected routes
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // If user is not authenticated for protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/Register", req.url));
  }

  // If user is authenticated for protected routes
  if (token) {
    // Find their role-based route
    const roleRoute = roles.find((r) => r.name === token?.role);

    if (roleRoute) {
      const allowedPath = `/${roleRoute.route}`;

      // If user is trying to access a different role's route, redirect to their allowed route
      const otherRoleRoutes = roles
        .filter((r) => r.name !== token?.role)
        .map((r) => `/${r.route}`);

      if (otherRoleRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL(allowedPath, req.url));
      }
    }
  }

  // Let the request proceed if no issues
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Register/:path*",
    "/lyricist/:path*",
    "/engineer/:path*",
    "/singer/:path*",
    "/admin/:path*",
  ],
};
