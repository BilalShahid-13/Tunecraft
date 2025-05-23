import { currentStageEnum, submissionStatusEnum } from "@/lib/Constant";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import { NextResponse } from "next/server";

export async function PATCH(res) {
  const { orderId, role, prevRole } = await res.json();
  if (!orderId || !role || !prevRole) {
    return NextResponse.json(
      { error: "orderId and role and prevRole is required" },
      { status: 400 }
    );
  }
  try {
    await dbConnect();
    const order = await Order.findById(orderId);
    if (role === "engineer") {
      order.currentStage = "done";
      order.crafters[role].submissionStatus = "approved";
    }
    order.currentStage = role;
    order.crafters[role].submissionStatus = "available";
    order.crafters[prevRole].submissionStatus = "approved";
    await order.save();
    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
