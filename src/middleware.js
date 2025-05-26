import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { roles } from "./lib/Constant"; // Assuming this contains the role-to-route mapping

export default async function middleware(req) {
  console.log("🔔 middleware running on path:", new URL(req.url).pathname);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token:", token);
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies);

  // If no token and trying to access a role-based route, redirect to /Register
  if (!token) {
    const roleRoutes = roles.map((r) => r.route);
    const pathname = new URL(req.url).pathname;

    // Only redirect if the path matches exactly
    if (roleRoutes.some((route) => pathname === `/${route}`)) {
      return NextResponse.redirect(new URL("/Register", req.url));
    }
  }
  // If user is logged in, find their role-based route
  const roleRoute = roles.find((r) => r.name === token?.role);

  // If authenticated but trying to access a route not allowed for their role
  if (
    token &&
    roleRoute &&
    !new URL(req.url).pathname.includes(roleRoute?.route)
  ) {
    return NextResponse.redirect(new URL(`/${roleRoute?.route}`, req.url));
  }

  // Let the request proceed if no issues
  return NextResponse.next();
}

export const config = {
  matcher: ["/Register", "/admin", "/engineer", "/lyricist", "/singer"],
};
