import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { roles } from "./lib/Constant";

export default async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  console.log("pathname", req.nextUrl, "token", token);

 const roleRoutes = roles.map((r) => `/${r.route}`);

  // Check if accessing a role-protected route
  const isRoleRoute = roleRoutes.some(route => pathname.startsWith(route));

  // If not authenticated and trying to access role-protected route
  if (!token && isRoleRoute) {
    console.log("Redirecting to Register - no token for protected route");
    return NextResponse.redirect(new URL("/Register", req.url));
  }

  // If user is authenticated
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
    "/Register",
    "/lyricist/:path*",
    "/engineer/:path*",
    "/singer/:path*",
    "/admin/:path*",
  ],
};
