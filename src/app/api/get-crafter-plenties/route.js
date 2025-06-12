import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import User from "@/Schema/User";

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
    const tasks = await User.findOne({
      _id: userId,
    });
    // If there are tasks, calculate plentyCount from the first task
    const plentyCount = tasks.penaltyCount;
    return NextResponse.json(
      {
        message: "Data fetched successfully",
        data: plentyCount, // Return the plenty count
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
