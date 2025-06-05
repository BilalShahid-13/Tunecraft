import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Order from "@/Schema/Order"; // Assuming Order is your mongoose schema

export async function POST(req) {
  const { userId, role } = await req.json();

  if (!userId || !role) {
    return NextResponse.json(
      { error: "userId and role are required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Adjust the query to filter by userId and role correctly
    const assignedCrafterIdField = `crafters.${role}.assignedCrafterId`;

    // Query the database for tasks related to the crafter's assigned tasks
    const tasks = await Order.find({
      [assignedCrafterIdField]: userId,
      currentStage: role, // Filter tasks by current stage
    });

    // If there are tasks, calculate plentyCount from the first task
    const plentyCount =
      tasks.length > 0 ? tasks[0]?.crafters?.[role]?.penaltyCount : 0;
    return NextResponse.json(
      {
        message: "Data fetched successfully",
        data: plentyCount, // Return the plenty count
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log the error to check the root cause
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
