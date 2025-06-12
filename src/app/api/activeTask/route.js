import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import Plan from "@/Schema/Plan";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId, role } = await req.json();
  if (!userId || !role) {
    return NextResponse.json(
      { error: "userId and role is required" },
      { status: 400 }
    );
  }
  try {
    await dbConnect();

    const assignedCrafterIdField = `crafters.${role}.assignedCrafterId`;
    const submissionStatusField = `crafters.${role}.submissionStatus`;
    const rejectedCraftersField = `crafters.${role}.rejectedCrafters`;

    const tasks = await Order.find({
      [assignedCrafterIdField]: userId,
      [submissionStatusField]: { $in: ["assigned", "rejected"] },
      [rejectedCraftersField]: { $nin: [userId] }, // UserId NOT in rejectedCrafters
      currentStage: role,
    }).populate("plan");

    return NextResponse.json({
      message: "Data fetched successfully",
      data: tasks,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
