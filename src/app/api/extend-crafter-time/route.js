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

    const now = new Date();
    const twoHoursMs = 2 * 60 * 60 * 1000;

    // 1) First‐time grant
    if (!crafter.extension.granted) {
      crafter.extension.granted = true;
      crafter.extension.until = new Date(now.getTime() + twoHoursMs);
      crafter.penaltyCount = crafter.penaltyCount + 1;
      await order.save();

      return NextResponse.json(
        {
          message: "2-hour extension granted",
          extensionUntil: crafter.extension.until.toISOString(),
        },
        { status: 200 }
      );
    }

    // 2) Already granted → check if expired
    const expiry = new Date(crafter.extension.until);
    if (now > expiry && crafter.extension.granted) {
      // window expired → reject the submission, reset extension, mark them rejected
      crafter.rejectedCrafters = [...crafter.rejectedCrafters, crafterId];
      crafter.assignedAtTime = null;
      crafter.assignedCrafterId = null;
      crafter.submissionStatus = "available";
      crafter.extension.granted = false;
      crafter.extension.until = null;
      crafter.penaltyCount = crafter.penaltyCount + 1;
      await order.save();
      return NextResponse.json(
        { message: "Extension window expired. Submission cancelled." },
        { status: 205 }
      );
    }

    // 3) if plenty is 3 so freeze all available tasks
    if (crafter.penaltyCount === 3) {
      return NextResponse.json(
        { message: "Your available tasks are freeze now for 2 hours" },
        { status: 204 }
      );
    }

    // 3) Still within their 2-hr window → no change, just inform
    return NextResponse.json(
      {
        message: "Extension is already active",
        extensionUntil: expiry.toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error extending time:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
