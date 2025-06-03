// app/api/admin/crafters-submission-review/route.js

import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import Plan from "@/Schema/Plan";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Find any orders where any crafter has submissionStatus "submitted" or "approved"
    const orders = await Order.find({
      $or: [
        {
          "crafters.lyricist.submissionStatus": {
            $in: ["submitted", "approved"],
          },
        },
        {
          "crafters.singer.submissionStatus": {
            $in: ["submitted", "approved"],
          },
        },
        {
          "crafters.engineer.submissionStatus": {
            $in: ["submitted", "approved"],
          },
        },
      ],
    }).populate([
      "crafters.lyricist.assignedCrafterId",
      "crafters.singer.assignedCrafterId",
      "crafters.engineer.assignedCrafterId",
      { path: "plan" },
    ]);

    // For each order, gather all crafters whose status is "submitted" or "approved"
    const formattedOrders = orders.map((orderDoc) => {
      const order = orderDoc.toObject();
      const roles = ["lyricist", "singer", "engineer"];
      const matchedCrafters = [];

      roles.forEach((role) => {
        const crafterSub = order.crafters[role];
        if (
          crafterSub &&
          ["submitted", "approved"].includes(crafterSub.submissionStatus)
        )
        {
          matchedCrafters.push({
            role,
            assignedCrafterId: crafterSub.assignedCrafterId, // populated User document
            submissionStatus: crafterSub.submissionStatus,
            submittedFile: crafterSub.submittedFile,
            submittedAtTime: crafterSub.submittedAtTime,
            // Add any other fields from crafters[role] if needed
          });
        }
      });

      return {
        _id: order._id,
        orderId: order.orderId,
        name: order.name,
        phone: order.phone,
        email: order.email,
        songGenre: order.songGenre,
        jokes: order.jokes,
        backgroundStory: order.backgroundStory,
        plan: order.plan, // populated Plan document
        musicTemplate: order.musicTemplate,
        currentStage: order.currentStage,
        orderStatus: order.orderStatus,
        finalSongUrl: order.finalSongUrl,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        matchedCrafters, // array of all crafters with status "submitted" or "approved"
      };
    });

    return NextResponse.json(
      {
        message: "Fetched all orders with submitted or approved crafters",
        data: formattedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
