import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Explicitly specify edge runtime
// export const runtime = "edge";

// Define your roles array
const roles = [{ route: "admin" }, { route: "singer" }];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log("🔥 MIDDLEWARE RUNNING ON VERCEL!");
  console.log("📍 Path:", pathname);

  // Skip middleware for non-protected paths
  const protectedPaths = ["/admin", "/singer", "lyricist", "engineer"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    console.log("✅ Not a protected path, allowing");
    return NextResponse.next();
  }

  console.log("🔒 This is a protected path!");

  try {
    // Try to get token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("🎫 Token check:");
    console.log("- Has token:", !!token);
    console.log("- Token content:", token);

    // Check cookies manually
    const allCookies = {};
    request.cookies.forEach((cookie, name) => {
      allCookies[name] = cookie.value;
    });
    console.log("🍪 All cookies:", allCookies);

    // Check specific auth cookies
    const sessionToken = request.cookies.get("next-auth.session-token");
    const secureSessionToken = request.cookies.get(
      "__Secure-next-auth.session-token"
    );

    console.log("🔑 Auth cookies:");
    console.log("- session-token:", !!sessionToken);
    console.log("- secure-session-token:", !!secureSessionToken);

    // If no token found, redirect to Register
    if (!token) {
      console.log("❌ NO TOKEN FOUND - REDIRECTING TO REGISTER");
      const registerUrl = new URL("/Register", request.url);
      return NextResponse.redirect(registerUrl);
    }

    // If token exists, check role
    console.log("✅ Token found!");
    console.log("👤 User role:", token.role);
    console.log("📧 User email:", token.email);

    // Check if user has the right role for the path
    if (pathname.startsWith("/admin") && token.role !== "admin") {
      console.log("🚫 Not admin role, redirecting to Register");
      return NextResponse.redirect(new URL("/Register", request.url));
    }

    if (pathname.startsWith("/singer") && token.role !== "singer") {
      console.log("🚫 Not singer role, redirecting to Register");
      return NextResponse.redirect(new URL("/Register", request.url));
    }

    console.log("✅ Access granted!");
    return NextResponse.next();
  } catch (error) {
    console.error("💥 Middleware error:", error);
    console.log("❌ Error occurred, redirecting to Register");
    return NextResponse.redirect(new URL("/Register", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/singer/:path*",
    "/engineer/:path*",
    "/lyricist/:path*",
    "/admin",
    "/singer",
    "/lyricist",
    "/engineer",
  ],
};
