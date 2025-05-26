// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import { roles } from "./src/lib/Constant"; // Assuming this contains the role-to-route mapping

// export default async function middleware(req) {
//   const token = await getToken({ req });
//   console.log('token',token)

//   if (!token) {
//     const roleRoutes = roles.map((r) => r.route);
//     if (roleRoutes.some((route) => req.url.includes(route))) {
//       return NextResponse.redirect(new URL("/Register", req.url));
//     }
//   }

//   // If user is logged in, find their role-based route
//   const roleRoute = roles.find((r) => r.name === token?.role);

//   // If the user is authenticated but trying to access a route not allowed for their role
//   if (token && roleRoute && !req.url.includes(roleRoute?.route)) {
//     return NextResponse.redirect(new URL(`/${roleRoute?.route}`, req.url));
//   }

//   // Let the request proceed if no issues
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/Register",
//     "/lyricist",
//     "/engineer",
//     "/singer",
//     "/admin",
//   ], //
// };

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { roles } from "./lib/Constant"; // Assuming this contains the role-to-route mapping

export default async function middleware(req) {
  const token = await getToken({ req });
  console.log("token", token);

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
  matcher: ["/Register", "/lyricist", "/engineer", "/singer", "/admin"],
};
