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
    const orders = await Order.find({
      [assignedCrafterIdField]: userId,
      [`crafters.${role}.submissionStatus`]: "submitted",
      currentStage: `review_${role}`,
    }).populate("plan");
    return NextResponse.json({
      message: "Data fetched successfully",
      data: orders,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
