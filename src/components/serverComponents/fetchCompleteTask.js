"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function fetchCompleteTask(fetchedTasks) {
  const session = await getServerSession(authOptions);
  if (!session) return;
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/complete-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        role: session.user.role,
      }),
      next: { revalidate: fetchedTasks ? 0 : 60 },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        completeTask: data?.data,
      };
    } else {
      const errorData = await res.json();
      console.error(
        "Error fetching completed tasks:",
        errorData?.message || `HTTP error! status: ${res.status}`
      );
    }
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
  }
}
