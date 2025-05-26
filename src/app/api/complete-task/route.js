import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
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
    const query = `crafters.${role}.submissionStatus`;
    const tasks = await Order.find({
      [assignedCrafterIdField]: userId,
      [query]: "approved",
    }).populate({
      path: "plan",
    });
    return NextResponse.json({
      message: "Data fetch successfully",
      data: tasks,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
