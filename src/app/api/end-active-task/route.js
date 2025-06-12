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
    const order = await Order.findOne({
      _id: orderId,
      [`crafters.${role}.assignedCrafterId`]: crafterId,
    });
    const user = await User.findOne({ _id: crafterId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const crafter = order.crafters[role];
    if (!crafter) {
      return NextResponse.json(
        { error: `No crafter data for role: ${role}` },
        { status: 400 }
      );
    }
    if (user.penaltyCount >= 4) {
      return NextResponse.json(
        { error: `You have exceeded the maximum penalty count` },
        { status: 400 }
      );
    }
    const now = new Date();
    const expiry = new Date(crafter.extension.until);

    if (now > expiry) {
      // Time has expired - apply penalty
      crafter.rejectedCrafters = [...crafter.rejectedCrafters, crafterId];
      crafter.assignedAtTime = null;
      crafter.submissionStatus = "available";
      crafter.extension.granted = false;
      crafter.extension.until = null;
      user.penaltyCount = user.penaltyCount + 1;

      await order.save();
      await user.save();
      return NextResponse.json(
        { message: "Extension expired, penalty applied" },
        { status: 200 }
      );
    } else {
      // Time hasn't expired yet
      return NextResponse.json(
        {
          message: "Extension still valid",
          extensionUntil: expiry.toISOString(),
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
