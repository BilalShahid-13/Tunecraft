// app/actions/fetchActiveTask.js
"use server";

import { authOptions } from "@/lib/auth";
import { prevRole } from "@/lib/utils";
import { getServerSession } from "next-auth/next";

export default async function fetchActiveTask(fetchedTasks = false) {
  // 1) Get the session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    console.error("Error fetching active tasks: No user session.");
    return {
      activeTask: [],
      crafterTask: null,
    };
  }

  try {
    // 2) Call your API route
    const res = await fetch(`${process.env.BASE_URL}/api/activeTask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: session.user.role,
        userId: session.user.id,
      }),
      // next: { revalidate: fetchedTasks ? 0 : 60 },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.error(
        "Error fetching active tasks:",
        errJson.message || `HTTP status ${res.status}`
      );
      return {
        activeTask: [],
        crafterTask: null,
      };
    }

    // 3) Parse JSON and extract tasks array
    const json = await res.json();
    const tasks = Array.isArray(json.data) ? json.data : [];

    if (tasks.length === 0) {
      // No active tasks
      return {
        activeTask: [],
        crafterTask: null,
      };
    }

    // 4) Build crafterTask from the first active task
    const firstTask = tasks[0];
    let newTaskData = {};
    if (firstTask.crafters[session.user.role].extension.granted === true) {
      newTaskData = {
        orderId: firstTask._id,
        title: firstTask.musicTemplate,
        songGenre: firstTask.songGenre,
        des: firstTask.jokes,
        requirements: firstTask.backgroundStory,
        clientName: firstTask.name,
        plan: firstTask.plan,
        currentStage: firstTask.currentStage,
        dueDate: firstTask.crafters?.[session.user.role]?.extension.until,
        submittedFileUrls:
          firstTask.crafters?.[prevRole(session.user.role)]?.submittedFileUrl ||
          [],
      };
    } else {
      newTaskData = {
        orderId: firstTask._id,
        title: firstTask.musicTemplate,
        songGenre: firstTask.songGenre,
        des: firstTask.jokes,
        plan: firstTask.plan,
        requirements: firstTask.backgroundStory,
        currentStage: firstTask.currentStage,
        clientName: firstTask.name,
        dueDate: firstTask.crafters?.[session.user.role]?.taskDeadline,
        submittedFileUrls:
          firstTask.crafters?.[prevRole(session.user.role)]?.submittedFileUrl ||
          [],
      };
    }

    return {
      activeTask: tasks,
      crafterTask: [newTaskData],
    };
  } catch (error) {
    console.error(
      "Error fetching active tasks:",
      error.response?.data || error.message
    );
    return {
      activeTask: [],
      crafterTask: null,
    };
  }
}
