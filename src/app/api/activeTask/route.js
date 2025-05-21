import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import Plan from "@/Schema/Plan";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId, role } = await req.json();
  try {
    await dbConnect();
    const assignedCrafterIdField = `crafters.${role}.assignedCrafterId`;
    const tasks = await Order.find({
      [assignedCrafterIdField]: userId,
      [`crafters.${role}.submissionStatus`]: "assigned",
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
