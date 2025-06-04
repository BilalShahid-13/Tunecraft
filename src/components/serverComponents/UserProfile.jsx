// app/components/UserProfile.jsx
"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export default async function UserProfileAction() {
  // 1) getServerSession returns a Promise, so await it:
  const session = await getServerSession(authOptions);
  return {
    email: session?.user?.email,
    username: session?.user?.username,
    role: session?.user?.role,
  }
}
