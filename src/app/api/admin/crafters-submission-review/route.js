import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Define review stages
    const reviewStages = [
      "review_lyricist",
      "review_singer",
      "review_engineer",
    ];

    // Fetch orders where any crafter (lyricist, singer, or engineer) has submitted their work
    const tasks = await Order.find({
      $or: [
        { "crafters.lyricist.submissionStatus": "submitted" },
        { "crafters.singer.submissionStatus": "submitted" },
        { "crafters.engineer.submissionStatus": "submitted" },
      ],
      currentStage: { $in: reviewStages }, // Tasks in review stages
    });

    // Process each task to find the assigned crafter based on who has submitted
    const tasksWithCrafters = [];

    let crafter = null;
    for (const task of tasks) {

      // Check which crafter has "submitted" status and fetch the assignedCrafterId
      if (task.crafters.lyricist.submissionStatus === "submitted") {
        crafter = await User.findById(task.crafters.lyricist.assignedCrafterId);
      } else if (task.crafters.singer.submissionStatus === "submitted") {
        crafter = await User.findById(task.crafters.singer.assignedCrafterId);
      } else if (task.crafters.engineer.submissionStatus === "submitted") {
        crafter = await User.findById(task.crafters.engineer.assignedCrafterId);
      }

      // If a crafter is found, add the task and crafter info to the result
      if (crafter) {
        tasksWithCrafters.push({
          ...task.toObject(),
          crafter: crafter // Add crafter details
        });
      }
    }

    return NextResponse.json({
      message: "Data fetched successfully",
      data: {
        tasks: tasks,
        crafter:{tasksWithCrafters,crafter}
       },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
