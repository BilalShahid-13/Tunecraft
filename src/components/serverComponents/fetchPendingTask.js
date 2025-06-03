"use server";

import { authOptions } from "@/lib/auth";
import { prevRole } from "@/lib/utils";
import { getServerSession } from "next-auth";

export default async function fetchPendingTask(fetchedTasks) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    console.error("Error fetching pending tasks: User session not found.");
    return; // Or throw an error, or return a default value
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/api/pending-tasks`, {
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

    if (res.ok) {
      const data = await res.json();
      const tasks = data?.data;

      if (Array.isArray(tasks) && tasks.length > 0) {
        const firstTask = tasks[0];
        const newTaskData = {
          orderId: firstTask?._id,
          title: firstTask?.musicTemplate,
          des: firstTask?.jokes,
          requirements: firstTask?.backgroundStory,
          clientName: firstTask?.name,
          dueData:
            firstTask?.crafters?.[session.user.role]?.assignedAtTime || "",
          submittedFileUrls:
            firstTask?.crafters?.[prevRole(session.user.role)]?.submittedFile,
        };
        // setCrafterTask(newTaskData, "pending");
        return {
          pendingTask: tasks,
          crafterTask: newTaskData,
        };
      }
    } else {
      const errorData = await res.json();
      console.error(
        "Error fetching pending tasks:",
        errorData?.message || `HTTP error! status: ${res.status}`
      );
    }
  } catch (error) {
    console.error("Error fetching pending tasks:", error);
  }
}
