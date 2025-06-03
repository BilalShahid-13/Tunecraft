"use server";

import { authOptions } from "@/lib/auth";
import { prevRole } from "@/lib/utils";
import { getServerSession } from "next-auth";

export default async function fetchActiveTask(fetchedTasks) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${process.env.BASE_URL}/api/activeTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: session.user.role,
        userId: session.user.id,
      }),
      // Cache this on the server for 60 seconds
      next: { revalidate: fetchedTasks ? 0 : 60 },
    });

    if (res.ok) {
      const json = await res.json();
      const tasks = Array.isArray(json.data) ? json.data : [];

      if (tasks.length > 0) {
        const data = tasks[0];
        const newTaskData = {
          orderId: data._id,
          title: data.musicTemplate,
          des: data.jokes,
          requirements: data.backgroundStory,
          clientName: data.name,
          dueData: data.crafters[session.user.role]?.assignedAtTime || "",
          submittedFileUrls:
            data.crafters[prevRole(session.user.role)]?.submittedFileUrl,
        };
        return {
          activeTask: tasks,
          data: newTaskData,
        };
      }
    }
  } catch (error) {
    console.error(
      "Error fetching active tasks:",
      error.response?.data || error.message
    );
  }

  return null;
}
