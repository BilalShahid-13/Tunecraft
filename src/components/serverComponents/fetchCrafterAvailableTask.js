"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function fetchCrafterAvailableTask(fetchedTasks) {
  const session = await getServerSession(authOptions);
  if (!session) return;
  try {
    if (session) {
      const res = await fetch(`${process.env.BASE_URL}/api/availableTasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: session.user.role,
          userId: session.user.id,
        }),
        next: { revalidate: fetchedTasks ? 0 : 60 },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }
      if (res.status === 200) {
        const data = await res.json();
        return data.data;
      }
    }
  } catch (error) {
    console.error(
      "Error fetching available tasks:",
      error?.response?.data || error.message
    );
    return error?.response?.data || error.message;
  }
}
