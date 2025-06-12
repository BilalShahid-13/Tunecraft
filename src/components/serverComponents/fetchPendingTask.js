// app/actions/fetchPendingTask.js
"use server";

import { authOptions } from "@/lib/auth";
import { prevRole } from "@/lib/utils";
import { getServerSession } from "next-auth/next";

export default async function fetchPendingTask(fetchedTasks = false) {
  // 1) Get the session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    console.error("Error fetching pending tasks: User session not found.");
    // Always return a default object
    return {
      pendingTask: [],
      crafterTask: null,
    };
  }

  try {
    // 2) Call your API route
    const res = await fetch(`${process.env.BASE_URL}/api/pending-tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: session.user.role,
        userId: session.user.id,
      }),
      next: { revalidate: fetchedTasks ? 0 : 60 },
    });

    // 3) If the HTTP status isn’t 2xx, log and return defaults
    if (!res.ok) {
      let errorData = {};
      try {
        errorData = await res.json();
      } catch {}
      console.error(
        "Error fetching pending tasks:",
        errorData?.message || `HTTP error! status: ${res.status}`
      );
      return {
        pendingTask: [],
        crafterTask: null,
      };
    }

    // 4) Parse the JSON body
    const responseJson = await res.json();
    const tasks = Array.isArray(responseJson?.data) ? responseJson.data : [];

    // 5) If no tasks, return defaults
    if (tasks.length === 0) {
      return {
        pendingTask: [],
        crafterTask: null,
      };
    }

    // 6) Otherwise, build crafterTask from the first pending task
    const firstTask = tasks[0];
    const newTaskData = {
      orderId: firstTask._id,
      title: firstTask.musicTemplate,
      des: firstTask.jokes,
      requirements: firstTask.backgroundStory,
      adminFeedback: firstTask.crafters?.[session.user.role]?.adminFeedback,
      crafterFeedback: firstTask.crafters?.[session.user.role]?.crafterFeedback,
      clientName: firstTask.name,
      userStatus: "pending",
      dueDate: firstTask.crafters?.[session.user.role]?.assignedAtTime || "",
      submittedFileUrls:
        firstTask.crafters?.[prevRole(session.user.role)]?.submittedFile || [],
    };

    return {
      pendingTask: tasks,
      crafterTask: newTaskData,
    };
  } catch (error) {
    console.error("Error fetching pending tasks:", error);
    return {
      pendingTask: [],
      crafterTask: null,
    };
  }
}
