import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const { orderId, role, userId } = await req.json();
  console.log("patch", orderId, role, userId);
  try {
    await dbConnect();

    if (!orderId || !role || !userId) {
      return NextResponse.json({
        message: "Order ID, role, and userId are required",
      });
    }
    const existingInProgressOrder = await Order.findOne({
      [`crafters.${role}.assignedCrafterId`]: userId,
      // [`crafters.${role}.submissionStatus`]: { $in: ["assigned", "submitted"] },
      [`crafters.${role}.submissionStatus`]: "assigned",
      orderStatus: "in-progress",
    });

    if (existingInProgressOrder) {
      return NextResponse.json(
        {
          error:
            "You must complete your current order before picking a new one.",
        },
        { status: 400 }
      );
    }

    const order = await Order.findById({
      _id: orderId,
    });
    order.orderStatus = "in-progress";
    order.crafters[role].submissionStatus = "assigned";
    order.crafters[role].assignedCrafterId = userId;
    // order.crafters[role].taskDeadline = new Date();

    if (!order) {
      return NextResponse.json({
        message: "Order not found or already started",
      });
    }
    // order.crafters[role].taskDeadline = new Date();
    order.crafters[role].taskDeadline = new Date(
      new Date().getTime() + 3 * 60 * 60 * 1000
    );

    await order.save();

    return NextResponse.json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
