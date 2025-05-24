import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { roles } from "./lib/Constant"; // Assuming this contains the role-to-route mapping

export default async function middleware(req) {
  const token = await getToken({ req });
console.log('Token:', token);  // Log the token
  console.log('Request URL:', req.url); // Log the URL
  if (!token) {
    const roleRoutes = roles.map((r) => r.route);
    if (roleRoutes.some((route) => req.url.includes(route))) {
      return NextResponse.redirect(new URL("/Register", req.url));
    }
  }

  // If user is logged in, find their role-based route
  const roleRoute = roles.find((r) => r.name === token?.role);

  // If the user is authenticated but trying to access a route not allowed for their role
  if (token && roleRoute && !req.url.includes(roleRoute?.route)) {
    return NextResponse.redirect(new URL(`/${roleRoute?.route}`, req.url));
  }

  // Let the request proceed if no issues
  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/dashboard",
    "/Register",
    "/lyricist",
    "/engineer",
    "/singer",
    "/admin",
  ], // Apply middleware to routes that require authentication
};
