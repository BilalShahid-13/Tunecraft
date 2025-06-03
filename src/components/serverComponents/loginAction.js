"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // to read the newly created session, if you need it
import { authOptions } from "@/lib/auth"; // your NextAuth options
import { cookies } from "next/headers"; // to forward cookies back to the browser

/**
 * A Server Action that receives formData with email+password,
 * POSTS it to NextAuth’s credentials callback, and then redirects or throws.
 */
export async function loginAction(formData) {
  // 1) Extract the form fields:
  const email = formData.get("email");
  const password = formData.get("password");

  // 2) First you need a valid CSRF token (NextAuth requires one on /callback/credentials).
  //    You can fetch it from /api/auth/csrf:
  const csrfRes = await fetch(`${process.env.BASE_URL}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();

  // 3) Now POST to NextAuth’s credentials callback endpoint:
  //    We send application/x-www-form-urlencoded data exactly as NextAuth expects.
  const body = new URLSearchParams({
    // NextAuth expects these fields by default:
    csrfToken,
    callbackUrl: "/", // or wherever you want to land on success
    email,
    password,
  }).toString();

  const authRes = await fetch(
    `${process.env.BASE_URL}/api/auth/callback/credentials`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      // This is important: tell Next.js to forward any Set-Cookie headers back to the client:
      // (in Next 13.4+ server actions, `fetch` from the same origin will automatically forward Set-Cookie,
      // but if you’re on an older Next.js you may need to explicitly do `credentials: "include"`)
      credentials: "include",
      next: { revalidate: 0 },
    }
  );

  // 4) If NextAuth returns a 200 + JSON, it means credentials checked out but we still need to inspect redirect URL:
  //    On success, NextAuth usually responds with a 200 and JSON like { ok: true, url: "/somewhere" }.
  const authJson = await authRes.json();

  if (authRes.ok && authJson.ok) {
    // The cookie has already been set by NextAuth. We can now redirect:
    return NextResponse.redirect(authJson.url || "/");
  } else {
    // Invalid credentials → error JSON from NextAuth will be in authJson.error
    // You can throw or return a Response with an error message:
    throw new Error(authJson.error || "Invalid credentials");
  }
}
