// app/actions/fetchPaymentHistory.js
"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export default async function fetchPaymentHistory() {
  // 1) get the logged-in user
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  // 2) call your API route
  const res = await fetch(`${process.env.BASE_URL}/api/fetch-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      crafterId: session.user.id,
      crafterRole: session.user.role,
    }),
    // cache: "no-store",
  });

  // 3) error-check
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`fetch /payment failed: ${res.status} ${err}`);
  }

  // 4) parse and return
  const { data } = await res.json();
  // return <PaymentHistory data={data} />;
  return data; // this will be your array of payments
}
