// app/api/admin/crafters-alerts/route.js
import { NextResponse } from "next/server";
import Order from "@/Schema/Order";
import { dbConnect } from "@/lib/dbConnect";

const ROLES = ["lyricist", "singer", "engineer"];

export async function GET() {
  try {
    await dbConnect();

    // Find all orders matching your criteria, and populate the crafter refs:
    const orders = await Order.find(
      {
        // only orders with at least one assigned + penalty > 0
        $or: ROLES.map((role) => ({
          [`crafters.${role}.submissionStatus`]: "assigned",
          [`crafters.${role}.penaltyCount`]: { $gt: 0 },
        })),
      },
      { crafters: 1 } // only need crafters sub‐doc
    )
      .populate("crafters.lyricist.assignedCrafterId", "username email role")
      .populate("crafters.singer.assignedCrafterId", "username email role")
      .populate("crafters.engineer.assignedCrafterId", "username email role")
      .lean();

    const alerts = [];

    for (const order of orders) {
      ROLES.forEach((role) => {
        const crafter = order.crafters?.[role];
        if (
          crafter &&
          crafter.submissionStatus === "assigned" &&
          crafter.penaltyCount > 0
        ) {
          alerts.push({
            _orderId: order._id,
            role,
            orderId: order.orderId,
            crafter: crafter.assignedCrafterId, // now a full { _id, username, email, role }
            submissionStatus: crafter.submissionStatus,
            penaltyCount: crafter.penaltyCount,
            extensionGranted: crafter.extension.granted,
            extensionUntil: crafter.extension.until,
            updatedAt: order.updatedAt,
            assignedAtTime: crafter.assignedAtTime,
          });
        }
      });
    }

    return NextResponse.json({ success: true, data: alerts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
