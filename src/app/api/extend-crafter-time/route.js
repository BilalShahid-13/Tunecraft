import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const { orderId, role, crafterId } = await req.json();

  if (!orderId || !role || !crafterId) {
    return NextResponse.json(
      { error: "orderId, role and crafterId are required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Find the order with matching orderId and assigned crafterId for role
    const order = await Order.findOne({
      _id: orderId,
      [`crafters.${role}.assignedCrafterId`]: crafterId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Access nested crafter object
    const crafterData = order.crafters?.[role];
    if (!crafterData) {
      return NextResponse.json(
        { error: `No crafter data found for role: ${role}` },
        { status: 400 }
      );
    }

    const { assignedAtTime, gracePeriodGranted } = crafterData;

    if (!assignedAtTime) {
      return NextResponse.json(
        { error: "Current assigned time not found for this role" },
        { status: 400 }
      );
    }

    if (gracePeriodGranted) {
      return NextResponse.json(
        { error: "Grace period already granted. Time extension not allowed." },
        { status: 400 }
      );
    }

    // Extend assignedAtTime by 2 hours
    const extendedTime = new Date(
      new Date(assignedAtTime).getTime() + 2 * 60 * 60 * 1000
    );

    // Update nested fields using dot notation with Mongoose set
    order.set(`crafters.${role}.assignedAtTime`, extendedTime);
    order.set(`crafters.${role}.gracePeriodGranted`, true);

    await order.save();

    return NextResponse.json(
      { message: "Time extended successfully", extendedTime },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error extending time:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while extending time" },
      { status: 500 }
    );
  }
}
