import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { roles } from "./lib/Constant";

export default async function middleware(req) {
  const url = req.nextUrl;
  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Path:", url.pathname);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  // Simplified token retrieval - let NextAuth handle cookie settings
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Token found:", !!token);
  console.log(
    "Token data:",
    token ? { role: token.role, email: token.email } : "none"
  );
  console.log("========================");

  console.log(
    `[Middleware] Path: ${url.pathname} | Token: ${
      token ? token.role : "none"
    } | Email: ${token?.email || "none"}`
  );

  // Get all role routes
  const roleRoutes = roles.map((r) => `/${r.route}`);
  const isRoleRoute = roleRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  // 1. Block unauthenticated access to role paths
  if (!token && isRoleRoute) {
    console.log(`Redirecting to /Register (unauthenticated)`);
    return NextResponse.redirect(new URL("/Register", url.origin));
  }

  // 2. Handle authenticated users
  if (token) {
    const userRole = token.role;
    const allowedRoute = roles.find((r) => r.name === userRole)?.route;

    // 2a. Redirect from /Register to dashboard if logged in
    if (url.pathname === "/Register") {
      console.log(
        `Redirecting authenticated user from /Register to /${allowedRoute}`
      );
      return NextResponse.redirect(new URL(`/${allowedRoute}`, url.origin));
    }

    // 2b. Enforce role-based routing
    if (
      allowedRoute &&
      isRoleRoute &&
      !url.pathname.startsWith(`/${allowedRoute}`)
    ) {
      console.log(`Role violation: ${userRole} accessing ${url.pathname}`);
      return NextResponse.redirect(new URL(`/${allowedRoute}`, url.origin));
    }
  }

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
